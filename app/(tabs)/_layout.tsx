"use client"

import { Tabs } from "expo-router"
import { useState } from "react"
import { Platform, View, Modal, TouchableOpacity, Text, StyleSheet, SafeAreaView } from "react-native"
import { Ionicons } from "@expo/vector-icons"

export default function TabLayout() {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)

  const SideDrawer = () => (
    <Modal
      visible={isDrawerVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsDrawerVisible(false)}
    >
      <View style={styles.drawerOverlay}>
        <TouchableOpacity style={styles.drawerBackdrop} onPress={() => setIsDrawerVisible(false)} />
        <View style={styles.drawerContainer}>
          <SafeAreaView style={styles.drawerContent}>
            {/* Header */}
            <View style={styles.drawerHeader}>
              <View style={styles.profileSection}>
                <View style={styles.profileAvatar}>
                  <Ionicons name="person" size={32} color="#ff6b35" />
                </View>
                <Text style={styles.profileName}>Member</Text>
                <Text style={styles.profileEmail}>member@gmail.com</Text>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={() => setIsDrawerVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Menu Items */}
            <View style={styles.menuContainer}>
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="person-outline" size={20} color="#ff6b35" />
                <Text style={styles.menuText}>Profile</Text>
                <Ionicons name="chevron-forward" size={16} color="#666" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="settings-outline" size={20} color="#ff6b35" />
                <Text style={styles.menuText}>Settings</Text>
                <Ionicons name="chevron-forward" size={16} color="#666" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="card-outline" size={20} color="#ff6b35" />
                <Text style={styles.menuText}>Payment Methods</Text>
                <Ionicons name="chevron-forward" size={16} color="#666" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="time-outline" size={20} color="#ff6b35" />
                <Text style={styles.menuText}>Rental History</Text>
                <Ionicons name="chevron-forward" size={16} color="#666" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="help-circle-outline" size={20} color="#ff6b35" />
                <Text style={styles.menuText}>Help & Support</Text>
                <Ionicons name="chevron-forward" size={16} color="#666" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="star-outline" size={20} color="#ff6b35" />
                <Text style={styles.menuText}>Rate App</Text>
                <Ionicons name="chevron-forward" size={16} color="#666" />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="log-out-outline" size={20} color="#ff4444" />
                <Text style={[styles.menuText, { color: "#ff4444" }]}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  )

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#FF4500",
          tabBarInactiveTintColor: "#bbb",
          headerStyle: {
            backgroundColor: "#111",
          },
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
            color: "#FF4500",
          },
          headerLeft: () => (
            <TouchableOpacity style={{ marginLeft: 15 }} onPress={() => setIsDrawerVisible(true)}>
              <Ionicons name="menu" size={24} color="#FF4500" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={{ marginRight: 15 }}>
              <Ionicons name="notifications" size={24} color="#FF4500" />
            </View>
          ),
          tabBarStyle: Platform.select({
            ios: {
              position: "absolute",
              backgroundColor: "#1c1c1c",
            },
            default: {
              backgroundColor: "#1c1c1c",
              borderTopWidth: 0,
              elevation: 6,
            },
          }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            headerTitle: "🎮 RAPS Powerplay",
            tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="offer"
          options={{
            title: "Offers",
            headerTitle: "🔥 Hot Offers",
            tabBarIcon: ({ color, size }) => <Ionicons name="gift" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="store"
          options={{
            title: "Store",
            headerTitle: "🛒 RAPS Store",
            tabBarIcon: ({ color, size }) => <Ionicons name="cart" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="booking"
          options={{
            title: "Booking",
            headerTitle: "📅 Game Booking",
            tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="games"
          options={{
            title: "Games",
            headerTitle: "🎮 Mini Games",
            tabBarIcon: ({ color, size }) => <Ionicons name="game-controller" size={size} color={color} />,
          }}
        />
        {/* <Tabs.Screen
          name="camera"
          options={{
            title: "camera",
            headerTitle: "📷 Camera",
            tabBarIcon: ({ color, size }) => <Ionicons name="camera" size={size} color={color} />,
          }}
        /> */}
      </Tabs>

      <SideDrawer />
    </>
  )
}

const styles = StyleSheet.create({
  drawerOverlay: {
    flex: 1,
    flexDirection: "row",
  },
  drawerBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  drawerContainer: {
    width: 280,
    backgroundColor: "#1a1a1a",
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  drawerContent: {
    flex: 1,
  },
  drawerHeader: {
    backgroundColor: "#111",
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  profileSection: {
    alignItems: "center",
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#888",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    padding: 8,
  },
  menuContainer: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
    marginLeft: 16,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#333",
    marginVertical: 10,
  },
})
