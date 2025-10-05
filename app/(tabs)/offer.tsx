"use client"

import { StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated } from "react-native"
import { View, Text } from "react-native"
import { useState, useRef, useEffect } from "react"

const { width } = Dimensions.get("window")

interface GameOfferProps {
  title: string
  description: string
  price: string
  originalPrice?: string
  discount: string
  icon: string
  level: number
  xp: number
  rarity: "common" | "rare" | "epic" | "legendary"
  onPress: () => void
}

const GameOffer = ({
  title,
  description,
  price,
  originalPrice,
  discount,
  icon,
  level,
  xp,
  rarity,
  onPress,
}: GameOfferProps) => {
  const pulseAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    )
    if (rarity === "legendary") pulse.start()
    return () => pulse.stop()
  }, [])

  const getRarityColors = () => {
    switch (rarity) {
      case "legendary":
        return { bg: "#FFD700", border: "#FFA500", glow: "#FFFF00" }
      case "epic":
        return { bg: "#9B59B6", border: "#8E44AD", glow: "#BB6BD9" }
      case "rare":
        return { bg: "#3498DB", border: "#2980B9", glow: "#5DADE2" }
      default:
        return { bg: "#95A5A6", border: "#7F8C8D", glow: "#BDC3C7" }
    }
  }

  const colors = getRarityColors()

  return (
    <Animated.View
      style={[
        styles.gameCard,
        { transform: [{ scale: pulseAnim }] },
        rarity === "legendary" && { shadowColor: colors.glow, shadowOpacity: 0.6 },
      ]}
    >
      <TouchableOpacity onPress={onPress}>
        {/* Rarity Border */}
        <View style={[styles.rarityBorder, { borderColor: colors.border }]}>
          {/* Header with Level and XP */}
          <View style={styles.gameHeader}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>LVL {level}</Text>
            </View>
            <View style={styles.xpBadge}>
              <Text style={styles.xpText}>+{xp} XP</Text>
            </View>
          </View>

          {/* Main Content */}
          <View style={styles.gameContent}>
            <Text style={styles.gameIcon}>{icon}</Text>
            <Text style={[styles.rarityLabel, { color: colors.bg }]}>{rarity.toUpperCase()}</Text>
            <Text style={styles.gameTitle}>{title}</Text>
            <Text style={styles.gameDescription}>{description}</Text>
          </View>

          {/* Stats Bar */}
          <View style={styles.statsBar}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>DISCOUNT</Text>
              <Text style={styles.statValue}>{discount}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>PRICE</Text>
              <Text style={styles.statValue}>{price}</Text>
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity style={[styles.claimButton, { backgroundColor: colors.bg }]}>
            <Text style={styles.claimButtonText}>🎮 CLAIM REWARD</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  )
}

