"use client"

import { useState, useRef, useEffect } from "react"
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Dimensions, FlatList } from "react-native"

const { width } = Dimensions.get("window")

export default function HomeScreen() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const carouselRef = useRef<FlatList>(null)

  const carouselImages = [
    {
      id: 1,
      image: require("../../assets/images/astro.jpg"),
      title: "Game On!",
      subtitle: "Rent PS5 consoles delivered to your home",
    },
    {
      id: 2,
      image: require("../../assets/images/ps.jpg"),
      title: "Latest Games",
      subtitle: "Access to newest AAA titles and exclusives",
    },
    {
      id: 3,
      image: require("../../assets/images/pslogo.jpg"),
      title: "Premium Setup",
      subtitle: "Professional gaming setup at your doorstep",
    },
    {
      id: 4,
      image: require("../../assets/images/warzone.jpg"),
      title: "Tournament Ready",
      subtitle: "Compete with friends in epic gaming battles",
    },
    {
      id: 5,
      image: require("../../assets/images/wallpaper.jpg"),
      title: "24/7 Support",
      subtitle: "Round-the-clock gaming assistance",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        const nextSlide = (prev + 1) % carouselImages.length
        carouselRef.current?.scrollToIndex({ index: nextSlide, animated: true })
        return nextSlide
      })
    }, 4000)

    return () => clearInterval(timer)
  }, [])

  const renderCarouselItem = ({ item }: { item: any }) => (
    <View style={styles.carouselSlide}>
      <Image source={item.image} style={styles.heroImage} />
      <View style={styles.heroOverlay}>
        <Text style={styles.heroTitle}>{item.title}</Text>
        <Text style={styles.heroSubtitle}>{item.subtitle}</Text>
      </View>
    </View>
  )

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Text style={styles.brandTitle}>RAPS</Text>
        <Text style={styles.brandSubtitle}>POWERPLAY</Text>
        <Text style={styles.tagline}>PlayStation Gaming at Your Doorstep</Text>
      </View>

      {/* Hero Carousel Section */}
      <View style={styles.heroSection}>
        <FlatList
          ref={carouselRef}
          data={carouselImages}
          renderItem={renderCarouselItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width)
            setCurrentSlide(slideIndex)
          }}
          keyExtractor={(item) => item.id.toString()}
        />

        <View style={styles.carouselIndicators}>
          {carouselImages.map((_, index) => (
            <View
              key={index}
              style={[styles.indicator, index === currentSlide ? styles.activeIndicator : styles.inactiveIndicator]}
            />
          ))}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>🎮 Rent PlayStation</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>🎯 Browse Games</Text>
        </TouchableOpacity>
      </View>

      {/* Features Grid */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Why Choose RAPS?</Text>
        <View style={styles.featuresGrid}>
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🎮</Text>
            <Text style={styles.featureTitle}>Latest Consoles</Text>
            <Text style={styles.featureText}>PS5 & accessories delivered fresh</Text>
          </View>
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🚚</Text>
            <Text style={styles.featureTitle}>Home Delivery</Text>
            <Text style={styles.featureText}>Setup included, hassle-free</Text>
          </View>
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>💰</Text>
            <Text style={styles.featureTitle}>Affordable</Text>
            <Text style={styles.featureText}>Flexible rental periods</Text>
          </View>
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🎯</Text>
            <Text style={styles.featureTitle}>Game Library</Text>
            <Text style={styles.featureText}>Latest AAA titles included</Text>
          </View>
        </View>
      </View>

      {/* Popular Games */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>🔥 Trending Games</Text>
        <View style={styles.modernGamesContainer}>
          {[
            { name: "FIFA 24", genre: "Sports", rating: "4.8", players: "1.2M", color: "#00d4aa" },
            { name: "Spider-Man 2", genre: "Action", rating: "4.9", players: "2.1M", color: "#ff6b35" },
            { name: "Call of Duty", genre: "FPS", rating: "4.7", players: "3.5M", color: "#8b5cf6" },
            { name: "Mortal Kombat", genre: "Fighting", rating: "4.6", players: "890K", color: "#f59e0b" },
          ].map((game, index) => (
            <View key={index} style={[styles.modernGameCard, { borderLeftColor: game.color }]}>
              <View style={styles.gameHeader}>
                <Text style={styles.modernGameTitle}>{game.name}</Text>
                <View style={[styles.genreBadge, { backgroundColor: game.color + "20" }]}>
                  <Text style={[styles.genreText, { color: game.color }]}>{game.genre}</Text>
                </View>
              </View>
              <View style={styles.gameStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>⭐ {game.rating}</Text>
                  <Text style={styles.statLabel}>Rating</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>👥 {game.players}</Text>
                  <Text style={styles.statLabel}>Players</Text>
                </View>
                <TouchableOpacity style={[styles.playButton, { backgroundColor: game.color }]}>
                  <Text style={styles.playButtonText}>Buy</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Testimonials */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Happy Gamers</Text>
        <View style={styles.testimonialsContainer}>
          <View style={styles.testimonialCard}>
            <Text style={styles.testimonialText}>
              "Amazing service! PS5 delivered in perfect condition with all the latest games."
            </Text>
            <Text style={styles.testimonialAuthor}>- Rohan K.</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
            </View>
          </View>
          <View style={styles.testimonialCard}>
            <Text style={styles.testimonialText}>
              "Perfect for weekend gaming sessions with friends. Great value for money!"
            </Text>
            <Text style={styles.testimonialAuthor}>- Priya S.</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Stats and Contact Section */}
      <View style={styles.quickStatsSection}>
        <Text style={styles.sectionTitle}>📊 RAPS by Numbers</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>10K+</Text>
            <Text style={styles.statDescription}>Happy Gamers</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>500+</Text>
            <Text style={styles.statDescription}>Games Available</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>24/7</Text>
            <Text style={styles.statDescription}>Support</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>99%</Text>
            <Text style={styles.statDescription}>Uptime</Text>
          </View>
        </View>
      </View>

      {/* Contact Section */}
      <View style={styles.contactSection}>
        <Text style={styles.contactTitle}>Ready to Game? 🎮</Text>
        <Text style={styles.contactSubtitle}>Get your PlayStation delivered in 30 minutes</Text>
        <TouchableOpacity style={styles.contactButton}>
          <Text style={styles.contactButtonText}>📞 Call Now: +91 98765 43210</Text>
        </TouchableOpacity>
        <View style={styles.socialLinks}>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialText}>📱 WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialText}>📧 Email</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },

  // Header Section
  headerSection: {
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#ff6b35",
    letterSpacing: 2,
  },
  brandSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ff6b35",
    letterSpacing: 4,
    marginTop: -5,
  },
  tagline: {
    fontSize: 14,
    color: "#888",
    marginTop: 8,
    textAlign: "center",
  },

  // Hero Section
  heroSection: {
    position: "relative",
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 20,
    overflow: "hidden",
    height: 220,
  },
  carouselSlide: {
    width: width - 40,
    position: "relative",
  },
  heroImage: {
    width: width - 40,
    height: 220,
    borderRadius: 20,
  },
  heroOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 5,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#ddd",
    fontWeight: "500",
  },
  carouselIndicators: {
    position: "absolute",
    bottom: 15,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeIndicator: {
    backgroundColor: "#ff6b35",
  },
  inactiveIndicator: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },

  // Action Buttons
  actionContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 40,
    gap: 15,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#ff6b35",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#ff6b35",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#ff6b35",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#ff6b35",
    fontSize: 16,
    fontWeight: "600",
  },

  // Section Container
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },

  // Features Grid
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 15,
  },
  featureCard: {
    width: (width - 55) / 2,
    backgroundColor: "#1a1a1a",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  featureText: {
    fontSize: 13,
    color: "#aaa",
    textAlign: "center",
    lineHeight: 18,
  },

  // Modern Games Container
  modernGamesContainer: {
    gap: 16,
  },
  modernGameCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: "#333",
  },
  gameHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modernGameTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  genreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  genreText: {
    fontSize: 12,
    fontWeight: "600",
  },
  gameStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#888",
  },
  playButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  playButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  // Testimonials
  testimonialsContainer: {
    gap: 16,
  },
  testimonialCard: {
    backgroundColor: "#1a1a1a",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  testimonialText: {
    fontSize: 15,
    color: "#ddd",
    lineHeight: 22,
    marginBottom: 12,
    fontStyle: "italic",
  },
  testimonialAuthor: {
    fontSize: 14,
    color: "#ff6b35",
    fontWeight: "600",
    marginBottom: 8,
  },
  ratingContainer: {
    alignItems: "flex-start",
  },
  stars: {
    fontSize: 16,
  },

  // Quick Stats Section
  quickStatsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 15,
  },
  statCard: {
    width: (width - 55) / 2,
    backgroundColor: "#1a1a1a",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#ff6b35",
    marginBottom: 8,
  },
  statDescription: {
    fontSize: 14,
    color: "#aaa",
    textAlign: "center",
  },

  // Contact Section
  contactSection: {
    backgroundColor: "#111",
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#333",
    marginTop: 20,
  },
  contactTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  contactSubtitle: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginBottom: 20,
  },
  contactButton: {
    backgroundColor: "#ff6b35",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 20,
  },
  contactButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  socialLinks: {
    flexDirection: "row",
    gap: 15,
  },
  socialButton: {
    backgroundColor: "#1a1a1a",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  socialText: {
    color: "#ff6b35",
    fontSize: 14,
    fontWeight: "600",
  },
})
