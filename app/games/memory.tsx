import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  Dimensions,
  Modal,
  TouchableOpacity,
} from "react-native";

type Card = {
  key: string;
  pairId: number;
  name: string;
  image: any; // ImageSourcePropType
};

const BASE: Omit<Card, "key" | "pairId">[] = [
  { name: "Kratos", image: require("../../assets/images/kratos.jpeg") },
  { name: "ghost", image: require("../../assets/images/ghost.jpeg") },
  { name: "Spider-Man", image: require("../../assets/images/spider.jpeg") },
  { name: "gta", image: require("../../assets/images/gta.jpeg") },
  { name: "fifa", image: require("../../assets/images/fifa.jpeg") },
  { name: "cod", image: require("../../assets/images/cod.jpeg") },
  { name: "ps", image: require("../../assets/images/ps.jpg") },
  { name: "uc", image: require("../../assets/images/uc.jpeg") },
];

const shuffle = <T,>(arr: T[]) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const makeDeck = (): Card[] => {
  const pairs = BASE.flatMap((item, pairId) => [
    { key: `p${pairId}a`, pairId, name: item.name, image: item.image },
    { key: `p${pairId}b`, pairId, name: item.name, image: item.image },
  ]);
  return shuffle(pairs);
};

const { width } = Dimensions.get("window");
const GRID_MAX_W = 384;
const GRID_GAP = 12;
const COLS = 4;
const gridWidth = Math.min(GRID_MAX_W, width - 32);
const cardWidth = (gridWidth - GRID_GAP * (COLS - 1)) / COLS;
const cardHeight = Math.round(cardWidth * (7 / 5)); // keep 5:7 aspect