export default function OffersScreen() {
  const [playerLevel] = useState(42)
  const [totalXP] = useState(15420)

  const gameOffers = [
    {
      title: "Weekend Gaming Blast",
      description: "Epic gaming session with bonus time rewards",
      price: "₹299",
      originalPrice: "₹399",
      discount: "25% OFF",
      icon: "🎮",
      level: 5,
      xp: 150,
      rarity: "legendary" as const,
    },
    {
      title: "Gamer's Fuel Combo",
      description: "Power-up meal for extended gaming sessions",
      price: "₹99",
      originalPrice: "₹149",
      discount: "33% OFF",
      icon: "🍔",
      level: 3,
      xp: 75,
      rarity: "epic" as const,
    },
    {
      title: "RAPS Merch Drop",
      description: "Limited edition gaming gear collection",
      price: "From ₹399",
      originalPrice: "From ₹499",
      discount: "20% OFF",
      icon: "👕",
      level: 2,
      xp: 50,
      rarity: "rare" as const,
    },
    {
      title: "Tournament Entry",
      description: "Compete in championship gaming events",
      price: "₹799",
      originalPrice: "₹999",
      discount: "₹200 OFF",
      icon: "🏆",
      level: 8,
      xp: 300,
      rarity: "legendary" as const,
    },
    {
      title: "Birthday Achievement",
      description: "Special birthday gaming celebration unlock",
      price: "FREE",
      originalPrice: "₹199",
      discount: "100% OFF",
      icon: "🎂",
      level: 1,
      xp: 100,
      rarity: "epic" as const,
    },
    {
      title: "Squad Gaming Mode",
      description: "Multiplayer group gaming experience",
      price: "₹199/player",
      originalPrice: "₹299/player",
      discount: "Group Deal",
      icon: "👥",
      level: 4,
      xp: 200,
      rarity: "rare" as const,
    },
  ]

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Gaming HUD Header */}
      <View style={styles.hudHeader}>
        <View style={styles.playerStats}>
          <Text style={styles.playerLevel}>LEVEL {playerLevel}</Text>
          <View style={styles.xpBar}>
            <View style={styles.xpFill} />
            <Text style={styles.xpText}>{totalXP} XP</Text>
          </View>
        </View>
        <Text style={styles.hudTitle}>🎮 POWER-UP STORE</Text>
        <Text style={styles.hudSubtitle}>Collect exclusive gaming rewards & bonuses</Text>
      </View>

      {/* Achievement Banner */}
      <View style={styles.achievementBanner}>
        <Text style={styles.achievementIcon}>🏆</Text>
        <View style={styles.achievementText}>
          <Text style={styles.achievementTitle}>DAILY QUEST ACTIVE</Text>
          <Text style={styles.achievementDesc}>Claim 3 offers to unlock bonus XP</Text>
        </View>
        <View style={styles.achievementProgress}>
          <Text style={styles.progressText}>0/3</Text>
        </View>
      </View>

      {/* Game Offers */}
      <View style={styles.offersGrid}>
        {gameOffers.map((offer, index) => (
          <GameOffer key={index} {...offer} onPress={() => console.log(`Claimed: ${offer.title}`)} />
        ))}
      </View>

      {/* Bottom CTA */}
      <View style={styles.bottomCTA}>
        <Text style={styles.ctaTitle}>🎯 MISSION COMPLETE</Text>
        <Text style={styles.ctaDesc}>Level up your gaming experience with these exclusive offers</Text>
        <TouchableOpacity style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>🚀 EXPLORE MORE REWARDS</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  hudHeader: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#1A1A2E",
    borderBottomWidth: 2,
    borderBottomColor: "#16213E",
  },
  playerStats: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 15,
  },
  playerLevel: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "bold",
    backgroundColor: "#2A2A3E",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  xpBar: {
    flex: 1,
    height: 20,
    backgroundColor: "#2A2A3E",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  xpFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "65%",
    backgroundColor: "#00D4FF",
    borderRadius: 10,
  },
  xpText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
    zIndex: 1,
  },
  hudTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 5,
  },
  hudSubtitle: {
    fontSize: 14,
    color: "#CCCCCC",
    textAlign: "center",
  },
  achievementBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2D1B69",
    margin: 20,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#8E44AD",
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  achievementText: {
    flex: 1,
  },
  achievementTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  achievementDesc: {
    color: "#CCCCCC",
    fontSize: 12,
  },
  achievementProgress: {
    backgroundColor: "#8E44AD",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  progressText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  offersGrid: {
    padding: 20,
    gap: 20,
  },
  gameCard: {
    marginBottom: 5,
  },
  rarityBorder: {
    borderWidth: 2,
    borderRadius: 16,
    backgroundColor: "#1A1A2E",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gameHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  levelBadge: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  levelText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  xpBadge: {
    backgroundColor: "#00D4FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  gameContent: {
    alignItems: "center",
    marginBottom: 16,
  },
  gameIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  rarityLabel: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 4,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  gameDescription: {
    fontSize: 13,
    color: "#CCCCCC",
    textAlign: "center",
    lineHeight: 18,
  },
  statsBar: {
    flexDirection: "row",
    backgroundColor: "#2A2A3E",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statLabel: {
    color: "#888888",
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 2,
  },
  statValue: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#444444",
    marginHorizontal: 12,
  },
  claimButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
  },
  claimButtonText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "bold",
  },
  bottomCTA: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#1A1A2E",
    marginTop: 20,
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  ctaDesc: {
    fontSize: 14,
    color: "#CCCCCC",
    textAlign: "center",
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  ctaButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
})
