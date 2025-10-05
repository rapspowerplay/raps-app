"use client"

import React, { useRef, useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native"
import Constants from "expo-constants"

type Diff = "easy" | "medium" | "hard"
type Q = { question: string; options: string[]; answer: string; topic: string }

const TOTAL = 10
const MODEL = "llama-3.1-8b-instant" // fast; switch to "llama-3.1-70b-versatile" if you prefer
const TOPICS = [
  "PlayStation history and games",
  "Classic Nintendo games",
  "Xbox ecosystem",
  "PC gaming hardware",
  "Famous game developers",
  "Indie game hits",
]

const getKey = () => {
  const env = process.env.EXPO_PUBLIC_GROQ_API_KEY
  const extra = (Constants.expoConfig?.extra || (Constants as any).manifest?.extra || {}) as any
  return env || extra?.EXPO_PUBLIC_GROQ_API_KEY || ""
}
const API_KEY = getKey()

const levelName = (d: Diff) => (d === "easy" ? "Casual" : d === "medium" ? "Pro" : "Expert")
const levelColor = (d: Diff) => (d === "easy" ? "#22c55e" : d === "medium" ? "#f59e0b" : "#ef4444")

const aiPrompt = (d: Diff, topic: string, avoid: string[], nonce: string) => `
Generate a ${d} gaming trivia question about: ${topic}.
Return ONLY JSON (no markdown, no commentary):
{
  "question": "The question text?",
  "options": ["Option A","Option B","Option C","Option D"],
  "answer": "The full text of the correct option"
}
Rules:
- "answer" must exactly match one of "options".
- Avoid these question texts: ${avoid.slice(-12).map(s => `"${s}"`).join(", ") || "[]"}
- Keep it fresh. Uniqueness token: ${nonce}
`.trim()

async function fetchAI(d: Diff, avoid: string[]): Promise<Q> {
  if (!API_KEY) throw new Error("Missing EXPO_PUBLIC_GROQ_API_KEY")
  const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)]
  const nonce = Math.random().toString(36).slice(2)

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: "Return ONLY a compact JSON object. No code fences." },
        { role: "user", content: aiPrompt(d, topic, avoid, nonce) },
      ],
      temperature: d === "easy" ? 0.7 : d === "medium" ? 0.55 : 0.4,
      max_tokens: 220,
    }),
  })
  if (!res.ok) throw new Error(`Groq ${res.status}: ${await res.text()}`)

  const data = await res.json()
  const raw = data?.choices?.[0]?.message?.content || ""
  const clean = raw.replace(/```json|```/g, "").trim()
  const s = clean.indexOf("{"), e = clean.lastIndexOf("}")
  const json = s >= 0 && e >= s ? clean.slice(s, e + 1) : clean
  const q = JSON.parse(json)

  if (!q?.question || !Array.isArray(q?.options) || !q?.answer || !q.options.includes(q.answer)) {
    throw new Error("Bad AI format")
  }
  return { ...q, topic }
}

