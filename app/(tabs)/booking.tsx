import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

export default function BookingScreen() {
  const [selectedConsole, setSelectedConsole] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const consoles = ["PS5", "PS4 Pro"];
  const times = ["30 min", "1 hour", "2 hours"];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>📅 Book Your Gaming Session</Text>
      <Text style={styles.subheader}>Choose your console & time slot</Text>

      {/* Console Selection */}
      <Text style={styles.sectionTitle}>🎮 Select Console</Text>
      <View style={styles.optionContainer}>
        {consoles.map((console) => (
          <TouchableOpacity
            key={console}
            style={[
              styles.option,
              selectedConsole === console && styles.selectedOption,
            ]}
            onPress={() => setSelectedConsole(console)}
          >
            <Text
              style={[
                styles.optionText,
                selectedConsole === console && styles.selectedOptionText,
              ]}
            >
              {console}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Time Selection */}
      <Text style={styles.sectionTitle}>⏰ Select Duration</Text>
      <View style={styles.optionContainer}>
        {times.map((time) => (
          <TouchableOpacity
            key={time}
            style={[
              styles.option,
              selectedTime === time && styles.selectedOption,
            ]}
            onPress={() => setSelectedTime(time)}
          >
            <Text
              style={[
                styles.optionText,
                selectedTime === time && styles.selectedOptionText,
              ]}
            >
              {time}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Confirm Button */}
      <TouchableOpacity style={styles.confirmButton}>
        <Text style={styles.confirmText}>✅ Confirm Booking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111", padding: 20 },
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
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#fff", marginBottom: 10 },
  optionContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 20 },
  option: {
    backgroundColor: "#222",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 18,
    margin: 5,
  },
  optionText: { color: "#bbb", fontSize: 16 },
  selectedOption: { backgroundColor: "#FF4500" },
  selectedOptionText: { color: "#fff", fontWeight: "bold" },
  confirmButton: {
    backgroundColor: "#FF4500",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  confirmText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
