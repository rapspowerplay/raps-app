import { Image,     
  ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { Image } from "@/assets/images/astro.jpg";

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Text style={styles.header}>🎮 Welcome to RAPS Powerplay</Text>
      <Text style={styles.subheader}>Your Ultimate Gaming Zone</Text>

      {/* Hero Image */}
      <Image
        source={{ uri: "@/assets/images/astro.jpg" }}
        style={styles.heroImage}
      />

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Book a Session</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSecondary}>
          <Text style={styles.buttonText}>Visit Store</Text>
        </TouchableOpacity>
      </View>

      {/* Features */}
      <Text style={styles.sectionTitle}>🔥 What We Offer</Text>
      <View style={styles.card}>
        <Text style={styles.cardText}>✅ PS5 Gaming Sessions</Text>
        <Text style={styles.cardText}>✅ Snacks & Chill Zone</Text>
        <Text style={styles.cardText}>✅ Game Tournaments</Text>
        <Text style={styles.cardText}>✅ Buy Accessories & Games</Text>
      </View>

      {/* New Section: Popular Games */}
      <Text style={styles.sectionTitle}>🎯 Popular Games</Text>
      <View style={styles.card}>
        <Text style={styles.cardText}>⚡ FIFA 24</Text>
        <Text style={styles.cardText}>⚡ Call of Duty</Text>
        <Text style={styles.cardText}>⚡ Spider-Man 2</Text>
        <Text style={styles.cardText}>⚡ Mortal Kombat</Text>
      </View>

      {/* New Section: Customer Reviews */}
      <Text style={styles.sectionTitle}>⭐ Customer Reviews</Text>
      <View style={styles.card}>
        <Text style={styles.cardText}>"Best gaming vibe in town!" – Rohan</Text>
        <Text style={styles.cardText}>
          "Affordable sessions with friends." – Priya
        </Text>
        <Text style={styles.cardText}>
          "Loved the tournaments and snacks." – Aarav
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 RAPS Powerplay</Text>
        <Text style={styles.footerText}>Made with ❤️ by Team RAPS</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FF4500",
    textAlign: "center",
    marginTop: 20,
  },
  subheader: {
    fontSize: 16,
    color: "#bbb",
    textAlign: "center",
    marginBottom: 20,
  },
  heroImage: {
    width: "100%",
    height: 200,
    borderRadius: 15,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#FF4500",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonSecondary: {
    backgroundColor: "#444",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    marginTop: 20,
  },
  card: {
    backgroundColor: "#222",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  cardText: {
    color: "#ddd",
    fontSize: 14,
    marginBottom: 5,
  },
  footer: {
    marginTop: 30,
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  footerText: {
    color: "#888",
    fontSize: 12,
    textAlign: "center",
  },
});
