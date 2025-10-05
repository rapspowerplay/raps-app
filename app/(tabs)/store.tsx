import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from "react-native"

export default function StoreScreen() {
  const products = [
    {
      id: 1,
      name: "PS5 DualSense Controller",
      price: "₹4,999",
      originalPrice: "₹5,999",
      image: require("../../assets/images/controller.jpeg"),
      badge: "BESTSELLER",
      rating: 4.8,
      reviews: 234,
    },
    {
      id: 2,
      name: "Gaming Headset Pro",
      price: "₹2,499",
      originalPrice: "₹3,499",
      image: require("../../assets/images/headset.jpeg"),
      badge: "30% OFF",
      rating: 4.6,
      reviews: 156,
    },
    {
      id: 3,
      name: "VR SET",
      price: "₹799",
      originalPrice: "₹1,299",
      image: require("../../assets/images/vr.jpeg"),
      badge: "LIMITED",
      rating: 4.9,
      reviews: 89,
    },
    {
      id: 4,
      name: "Gaming Mouse Pad XL",
      price: "₹1,299",
      originalPrice: "₹1,799",
      image: require("../../assets/images/mouse.jpeg"),
      badge: "NEW",
      rating: 4.7,
      reviews: 67,
    },
  ]

  const categories = ["All", "Controllers", "Audio", "Apparel", "Accessories"]

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gaming Arsenal</Text>
        <Text style={styles.headerSubtitle}>Premium gear for legendary gamers</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>500+</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4.8★</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>24h</Text>
            <Text style={styles.statLabel}>Delivery</Text>
          </View>
        </View>
      </View>

      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {categories.map((category, index) => (
            <TouchableOpacity key={category} style={[styles.categoryChip, index === 0 && styles.categoryChipActive]}>
              <Text style={[styles.categoryText, index === 0 && styles.categoryTextActive]}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.productGrid}>
        {products.map((item) => (
          <View key={item.id} style={styles.productCard}>
            <View style={styles.imageContainer}>
              <Image source={item.image} style={styles.productImage} />
              <View
                style={[
                  styles.badge,
                  item.badge === "BESTSELLER" && styles.badgeBestseller,
                  item.badge === "30% OFF" && styles.badgeDiscount,
                  item.badge === "LIMITED" && styles.badgeLimited,
                  item.badge === "NEW" && styles.badgeNew,
                ]}
              >
                <Text style={styles.badgeText}>{item.badge}</Text>
              </View>
            </View>

            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.rating}>★ {item.rating}</Text>
                <Text style={styles.reviews}>({item.reviews})</Text>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>{item.price}</Text>
                <Text style={styles.originalPrice}>{item.originalPrice}</Text>
              </View>
              <TouchableOpacity style={styles.addToCartButton}>
                <Text style={styles.addToCartText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.featuredSection}>
        <Text style={styles.featuredTitle}>Why Choose RAPS Store?</Text>
        <View style={styles.featuresGrid}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🚚</Text>
            <Text style={styles.featureText}>Free Delivery</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🔒</Text>
            <Text style={styles.featureText}>Secure Payment</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>↩️</Text>
            <Text style={styles.featureText}>Easy Returns</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>⚡</Text>
            <Text style={styles.featureText}>24/7 Support</Text>
          </View>
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
  header: {
    padding: 24,
    paddingTop: 40,
    backgroundColor: "#111111",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#888888",
    textAlign: "center",
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FF4500",
  },
  statLabel: {
    fontSize: 12,
    color: "#666666",
    marginTop: 4,
  },
  categoriesContainer: {
    paddingVertical: 20,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#333333",
  },
  categoryChipActive: {
    backgroundColor: "#FF4500",
    borderColor: "#FF4500",
  },
  categoryText: {
    color: "#888888",
    fontSize: 14,
    fontWeight: "600",
  },
  categoryTextActive: {
    color: "#ffffff",
  },
  productGrid: {
    paddingHorizontal: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productCard: {
    backgroundColor: "#111111",
    borderRadius: 16,
    width: "48%",
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#222222",
  },
  imageContainer: {
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeBestseller: {
    backgroundColor: "#FFD700",
  },
  badgeDiscount: {
    backgroundColor: "#FF4500",
  },
  badgeLimited: {
    backgroundColor: "#8A2BE2",
  },
  badgeNew: {
    backgroundColor: "#00CED1",
  },
  badgeText: {
    color: "#000000",
    fontSize: 10,
    fontWeight: "700",
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  rating: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "600",
  },
  reviews: {
    color: "#666666",
    fontSize: 12,
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  price: {
    color: "#FF4500",
    fontSize: 16,
    fontWeight: "700",
  },
  originalPrice: {
    color: "#666666",
    fontSize: 12,
    textDecorationLine: "line-through",
    marginLeft: 8,
  },
  addToCartButton: {
    backgroundColor: "#FF4500",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  addToCartText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  featuredSection: {
    padding: 24,
    backgroundColor: "#111111",
    margin: 16,
    borderRadius: 16,
    marginBottom: 40,
  },
  featuredTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureItem: {
    width: "48%",
    alignItems: "center",
    marginBottom: 16,
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureText: {
    color: "#888888",
    fontSize: 12,
    textAlign: "center",
  },
})