export default function TriviaGame() {
  const seen = useRef<Set<string>>(new Set())
  const [q, setQ] = useState<Q | null>(null)
  const [diff, setDiff] = useState<Diff>("easy")
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [i, setI] = useState(0)
  const [busy, setBusy] = useState(false)
  const [started, setStarted] = useState(false)
  const [done, setDone] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const getUnique = async (level: Diff) => {
    setBusy(true); setErr(null)
    for (let tries = 0; tries < 4; tries++) {
      const next = await fetchAI(level, Array.from(seen.current))
      const key = next.question.trim().toLowerCase()
      if (!seen.current.has(key)) {
        seen.current.add(key)
        setQ(next)
        setBusy(false)
        return
      }
    }
    setBusy(false)
    setErr("AI kept returning duplicates. Try again.")
  }

  const startGame = async () => {
    if (!API_KEY) { setErr("GROQ key missing. Set EXPO_PUBLIC_GROQ_API_KEY and restart (npx expo start -c)."); return }
    seen.current.clear()
    setStarted(true); setDone(false)
    setScore(0); setStreak(0); setI(0); setSelected(null); setDiff("easy")
    await getUnique("easy")
  }

  const onSelect = async (opt: string) => {
    if (!q || selected) return
    setSelected(opt)
    const correct = opt === q.answer

    setTimeout(async () => {
      let nextLevel = diff
      if (correct) {
        setScore(s => s + 1)
        const s2 = streak + 1
        setStreak(s2)
        if (s2 >= 2) { nextLevel = diff === "easy" ? "medium" : diff === "medium" ? "hard" : "hard"; setDiff(nextLevel); setStreak(0) }
      } else {
        setStreak(0)
      }

      const nextI = i + 1
      setI(nextI)
      if (nextI >= TOTAL) { setDone(true); setStarted(false) }
      else { setSelected(null); await getUnique(nextLevel) }
    }, 600)
  }

  if (done) {
    const pct = Math.round((score / TOTAL) * 100)
    const msg = pct === 100 ? "Perfect Score! 🏆" : pct >= 80 ? "Gaming Master! 🎮" : pct >= 60 ? "Great Job! 🎉" : "Keep Practicing! 💪"
    return (
      <View style={styles.c}>
        <View style={styles.finish}>
          <Text style={styles.title}>{msg}</Text>
          <Text style={styles.big}>{score} / {TOTAL}</Text>
          <TouchableOpacity style={styles.btn} onPress={startGame}><Text style={styles.btnT}>Play Again</Text></TouchableOpacity>
        </View>
      </View>
    )
  }

  if (!started) {
    return (
      <View style={[styles.c, styles.center]}>
        <Text style={styles.logo}>RAPS</Text>
        <Text style={styles.title}>Trivia Challenge</Text>
        <Text style={styles.sub}>AI Generated Gaming Questions</Text>
        <TouchableOpacity style={styles.btn} onPress={startGame}><Text style={styles.btnT}>Start</Text></TouchableOpacity>
        <Text style={[styles.note, { color: API_KEY ? "#22c55e" : "#ef4444" }]}>
          AI: {API_KEY ? "On ✅" : "Off ❌ (set EXPO_PUBLIC_GROQ_API_KEY)"}
        </Text>
        {err ? <Text style={styles.err}>{err}</Text> : null}
      </View>
    )
  }

  if (!q || busy) {
    return (
      <View style={[styles.c, styles.center]}>
        <ActivityIndicator size="large" color="#ff6b35" />
        <Text style={styles.sub}>Talking to AI...</Text>
        {err ? <Text style={styles.err}>{err}</Text> : null}
      </View>
    )
  }

  const progress = ((i + 1) / TOTAL) * 100

  return (
    <View style={styles.c}>
      <View style={styles.head}>
        <View style={styles.stat}><Text style={styles.l}>Score</Text><Text style={styles.v}>{score}</Text></View>
        <View style={styles.stat}><Text style={styles.l}>Streak</Text><Text style={styles.v}>{streak}</Text></View>
        <View style={styles.stat}><Text style={styles.l}>Level</Text><Text style={[styles.v, { color: levelColor(diff) }]}>{levelName(diff)}</Text></View>
        <View style={styles.stat}><Text style={styles.l}>AI</Text><Text style={[styles.v, { color: "#22c55e" }]}>On</Text></View>
      </View>

      <View style={styles.pRow}>
        <View style={styles.pBar}><View style={[styles.pFill, { width: `${progress}%` }]} /></View>
        <Text style={styles.pTxt}>Q {i + 1}/{TOTAL}</Text>
      </View>

      <View style={styles.topicW}><Text style={styles.topic}>{q.topic}</Text></View>
      <View style={styles.card}><Text style={styles.q}>{q.question}</Text></View>

      <View style={styles.opts}>
        {q.options.map((opt, idx) => {
          const show = selected !== null, isSel = selected === opt, isCorrect = opt === q.answer
          return (
            <TouchableOpacity
              key={idx}
              style={[styles.opt, show && isCorrect && styles.ok, show && isSel && !isCorrect && styles.no]}
              onPress={() => onSelect(opt)} disabled={show} activeOpacity={0.7}
            >
              <Text style={[styles.optT, show && isCorrect && styles.okT, show && isSel && !isCorrect && styles.noT]}>{opt}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: "#0a0a0a" },
  center: { justifyContent: "center", alignItems: "center", padding: 30 },
  logo: { fontSize: 56, fontWeight: "900", color: "#ff6b35", letterSpacing: 3 },
  title: { fontSize: 28, fontWeight: "800", color: "#fff", marginTop: 6 },
  sub: { fontSize: 14, color: "#aaa", marginTop: 8 },
  btn: { backgroundColor: "#ff6b35", paddingHorizontal: 40, paddingVertical: 14, borderRadius: 12, marginTop: 20 },
  btnT: { color: "#fff", fontSize: 18, fontWeight: "700" },
  note: { marginTop: 12, color: "#888", textAlign: "center" },
  err: { marginTop: 10, color: "#ef4444", textAlign: "center" },

  head: { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 16, flexDirection: "row", justifyContent: "space-around" },
  stat: { alignItems: "center", minWidth: 70 },
  l: { fontSize: 12, color: "#888" },
  v: { fontSize: 18, fontWeight: "800", color: "#fff" },

  pRow: { paddingHorizontal: 25, marginBottom: 14, flexDirection: "row", alignItems: "center" },
  pBar: { flex: 1, height: 8, backgroundColor: "#2a2a2a", borderRadius: 4, overflow: "hidden", marginRight: 10 },
  pFill: { height: "100%", backgroundColor: "#ff6b35" },
  pTxt: { fontSize: 13, color: "#888", fontWeight: "600" },

  topicW: { alignItems: "flex-start", paddingHorizontal: 25, marginBottom: 10 },
  topic: { fontSize: 13, color: "#ff6b35", fontWeight: "700", backgroundColor: "rgba(255,107,53,0.15)", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },

  card: { backgroundColor: "#1a1a1a", borderRadius: 16, padding: 20, marginHorizontal: 20, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: "#ff6b35" },
  q: { fontSize: 20, color: "#fff", lineHeight: 26, fontWeight: "600" },

  opts: { paddingHorizontal: 20 },
  opt: { backgroundColor: "#1a1a1a", borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 2, borderColor: "#333" },
  optT: { color: "#ddd", fontSize: 16, fontWeight: "500" },
  ok: { backgroundColor: "rgba(34,197,94,0.15)", borderColor: "#22c55e" },
  okT: { color: "#22c55e", fontWeight: "700" },
  no: { backgroundColor: "rgba(239,68,68,0.15)", borderColor: "#ef4444" },
  noT: { color: "#ef4444", fontWeight: "700" },

  finish: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1a1a1a", margin: 20, borderRadius: 20, padding: 30 },
  big: { fontSize: 44, fontWeight: "900", color: "#fff", marginVertical: 18 },
})