export default function MemoryFlipGame() {
  const [cards, setCards] = useState<Card[]>(() => makeDeck());
  const [flipped, setFlipped] = useState<number[]>([]); // indices currently flipped this turn (0–2)
  const [matched, setMatched] = useState<number[]>([]); // indices that are permanently matched
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(1000);
  const [showWin, setShowWin] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const allMatched = matched.length > 0 && matched.length === cards.length;

  useEffect(() => {
    if (allMatched) {
      const t = setTimeout(() => setShowWin(true), 400);
      return () => clearTimeout(t);
    }
  }, [allMatched]);

  const resetGame = useCallback(() => {
    setCards(makeDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setScore(1000);
    setShowWin(false);
    setGameStarted(false);
  }, []);

  const canFlip = useCallback(
    (index: number) => {
      if (!gameStarted) return true;
      if (flipped.length === 2) return false;
      if (flipped.includes(index)) return false;
      if (matched.includes(index)) return false;
      return true;
    },
    [flipped, matched, gameStarted]
  );

  const onFlip = (index: number) => {
    if (!gameStarted) setGameStarted(true);
    if (!canFlip(index)) return;

    const next = [...flipped, index];
    setFlipped(next);

    if (next.length === 2) {
      // Update moves/score based only on this flip
      setMoves((m) => m + 1);
      setScore((s) => Math.max(0, s - 50));

      const [i, j] = next;
      if (cards[i].pairId === cards[j].pairId) {
        // Match found
        setMatched((m) => [...m, i, j]);
        // Clear flipped so the next turn can begin
        setTimeout(() => setFlipped([]), 250);
      } else {
        // Not a match; flip back after a short delay
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  const renderCard = ({ item, index }: { item: Card; index: number }) => {
    const isFlipped = flipped.includes(index) || matched.includes(index);

    return (
      <Pressable
        key={item.key}
        onPress={() => onFlip(index)}
        style={[
          styles.card,
          { width: cardWidth, height: cardHeight },
          matched.includes(index) && styles.cardMatched,
        ]}
      >
        <View style={styles.cardInner}>
          {!isFlipped ? (
            // Back
            <View style={styles.cardBack}>
              <View style={styles.psLogo}>
                <View style={styles.psBarThin} />
                <View style={styles.psBarWide} />
                <View style={styles.psBarThin} />
              </View>
            </View>
          ) : (
            // Front
            <View style={styles.cardFront}>
              <Image source={item.image} style={styles.cardImage} resizeMode="cover" />
              <Text style={styles.cardTitle}>{item.name}</Text>
            </View>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={[styles.header, { width: gridWidth }]}>
        <View style={styles.pill}>
          <Text style={styles.pillPrimary}>💎 {score}</Text>
        </View>
        <View style={styles.pill}>
          <Text style={styles.pillText}>🎮 Moves: {moves}</Text>
        </View>
      </View>

      {/* Start prompt */}
      {!gameStarted && (
        <View style={styles.promptWrap}>
          <View style={styles.prompt}>
            <Text style={styles.promptText}>Flip two cards to find matches!</Text>
          </View>
        </View>
      )}

      {/* Grid */}
      <FlatList
        contentContainerStyle={{ width: gridWidth, alignSelf: "center" }}
        data={cards}
        keyExtractor={(c) => c.key}
        renderItem={renderCard}
        numColumns={COLS}
        columnWrapperStyle={{ justifyContent: "space-between", marginBottom: GRID_GAP }}
        showsVerticalScrollIndicator={false}
      />

      {/* Win modal */}
      <Modal visible={showWin} transparent animationType="fade" onRequestClose={() => setShowWin(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.trophy}>
              <Text style={{ fontSize: 32 }}>🏆</Text>
            </View>
            <Text style={styles.modalTitle}>Mission Complete!</Text>
            <Text style={styles.modalScore}>Final Score: {score}</Text>
            <Text style={styles.modalSub}>Moves: {moves} | Efficiency: {Math.round(1000 / (moves || 1))}%</Text>

            <TouchableOpacity onPress={resetGame} style={styles.playAgainBtn}>
              <Text style={styles.playAgainText}>Play Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#111827", paddingVertical: 16 },
  header: {
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  pill: {
    backgroundColor: "#1e3a8a",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  pillPrimary: { color: "#60a5fa", fontSize: 18, fontWeight: "bold" },
  pillText: { color: "white", fontSize: 18, fontWeight: "bold" },

  promptWrap: { alignItems: "center", marginBottom: 24 },
  prompt: {
    backgroundColor: "rgba(30,58,138,0.3)",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  promptText: { color: "white", fontSize: 18, fontStyle: "italic" },

  card: {
    borderRadius: 8,
    backgroundColor: "transparent",
  },
  cardMatched: {
    borderWidth: 2,
    borderColor: "#10b981",
  },
  cardInner: {
    flex: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  cardBack: {
    flex: 1,
    backgroundColor: "#1e3a8a",
    borderWidth: 2,
    borderColor: "#60a5fa",
    alignItems: "center",
    justifyContent: "center",
  },
  psLogo: { flexDirection: "row", alignItems: "center", gap: 4 },
  psBarThin: { width: 8, height: 32, backgroundColor: "white", borderRadius: 2 },
  psBarWide: { width: 12, height: 32, backgroundColor: "white", borderRadius: 2 },

  cardFront: {
    flex: 1,
    backgroundColor: "#374151",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    gap: 4,
  },
  cardImage: {
    width: "100%",
    height: "80%",
    borderRadius: 8,
  },
  cardTitle: { color: "white", fontSize: 14, fontWeight: "bold" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  modalCard: {
    backgroundColor: "#374151",
    borderWidth: 2,
    borderColor: "#60a5fa",
    borderRadius: 12,
    padding: 24,
    width: 320,
    maxWidth: "100%",
    alignItems: "center",
  },
  trophy: {
    width: 80,
    height: 80,
    backgroundColor: "#eab308",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  modalTitle: { fontSize: 22, fontWeight: "bold", color: "#60a5fa", marginBottom: 8 },
  modalScore: { fontSize: 18, color: "white", marginBottom: 4 },
  modalSub: { fontSize: 16, color: "#d1d5db", marginBottom: 20 },
  playAgainBtn: { backgroundColor: "#2563eb", borderRadius: 8, paddingHorizontal: 20, paddingVertical: 10 },
  playAgainText: { color: "white", fontSize: 16, fontWeight: "bold" },
});