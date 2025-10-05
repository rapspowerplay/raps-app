"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"

export default function BookingScreen() {
  const [selectedConsole, setSelectedConsole] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const consoles = [
    { id: "ps5", name: "PlayStation 5", price: "₹200/hr", popular: true },
    { id: "ps4pro", name: "PS4 Pro", price: "₹150/hr", popular: false },
    { id: "xbox", name: "Xbox Series X", price: "₹180/hr", popular: false },
  ]

  const timeSlots = [
    { id: "30min", duration: "30 minutes", price: "₹100", discount: null },
    { id: "1hr", duration: "1 hour", price: "₹200", discount: null },
    { id: "2hr", duration: "2 hours", price: "₹380", discount: "Save ₹20" },
    { id: "4hr", duration: "4 hours", price: "₹720", discount: "Save ₹80" },
  ]

  const dates = ["Today", "Tomorrow", "Dec 20", "Dec 21", "Dec 22"]

  const getTotalPrice = () => {
    if (!selectedConsole || !selectedTime) return "₹0"
    const console = consoles.find((c) => c.id === selectedConsole)
    const time = timeSlots.find((t) => t.id === selectedTime)
    return time?.price || "₹0"
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reserve Your</Text>
        <Text style={styles.headerTitleAccent}>Gaming Session</Text>
        <Text style={styles.headerSubtitle}>Choose your perfect gaming setup</Text>

        <View style={styles.progressContainer}>
          <View style={[styles.progressStep, styles.progressStepActive]}>
            <Text style={styles.progressNumber}>1</Text>
          </View>
          <View style={styles.progressLine} />
          <View style={styles.progressStep}>
            <Text style={styles.progressNumber}>2</Text>
          </View>
          <View style={styles.progressLine} />
          <View style={styles.progressStep}>
            <Text style={styles.progressNumber}>3</Text>
          </View>
        </View>
        <View style={styles.progressLabels}>
          <Text style={styles.progressLabel}>Console</Text>
          <Text style={styles.progressLabel}>Time</Text>
          <Text style={styles.progressLabel}>Confirm</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Choose Your Console</Text>
        <Text style={styles.sectionSubtitle}>Select from our premium gaming collection</Text>

        <View style={styles.consoleGrid}>
          {consoles.map((console) => (
            <TouchableOpacity
              key={console.id}
              style={[styles.consoleCard, selectedConsole === console.id && styles.consoleCardSelected]}
              onPress={() => setSelectedConsole(console.id)}
            >
              {console.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>POPULAR</Text>
                </View>
              )}
              <View style={styles.consoleIcon}>
                <Text style={styles.consoleEmoji}>🎮</Text>
              </View>
              <Text style={styles.consoleName}>{console.name}</Text>
              <Text style={styles.consolePrice}>{console.price}</Text>
              <View style={styles.consoleFeatures}>
                <Text style={styles.featureText}>• 4K Gaming</Text>
                <Text style={styles.featureText}>• Premium Controller</Text>
                <Text style={styles.featureText}>• Latest Games</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Duration</Text>
        <Text style={styles.sectionSubtitle}>Longer sessions = Better savings</Text>

        <View style={styles.timeGrid}>
          {timeSlots.map((time) => (
            <TouchableOpacity
              key={time.id}
              style={[styles.timeCard, selectedTime === time.id && styles.timeCardSelected]}
              onPress={() => setSelectedTime(time.id)}
            >
              <Text style={styles.timeDuration}>{time.duration}</Text>
              <Text style={styles.timePrice}>{time.price}</Text>
              {time.discount && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>{time.discount}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pick a Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
          {dates.map((date) => (
            <TouchableOpacity
              key={date}
              style={[styles.dateChip, selectedDate === date && styles.dateChipSelected]}
              onPress={() => setSelectedDate(date)}
            >
              <Text style={[styles.dateText, selectedDate === date && styles.dateTextSelected]}>{date}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>
          <Text style={styles.totalPrice}>{getTotalPrice()}</Text>
        </View>

        {selectedConsole && (
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Console:</Text>
            <Text style={styles.summaryValue}>{consoles.find((c) => c.id === selectedConsole)?.name}</Text>
          </View>
        )}

        {selectedTime && (
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Duration:</Text>
            <Text style={styles.summaryValue}>{timeSlots.find((t) => t.id === selectedTime)?.duration}</Text>
          </View>
        )}

        {selectedDate && (
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Date:</Text>
            <Text style={styles.summaryValue}>{selectedDate}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.confirmButton,
            (!selectedConsole || !selectedTime || !selectedDate) && styles.confirmButtonDisabled,
          ]}
          disabled={!selectedConsole || !selectedTime || !selectedDate}
        >
          <Text style={styles.confirmText}>
            {!selectedConsole || !selectedTime || !selectedDate ? "Complete Selection" : "Confirm Booking"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  header: {
    padding: 24,
    paddingTop: 40,
    backgroundColor: "#111111",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "300",
    color: "#ffffff",
    textAlign: "center",
  },
  headerTitleAccent: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FF4500",
    textAlign: "center",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#888888",
    textAlign: "center",
    marginBottom: 32,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  progressStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#333333",
    alignItems: "center",
    justifyContent: "center",
  },
  progressStepActive: {
    backgroundColor: "#FF4500",
  },
  progressNumber: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: "#333333",
    marginHorizontal: 8,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  progressLabel: {
    color: "#666666",
    fontSize: 12,
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#888888",
    marginBottom: 20,
  },
  consoleGrid: {
    gap: 16,
  },
  consoleCard: {
    backgroundColor: "#111111",
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: "#222222",
    position: "relative",
  },
  consoleCardSelected: {
    borderColor: "#FF4500",
    backgroundColor: "#1a1a1a",
  },
  popularBadge: {
    position: "absolute",
    top: -8,
    right: 16,
    backgroundColor: "#FFD700",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: "#000000",
    fontSize: 10,
    fontWeight: "700",
  },
  consoleIcon: {
    alignItems: "center",
    marginBottom: 12,
  },
  consoleEmoji: {
    fontSize: 32,
  },
  consoleName: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  consolePrice: {
    color: "#FF4500",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  consoleFeatures: {
    alignItems: "center",
  },
  featureText: {
    color: "#666666",
    fontSize: 12,
    marginBottom: 2,
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  timeCard: {
    backgroundColor: "#111111",
    borderRadius: 12,
    padding: 16,
    width: "48%",
    borderWidth: 2,
    borderColor: "#222222",
    position: "relative",
  },
  timeCardSelected: {
    borderColor: "#FF4500",
    backgroundColor: "#1a1a1a",
  },
  timeDuration: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  timePrice: {
    color: "#FF4500",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  discountBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#00CED1",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  discountText: {
    color: "#000000",
    fontSize: 8,
    fontWeight: "600",
  },
  dateScroll: {
    paddingVertical: 8,
  },
  dateChip: {
    backgroundColor: "#111111",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#333333",
  },
  dateChipSelected: {
    backgroundColor: "#FF4500",
    borderColor: "#FF4500",
  },
  dateText: {
    color: "#888888",
    fontSize: 14,
    fontWeight: "600",
  },
  dateTextSelected: {
    color: "#ffffff",
  },
  summaryContainer: {
    margin: 24,
    backgroundColor: "#111111",
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  summaryTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  totalPrice: {
    color: "#FF4500",
    fontSize: 24,
    fontWeight: "700",
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    color: "#888888",
    fontSize: 14,
  },
  summaryValue: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  confirmButton: {
    backgroundColor: "#FF4500",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  confirmButtonDisabled: {
    backgroundColor: "#333333",
  },
  confirmText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
})
