import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  Keyboard,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

type Puzzle = {
  id: string;
  type: "caesar" | "hex" | "anagram";
  prompt: string;
  data: string;    // encoded/scrambled input shown to player
  answer: string;  // intended answer (used for anagram + fallback)
  basePoints?: number;
  hint?: string;
};

// Updated puzzles (no repeated “hello”)
const PUZZLES: Puzzle[] = [
  {
    id: "p1",
    type: "caesar",
    prompt: "This message uses a Caesar cipher (shift by 3). Decode it:",
    data: "uhdfw",   // 'react' shifted +3
    answer: "react",
    basePoints: 50,
    hint: "Shift letters 3 to the left.",
  },
  {
    id: "p2",
    type: "hex",
    prompt: "This value is hex — convert to ASCII/text:",
    data: "776f726c64", // "world"
    answer: "world",
    basePoints: 60,
    hint: "Hex pairs -> bytes -> ASCII characters.",
  },
  {
    id: "p3",
    type: "anagram",
    prompt: "Unscramble the letters to form an English word:",
    data: "rpae",
    answer: "pear",
    basePoints: 40,
    hint: "A fruit with 4 letters.",
  },
  {
    id: "p4",
    type: "caesar",
    prompt: "Caesar cipher (shift by 5). Decode:",
    data: "vzjxy",   // 'quest' shifted +5
    answer: "quest",
    basePoints: 70,
    hint: "Shift letters 5 to the left.",
  },
  {
    id: "p5",
    type: "hex",
    prompt: "Hex to text:",
    data: "67616d6573", // 'games'
    answer: "games",
    basePoints: 80,
    hint: "Hex for letters g a m e s.",
  },
];

const LEADERBOARD_KEY = "@raps_crypto_leaderboard_v1";
const ROUND_SECONDS = 60;
const HINT_COST = 20;

