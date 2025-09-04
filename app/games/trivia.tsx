import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const questions = [
  {
    id: 1,
    question: "Which company makes the PlayStation?",
    options: ["Microsoft", "Sony", "Nintendo", "EA"],
    answer: "Sony",
  },
  {
    id: 2,
    question: "What year was the PS5 released?",
    options: ["2018", "2019", "2020", "2021"],
    answer: "2020",
  },
  {
    id: 3,
    question: "Which game is NOT a PlayStation exclusive?",
    options: ["Uncharted", "Halo", "God of War", "Spider-Man"],
    answer: "Halo",
  },
];

export default function TriviaGame() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (option: string) => {
    if (option === questions[current].answer) {
      setScore(score + 1);
    }

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🎉 Game Over!</Text>
        <Text style={styles.subtitle}>
          You scored {score} / {questions.length}
        </Text>
        <Text style={styles.points}>⭐ You earned {score * 10} RAPS Points!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trivia Challenge</Text>
      <Text style={styles.question}>
        {questions[current].id}. {questions[current].question}
      </Text>

      {questions[current].options.map((option, i) => (
        <TouchableOpacity
          key={i}
          style={styles.option}
          onPress={() => handleAnswer(option)}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.progress}>
        Question {current + 1} / {questions.length}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111", padding: 20, justifyContent: "center" },
  title: { fontSize: 26, fontWeight: "bold", color: "#FF4500", textAlign: "center", marginBottom: 20 },
  question: { fontSize: 18, color: "#fff", marginBottom: 15, textAlign: "center" },
  option: { backgroundColor: "#222", padding: 15, borderRadius: 10, marginVertical: 8 },
  optionText: { color: "#fff", fontSize: 16, textAlign: "center" },
  subtitle: { fontSize: 18, color: "#fff", textAlign: "center", marginTop: 10 },
  points: { fontSize: 20, color: "#FFD700", textAlign: "center", marginTop: 15, fontWeight: "bold" },
  progress: { fontSize: 14, color: "#bbb", textAlign: "center", marginTop: 20 },
});
