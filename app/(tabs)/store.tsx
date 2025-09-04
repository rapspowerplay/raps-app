import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

export default function StoreScreen() {
  const products = [
    {
      id: 1,
      name: "PS5 Controller",
      price: "₹4,999",
      image: "https://i.ibb.co/vvc4m4V/controller.jpg",
    },
    {
      id: 2,
      name: "Gaming Headset",
      price: "₹2,499",
      image: "https://i.ibb.co/bR7JkC3/headset.jpg",
    },
    {
      id: 3,
      name: "RAPS T-Shirt",
      price: "₹799",
      image: "https://i.ibb.co/Zd5Xwhj/tshirt.jpg",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🛒 RAPS Store</Text>
      <Text style={styles.subheader}>Grab your favorite gaming gear</Text>

      <View style={styles.productGrid}>
        {products.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>{item.price}</Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111", padding: 15 },
  header: { fontSize: 26, fontWeight: "bold", color: "#FF4500", textAlign: "center", marginVertical: 10 },
  subheader: { fontSize: 16, color: "#bbb", textAlign: "center", marginBottom: 20 },
  productGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: {
    backgroundColor: "#222",
    borderRadius: 12,
    padding: 10,
    width: "47%",
    marginBottom: 15,
    alignItems: "center",
  },
  image: { width: "100%", height: 120, borderRadius: 10, marginBottom: 10 },
  name: { color: "#fff", fontSize: 14, fontWeight: "bold", marginBottom: 5, textAlign: "center" },
  price: { color: "#FF4500", fontSize: 14, marginBottom: 10 },
  button: { backgroundColor: "#FF4500", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  buttonText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
});
