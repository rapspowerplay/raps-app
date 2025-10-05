"use client"

import { useRouter } from "expo-router"
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"

export default function GamesScreen() {
  const router = useRouter()

  const games = [
    {
      id: 1,
      title: "Crypto Puzzle",
      desc: "Solve blockchain puzzles to earn loyalty points and unlock exclusive rewards!",
      difficulty: "Medium",
      rewards: "50-200 pts",
      players: "1.2k+",
      category: "Puzzle",
      color: "#8A2BE2",
            image: require("../../assets/images/crypto.png"),
      path: "/games/crypto-puzzle",
    },
    {
      id: 2,
      title: "Trivia Challenge",
      desc: "Test your gaming knowledge with fun quizzes and compete with other players.",
      difficulty: "Easy",
      rewards: "25-100 pts",
      players: "3.5k+",
      category: "Quiz",
      color: "#FF4500",
      image: require("../../assets/images/trivia.png"),
      path: "/games/trivia",
    },
    {
      id: 3,
      title: "AR Treasure Hunt",
      desc: "Find hidden AR objects in your surroundings using advanced augmented reality.",
      difficulty: "Hard",
      rewards: "100-500 pts",
      players: "890+",
      category: "Adventure",
      color: "#00CED1",
      image: require("../../assets/images/ar-tr.jpeg"),
      path: "/games/ar-treasure",
    },
    {
      id: 4,
      title: "Memory Match",
      desc: "Flip cards and match pairs quickly to improve your memory and reaction time.",
      difficulty: "Easy",
      rewards: "20-80 pts",
      players: "2.1k+",
      category: "Memory",
      color: "#FFD700",
      image: require("../../assets/images/memmat.jpeg"),
      path: "/games/memory",
    },
  ]

  const achievements = [
    { title: "First Win", desc: "Complete your first game", progress: 100 },
    { title: "Point Master", desc: "Earn 1000 points", progress: 65 },
    { title: "Daily Player", desc: "Play 7 days in a row", progress: 43 },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "#00CED1"
      case "Medium":
        return "#FFD700"
      case "Hard":
        return "#FF4500"
      default:
        return "#888888"
    }
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Game Arena</Text>
        <Text style={styles.headerSubtitle}>Play, compete, and earn exclusive rewards</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>1,247</Text>
            <Text style={styles.statLabel}>Your Points</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>Level 8</Text>
            <Text style={styles.statLabel}>Current Rank</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>23</Text>
            <Text style={styles.statLabel}>Games Won</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Achievements</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.achievementsScroll}>
          {achievements.map((achievement, index) => (
            <View key={index} style={styles.achievementCard}>
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
              <Text style={styles.achievementDesc}>{achievement.desc}</Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${achievement.progress}%` }]} />
                </View>
                <Text style={styles.progressText}>{achievement.progress}%</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Games</Text>
        <Text style={styles.sectionSubtitle}>Choose your challenge and start earning</Text>

        <View style={styles.gamesGrid}>
          {games.map((game) => (
            <TouchableOpacity
              key={game.id}
              style={[styles.gameCard, { borderLeftColor: game.color }]}
              onPress={() => router.push(game.path)}
            >
              <View style={styles.gameHeader}>
                <View style={styles.gameCategory}>
                  <Text style={styles.categoryText}>{game.category}</Text>
                </View>
                <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(game.difficulty) }]}>
                  <Text style={styles.difficultyText}>{game.difficulty}</Text>
                </View>
              </View>

              {game.image && <Image source={game.image} style={styles.gameImage} />}

              <View style={styles.gameContent}>
                <Text style={styles.gameTitle}>{game.title}</Text>
                <Text style={styles.gameDesc}>{game.desc}</Text>

                <View style={styles.gameStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statIcon}>🏆</Text>
                    <Text style={styles.statText}>{game.rewards}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statIcon}>👥</Text>
                    <Text style={styles.statText}>{game.players}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.playButton, { backgroundColor: game.color }]}
                  onPress={() => router.push(game.path)}
                >
                  <Text style={styles.playButtonText}>Play Now</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weekly Leaderboard</Text>
        <View style={styles.leaderboardContainer}>
          <View style={styles.leaderboardItem}>
            <Text style={styles.rank}>🥇</Text>
            <Text style={styles.playerName}>GameMaster_Pro</Text>
            <Text style={styles.points}>2,847 pts</Text>
          </View>
          <View style={styles.leaderboardItem}>
            <Text style={styles.rank}>🥈</Text>
            <Text style={styles.playerName}>PixelWarrior</Text>
            <Text style={styles.points}>2,156 pts</Text>
          </View>
          <View style={styles.leaderboardItem}>
            <Text style={styles.rank}>🥉</Text>
            <Text style={styles.playerName}>RetroGamer</Text>
            <Text style={styles.points}>1,923 pts</Text>
          </View>
          <View style={[styles.leaderboardItem, styles.currentPlayer]}>
            <Text style={styles.rank}>8th</Text>
            <Text style={styles.playerName}>You</Text>
            <Text style={styles.points}>1,247 pts</Text>
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
    justifyContent: "space-between",
  },
  statCard: {
    backgroundColor: "#1a1a1a",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FF4500",
  },
  statLabel: {
    fontSize: 12,
    color: "#666666",
    marginTop: 4,
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
  achievementsScroll: {
    paddingVertical: 8,
  },
  achievementCard: {
    backgroundColor: "#111111",
    padding: 16,
    borderRadius: 12,
    width: 200,
    marginRight: 16,
  },
  achievementTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  achievementDesc: {
    color: "#888888",
    fontSize: 12,
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#333333",
    borderRadius: 3,
    marginRight: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FF4500",
    borderRadius: 3,
  },
  progressText: {
    color: "#FF4500",
    fontSize: 12,
    fontWeight: "600",
  },
  gamesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  gameCard: {
    backgroundColor: "#111111",
    borderRadius: 16,
    overflow: "hidden",
    borderLeftWidth: 4,
    width: "48%",
  },
  gameHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingBottom: 8,
  },
  gameCategory: {
    backgroundColor: "#333333",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    color: "#000000",
    fontSize: 10,
    fontWeight: "700",
  },
  gameImage: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
  },
  gameContent: {
    padding: 12,
  },
  gameTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  gameDesc: {
    color: "#888888",
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 12,
  },
  gameStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  statText: {
    color: "#666666",
    fontSize: 12,
  },
  playButton: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  playButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  leaderboardContainer: {
    backgroundColor: "#111111",
    borderRadius: 16,
    padding: 16,
  },
  leaderboardItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  currentPlayer: {
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 0,
  },
  rank: {
    fontSize: 16,
    width: 40,
  },
  playerName: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  points: {
    color: "#FF4500",
    fontSize: 14,
    fontWeight: "600",
  },
})
