import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit

export default function PhoneNumberScreen() {
  const [phone, setPhone] = useState("");

  const handleSendOtp = () => {
    if (phone.trim().length < 10) {
      Alert.alert("Invalid", "Enter a valid phone number");
      return;
    }
    const expected = generateOtp();

    // Dev-only popup so you can see the code
    if (__DEV__) {
      Alert.alert("DEV OTP", `Use this code: ${expected}`);
    }

    // Pass the expected OTP to the OTP screen as a param
    router.push({ pathname: "/otp", params: { phone, expected } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to RAPS 🎮</Text>
      <Text style={styles.subtitle}>Enter your phone number to continue</Text>

      <TextInput
        style={styles.input}
        keyboardType="phone-pad"
        placeholder="Enter phone number"
        placeholderTextColor="#aaa"
        value={phone}
        onChangeText={setPhone}
      />

      <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
        <Text style={styles.buttonText}>Send OTP</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#111" },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#aaa", marginBottom: 20 },
  input: { width: "100%", borderWidth: 1, borderColor: "#444", borderRadius: 12, padding: 15, color: "#fff", fontSize: 18, marginBottom: 20 },
  button: { backgroundColor: "#FF4500", paddingVertical: 15, paddingHorizontal: 40, borderRadius: 12 },
  buttonText: { fontSize: 18, color: "#fff", fontWeight: "bold" },
});