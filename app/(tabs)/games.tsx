import { useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function GamesScreen() {
  const router = useRouter();

  const games = [
    {
      id: 1,
      title: "Crypto Puzzle",
      desc: "Solve puzzles to earn loyalty points!",
    //   image: require("../assets/images/puzzle.jpg"),
      path: "/games/crypto-puzzle",
    },
   {
    id: 2,
    title: "Trivia Challenge",
    desc: "Test your gaming knowledge with fun quizzes.",
    image: require("../../assets/images/astro.jpg"), // 👈 add comma here
    path: "/games/trivia", // ✅ fixed
  },

    {
      id: 3,
      title: "AR Treasure Hunt",
      desc: "Find hidden AR objects in your surroundings.",
    //   image: require("../assets/images/ar.jpg"),
      path: "/games/ar-treasure",
    },
    {
      id: 4,
      title: "Memory Match",
      desc: "Flip cards and match pairs quickly.",
    //   image: require("../assets/images/memory.jpg"),
      path: "/games/memory",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🎮 Play & Earn</Text>
      <Text style={styles.subheader}>
        Enjoy fun games and earn loyalty rewards!
      </Text>

      <View style={styles.grid}>
        {games.map((game) => (
          <View key={game.id} style={styles.card}>
            <Image source={game.image} style={styles.image} />
            <Text style={styles.title}>{game.title}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push(game.path)} // ✅ navigation works
            >
              <Text style={styles.buttonText}>Play</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111", padding: 15 },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FF4500",
    textAlign: "center",
    marginTop: 10,
  },
  subheader: {
    fontSize: 16,
    color: "#bbb",
    textAlign: "center",
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#222",
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    width: "48%",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#FF4500",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
});
