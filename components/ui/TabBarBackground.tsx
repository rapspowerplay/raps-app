import { View, StyleSheet } from "react-native"

export default function TabBarBackground() {
  return <View style={styles.background} />
}

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#1c1c1c",
  },
})

export function useBottomTabOverflow() {
  return 0 // Return a default value instead of using the hook that might cause issues
}