export default function CryptoPuzzleScreen() {
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(PUZZLES[0] ?? null);
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [score, setScore] = useState(0);
  const [usedHint, setUsedHint] = useState(false);
  const [leaderboard, setLeaderboard] = useState<{ name: string; score: number; date: string }[]>(
    []
  );

  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef<number>(Date.now());

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Helpers: decode + normalize
  const normalized = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]/gi, "");

  const onlyLetters = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "");

  const caesarDecode = (text: string, shift: number) => {
    if (!Number.isFinite(shift)) shift = 0;
    shift = ((shift % 26) + 26) % 26;
    return text
      .replace(/[a-z]/gi, (c) => {
        const isLower = c >= "a" && c <= "z";
        const base = isLower ? "a".charCodeAt(0) : "A".charCodeAt(0);
        const code = c.charCodeAt(0) - base;
        const dec = (code - shift + 26) % 26;
        return String.fromCharCode(base + dec);
      })
      .toLowerCase();
  };

  const hexToText = (hex: string) => {
    const clean = hex.replace(/\s+/g, "");
    if (!/^[0-9a-f]+$/i.test(clean) || clean.length % 2 !== 0) return "";
    let out = "";
    for (let i = 0; i < clean.length; i += 2) {
      const code = parseInt(clean.slice(i, i + 2), 16);
      out += String.fromCharCode(code);
    }
    return out.toLowerCase();
  };

  // Compute expected answer from the puzzle data (safer than trusting static answer)
  const expectedFromData = (p: Puzzle): string => {
    if (!p) return "";
    if (p.type === "caesar") {
      const m = p.prompt.match(/shift\s*by\s*(\d+)/i);
      const sh = m ? parseInt(m[1], 10) : 0;
      return caesarDecode(p.data, sh);
    }
    if (p.type === "hex") {
      return hexToText(p.data);
    }
    // anagram: stick to the intended word to avoid accidental “valid but unwanted” words
    return p.answer.toLowerCase();
  };

  // Load leaderboard
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(LEADERBOARD_KEY);
        if (raw) setLeaderboard(JSON.parse(raw));
      } catch (e) {
        console.warn("LB load", e);
      }
    })();
  }, []);

  // Initialize puzzle on index change
  useEffect(() => {
    if (isGameOver) return;
    const p = PUZZLES[index];
    setPuzzle(p ?? null);
    setInput("");
    setTimeLeft(ROUND_SECONDS);
    setUsedHint(false);
    startRef.current = Date.now();
  }, [index, isGameOver]);

  // Countdown timer
  useEffect(() => {
    if (!puzzle || isGameOver) return;
    stopTimer();

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          stopTimer();
          handleTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return stopTimer;
  }, [puzzle?.id, isGameOver]);

  const endGame = () => {
    stopTimer();
    setIsGameOver(true);
    setSaveModalVisible(true);
  };

  const handleTimeout = () => {
    stopTimer();
    Alert.alert("Time's up!", "You didn't solve the puzzle in time.", [
      { text: "Try next", onPress: () => nextPuzzle() },
      { text: "Exit", style: "cancel", onPress: () => router.back() },
    ]);
  };

  const checkAnswer = () => {
    if (!puzzle) return;

    const expected = expectedFromData(puzzle);              // <-- compute from data
    const correct = normalized(expected);
    const guess = normalized(input);

    if (guess === correct) {
      const base = puzzle.basePoints ?? 50;
      const timeBonus = Math.max(0, timeLeft);
      const pts = Math.max(0, base + timeBonus);
      setScore((s) => s + pts);

      Alert.alert("Correct 🎉", `You earned ${pts} points.`, [
        { text: "Next", onPress: () => nextPuzzle() },
      ]);
    } else {
      Alert.alert("Incorrect", "Try again or use a hint.");
    }
    Keyboard.dismiss();
  };

  const nextPuzzle = () => {
    if (index + 1 >= PUZZLES.length) {
      endGame();
      return;
    }
    setIndex((i) => i + 1);
  };

  const askHint = () => {
    if (!puzzle || isGameOver) return;
    if (usedHint) return;
    if (score < HINT_COST) {
      Alert.alert("Not enough points", `You need ${HINT_COST} points to get a hint.`);
      return;
    }

    const expected = expectedFromData(puzzle);
    const correct = normalized(expected);
    const guess = normalized(input);

    if (guess === correct) {
      Alert.alert("All set", "You already have all letters in place.");
      return;
    }

    // Reveal first mismatching position (normalized space)
    let revealIndex = 0;
    while (revealIndex < correct.length && guess[revealIndex] === correct[revealIndex]) {
      revealIndex++;
    }

    if (revealIndex >= correct.length) {
      Alert.alert("All set", "You already have all letters in place.");
      return;
    }

    const newGuess = correct.slice(0, revealIndex + 1) + (guess.slice(revealIndex + 1) || "");
    setInput(newGuess);
    setScore((s) => s - HINT_COST); // charged once
    setUsedHint(true);
  };

  const saveScore = async (name: string) => {
    try {
      const entry = { name: name || "Guest", score, date: new Date().toISOString() };
      const updated = [...leaderboard, entry].sort((a, b) => b.score - a.score).slice(0, 10);
      setLeaderboard(updated);
      await AsyncStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updated));
      Alert.alert("Saved", "Your score was saved to the leaderboard.");
    } catch (e) {
      console.warn("save", e);
    }
  };

  const ResetGame = () => {
    stopTimer();
    setIsGameOver(false);
    setIndex(0);
    setScore(0);
    setInput("");
  };

  const renderedHint = useMemo(() => {
    if (!puzzle) return "";
    if (puzzle.hint) return puzzle.hint;
    if (puzzle.type === "caesar") return "Try shifting letters by a fixed amount.";
    if (puzzle.type === "hex") return "Split into byte-sized hex pairs and convert.";
    if (puzzle.type === "anagram") return "Try common English words made from letters.";
    return "";
  }, [puzzle]);

  const canAffordHint = score >= HINT_COST && !usedHint && !isGameOver;

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.smallBtn}
          onPress={() => {
            stopTimer();
            router.back();
          }}
        >
          <Text style={styles.smallBtnText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Crypto Puzzle</Text>
        <View style={{ width: 60 }}>
          <Text style={styles.smallText}>Score</Text>
          <Text style={styles.score}>{score}</Text>
        </View>
      </View>

      <View style={styles.card}>
        {isGameOver ? (
          <>
            <Text style={styles.prompt}>Game Over 🎯</Text>
            <Text style={[styles.prompt, { marginBottom: 12 }]}>
              You completed all puzzles. Save your score or play again.
            </Text>

            <View style={styles.row}>
              <TouchableOpacity style={[styles.btnPrimary, { flex: 1 }]} onPress={ResetGame}>
                <Text style={styles.btnText}>Play Again</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btnSecondary, { flex: 1 }]}
                onPress={() => setSaveModalVisible(true)}
              >
                <Text style={styles.btnText}>Save Score</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.prompt}>{puzzle?.prompt}</Text>

            <View style={styles.dataBox}>
              <Text selectable style={styles.dataText}>
                {puzzle?.data}
              </Text>
            </View>

            <Text style={styles.timer}>⏱ {timeLeft}s</Text>

            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Type your answer"
              placeholderTextColor="#888"
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={styles.row}>
              <TouchableOpacity style={styles.btnPrimary} onPress={checkAnswer}>
                <Text style={styles.btnText}>Submit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btnSecondary, !canAffordHint && { opacity: 0.5 }]}
                onPress={askHint}
                disabled={!canAffordHint}
              >
                <Text style={styles.btnText}>Hint (-{HINT_COST})</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.hintLabel}>Hint: {renderedHint}</Text>
          </>
        )}
      </View>

      <View style={styles.leaderboard}>
        <Text style={styles.lbTitle}>Leaderboard</Text>

        <FlatList
          data={leaderboard}
          keyExtractor={(item, i) => `${item.date}_${item.name}_${i}`}
          renderItem={({ item, index }) => (
            <View style={styles.lbRow}>
              <Text style={styles.lbText}>
                {index + 1}. {item.name}
              </Text>
              <Text style={styles.lbText}>{item.score}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.lbEmpty}>No scores yet</Text>}
          keyboardShouldPersistTaps="handled"
        />

        <View style={styles.lbActions}>
          <TouchableOpacity style={styles.btnSecondary} onPress={() => setSaveModalVisible(true)}>
            <Text style={styles.btnText}>Save Score</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnSecondary} onPress={ResetGame}>
            <Text style={styles.btnText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        transparent
        visible={saveModalVisible}
        animationType="fade"
        onRequestClose={() => setSaveModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Save Score</Text>
            <TextInput
              value={playerName}
              onChangeText={setPlayerName}
              placeholder="Enter your name"
              placeholderTextColor="#888"
              style={styles.input}
              autoCapitalize="words"
              autoCorrect={false}
            />
            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.btnSecondary, { flex: 1 }]}
                onPress={() => setSaveModalVisible(false)}
              >
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnPrimary, { flex: 1 }]}
                onPress={async () => {
                  await saveScore(playerName.trim());
                  setPlayerName("");
                  setSaveModalVisible(false);
                }}
              >
                <Text style={styles.btnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 16, backgroundColor: "#0b0b0b" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  title: { color: "#fff", fontSize: 20, fontWeight: "700" },
  smallBtn: { padding: 8, backgroundColor: "#222", borderRadius: 8 },
  smallBtnText: { color: "#fff" },
  smallText: { color: "#aaa", fontSize: 12, textAlign: "right" },
  score: { color: "#FFCF3D", fontWeight: "700", fontSize: 16, textAlign: "right" },

  card: { backgroundColor: "#141414", padding: 14, borderRadius: 12, marginBottom: 12 },
  prompt: { color: "#ddd", marginBottom: 8, fontSize: 14 },
  dataBox: { backgroundColor: "#0f0f0f", padding: 10, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: "#222" },
  dataText: { color: "#cfcfcf", fontSize: 16, letterSpacing: 1.2 },
  timer: { color: "#ff7b7b", fontWeight: "700", marginBottom: 8 },

  input: { backgroundColor: "#0b0b0b", borderColor: "#333", borderWidth: 1, padding: 12, borderRadius: 8, color: "#fff", marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  btnPrimary: { backgroundColor: "#1db954", paddingVertical: 12, borderRadius: 8, alignItems: "center", paddingHorizontal: 12 },
  btnSecondary: { backgroundColor: "#FF6B35", paddingVertical: 12, paddingHorizontal: 12, borderRadius: 8, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700" },
  hintLabel: { marginTop: 10, color: "#aaa", fontSize: 13 },

  leaderboard: { backgroundColor: "#111", padding: 12, borderRadius: 10, flex: 1 },
  lbTitle: { color: "#fff", fontSize: 16, fontWeight: "700", marginBottom: 8 },
  lbRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  lbText: { color: "#ddd" },
  lbEmpty: { color: "#888", textAlign: "center", padding: 10 },
  lbActions: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },

  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
  modalCard: { width: "92%", backgroundColor: "#141414", borderRadius: 12, padding: 16, borderWidth: 1, borderColor: "#222" },
  modalTitle: { color: "#fff", fontSize: 18, fontWeight: "700", marginBottom: 10 },
});