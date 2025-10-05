import { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export default function OtpScreen() {
  const { phone, expected } = useLocalSearchParams<{ phone?: string; expected?: string }>();
  const [otp, setOtp] = useState("");

  // Use the expected from params if present; otherwise generate one (dev)
  const [devExpected, setDevExpected] = useState(() => (expected && String(expected)) || generateOtp());

  useEffect(() => {
    // Show the OTP in dev to make testing easy
    if (__DEV__) {
      Alert.alert("DEV OTP", `Use this code: ${devExpected}`);
    }
  }, [devExpected]);

  const handleVerifyOtp = () => {
    if (otp.length < 4) {
      Alert.alert("Invalid", "Enter a valid OTP");
      return;
    }
    if (otp !== devExpected) {
      Alert.alert("Incorrect", "OTP does not match");
      return;
    }
    Alert.alert("Success", "✅ OTP Verified!");
    // Go to tabs root. Route groups are stripped, so "/" maps to app/(tabs)/index.tsx
    router.replace("/");
  };

  const handleResend = () => {
    const next = generateOtp();
    setDevExpected(next);
    if (__DEV__) Alert.alert("DEV OTP", `New code: ${next}`);
    setOtp("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP 🔐</Text>
      <Text style={styles.subtitle}>Code sent to {phone || "your number"}</Text>

      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        placeholder="Enter 6-digit code"
        placeholderTextColor="#aaa"
        value={otp}
        onChangeText={(v) => setOtp(v.replace(/\D/g, "").slice(0, 6))}
        maxLength={6}
        textAlign="center"
      />

      <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: "#333", marginTop: 12 }]} onPress={handleResend}>
        <Text style={[styles.buttonText, { color: "#fff" }]}>Resend (DEV)</Text>
      </TouchableOpacity>

      {__DEV__ && (
        <Text style={{ marginTop: 12, color: "#888" }}>Dev code: {devExpected}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#111" },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#aaa", marginBottom: 20 },
  input: { width: "100%", borderWidth: 1, borderColor: "#444", borderRadius: 12, padding: 15, color: "#fff", fontSize: 18, marginBottom: 20, letterSpacing: 4 },
  button: { backgroundColor: "#FF4500", paddingVertical: 15, paddingHorizontal: 40, borderRadius: 12 },
  buttonText: { fontSize: 18, color: "#fff", fontWeight: "bold" },
});