"use client"

import { useState, useEffect, useRef } from "react"
import { StyleSheet, Text, View, TouchableOpacity, Alert, Dimensions } from "react-native"
import { CameraView, useCameraPermissions } from "expo-camera"
import { GLView } from "expo-gl"
import { Renderer } from "expo-three"
import * as THREE from "three"

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

export default function ARTreasureHunt(): JSX.Element {
  const [permission, requestPermission] = useCameraPermissions()
  const [score, setScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(90)
  const [treasuresFound, setTreasuresFound] = useState(0)
  const [hintText, setHintText] = useState("")
  const [difficulty, setDifficulty] = useState(1) // 1: Easy, 2: Medium, 3: Hard

  const requestRef = useRef<number | null>(null)
  const cubeRef = useRef<THREE.Object3D | null>(null) // now holds the PS5 group
  const gameTimerRef = useRef<any>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const hiddenObjectsRef = useRef<THREE.Mesh[]>([])
  const environmentRef = useRef<THREE.Group | null>(null)

  useEffect(() => {
    return () => {
      if (requestRef.current != null) {
        cancelAnimationFrame(requestRef.current)
      }
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current)
      }
    }
  }, [])

  const startGame = () => {
    setGameStarted(true)
    setScore(0)
    setTreasuresFound(0)
    setTimeLeft(90)
    setHintText("Look around for hidden treasures!")

    if (cubeRef.current) {
      cubeRef.current.visible = false
    }
    hiddenObjectsRef.current.forEach(obj => {
      if (obj) obj.visible = false
    })

    setTimeout(() => {
      spawnTreasure()
    }, 2000)

    gameTimerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame()
          return 0
        }
        if (prev === 60) setHintText("Try looking behind virtual objects!")
        if (prev === 30) setHintText("Check corners and hidden spots!")
        if (prev === 10) setHintText("Time is running out! Look carefully!")
        return prev - 1
      })
    }, 1000)
  }

  const endGame = () => {
    setGameStarted(false)
    setHintText("")
    if (cubeRef.current) {
      cubeRef.current.visible = false
    }
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current)
    }

    Alert.alert("Game Over!", `Final Score: ${score}\nTreasures Found: ${treasuresFound}`, [
      { text: "Play Again", onPress: startGame },
      { text: "Change Difficulty", onPress: () => setGameStarted(false) },
    ])
  }

  const createEnvironment = (scene: THREE.Scene) => {
    if (environmentRef.current) {
      scene.remove(environmentRef.current)
    }

    const environment = new THREE.Group()
    const objects = [
      { type: 'cube', position: [2, 0, -3], size: [1, 1, 1], color: 0x3498db },
      { type: 'sphere', position: [-2, 0.5, -4], size: [0.8], color: 0xe74c3c },
      { type: 'cylinder', position: [0, 0.5, -5], size: [0.5, 0.5, 1], color: 0x2ecc71 },
      { type: 'cube', position: [3, 0.3, -6], size: [1.2, 0.6, 0.8], color: 0xf39c12 },
    ]

    objects.forEach((obj, index) => {
      let geometry
      switch (obj.type) {
        case 'sphere':
          geometry = new THREE.SphereGeometry(...obj.size)
          break
        case 'cylinder':
          geometry = new THREE.CylinderGeometry(...obj.size)
          break
        default:
          geometry = new THREE.BoxGeometry(...obj.size)
      }

      const material = new THREE.MeshPhongMaterial({
        color: obj.color,
        transparent: true,
        opacity: 0.8
      })

      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(...obj.position)
      environment.add(mesh)
      hiddenObjectsRef.current[index] = mesh
    })

    scene.add(environment)
    environmentRef.current = environment
  }

  // Build a stylized PS5 using primitive geometry (no external model needed)
  const createPS5Treasure = () => {
    const group = new THREE.Group()

    // Center black tower
    const centerGeom = new THREE.BoxGeometry(0.22, 0.9, 0.12)
    const centerMat = new THREE.MeshPhongMaterial({
      color: 0x111111,
      shininess: 100,
      specular: 0x333333,
    })
    const center = new THREE.Mesh(centerGeom, centerMat)
    group.add(center)

    // White side plates (slightly flared/tilted)
    const plateGeom = new THREE.BoxGeometry(0.02, 1.0, 0.18)
    const plateMat = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      shininess: 90,
      specular: 0xdddddd,
    })
    const left = new THREE.Mesh(plateGeom, plateMat)
    left.position.set(-0.13, 0, 0)
    left.rotation.z = 0.18
    left.rotation.y = 0.06
    group.add(left)

    const right = new THREE.Mesh(plateGeom, plateMat.clone())
    right.position.set(0.13, 0, 0)
    right.rotation.z = -0.18
    right.rotation.y = -0.06
    group.add(right)

    // Blue light strips
    const stripGeom = new THREE.BoxGeometry(0.18, 0.012, 0.01)
    const stripMat = new THREE.MeshPhongMaterial({
      color: 0x3d8bfd,
      emissive: 0x0a2eff,
      emissiveIntensity: 1.1,
    })
    const stripTop = new THREE.Mesh(stripGeom, stripMat)
    stripTop.position.set(0, 0.2, 0.06)
    group.add(stripTop)

    const stripBottom = stripTop.clone()
    stripBottom.position.set(0, -0.2, 0.06)
    group.add(stripBottom)

    // Stand
    const standGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.02, 24)
    const standMat = new THREE.MeshPhongMaterial({ color: 0x222222, shininess: 80 })
    const stand = new THREE.Mesh(standGeom, standMat)
    stand.position.set(0, -0.47, 0)
    group.add(stand)

    group.visible = false
    return group
  }

  const onContextCreate = async (gl: any) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl

    const renderer = new Renderer({ gl })
    renderer.setSize(width, height)
    renderer.setClearColor(0x000000, 0)

    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera3D = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera3D.position.z = 5
    cameraRef.current = camera3D

    const ambientLight = new THREE.AmbientLight(0x404040, 0.7)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9)
    directionalLight.position.set(2, 3, 4)
    scene.add(directionalLight)

    // Hiding spots (virtual occluders)
    createEnvironment(scene)

    // Treasure: PS5 group
    const ps5 = createPS5Treasure()
    cubeRef.current = ps5
    scene.add(ps5)

    // Particles (sparkle) attached to treasure
    const particleGeometry = new THREE.BufferGeometry()
    const particleCount = 50
    const posArray = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 2
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0xffff00,
      transparent: true,
      opacity: 0.6
    })
    const particles = new THREE.Points(particleGeometry, particleMaterial)
    ps5.add(particles)

    const render = () => {
      requestRef.current = requestAnimationFrame(render)

      if (ps5.visible) {
        // Gentle bob and slow spin
        ps5.rotation.y += 0.02
        ps5.position.y = Math.sin(Date.now() * 0.002) * 0.3
        particles.rotation.y += 0.01
      }

      // Subtle environment motion
      hiddenObjectsRef.current.forEach((obj, index) => {
        if (obj) obj.rotation.y += 0.005 * (index % 2 === 0 ? 1 : -1)
      })

      renderer.render(scene, camera3D)
      gl.endFrameEXP()
    }
    render()
  }

  const spawnTreasure = () => {
    if (cubeRef.current && gameStarted && sceneRef.current) {
      const distance = 3 + (difficulty * 2)
      const x = (Math.random() - 0.5) * 4
      const z = -distance
      const y = Math.random() * 2 - 1

      cubeRef.current.position.set(x, y, z)
      cubeRef.current.visible = true

      // Randomly hide behind one of the virtual objects
      if (Math.random() > 0.5 && hiddenObjectsRef.current.length > 0) {
        const hidingSpot = hiddenObjectsRef.current[Math.floor(Math.random() * hiddenObjectsRef.current.length)]
        if (hidingSpot) {
          cubeRef.current.position.copy(hidingSpot.position)
          cubeRef.current.position.x += (Math.random() - 0.5) * 0.5
          cubeRef.current.position.z += 0.5 // Slightly behind the object
        }
      }

      setHintText("A treasure is hidden somewhere! Move around to find it.")

      const hideTime = 10000 - (difficulty * 2000)
      setTimeout(() => {
        if (cubeRef.current && cubeRef.current.visible) {
          cubeRef.current.visible = false
          setHintText("Too slow! The treasure disappeared.")
          setTimeout(() => {
            if (gameStarted) spawnTreasure()
          }, 2000)
        }
      }, hideTime)
    }
  }

  const collectTreasure = () => {
    if (cubeRef.current && cubeRef.current.visible) {
      cubeRef.current.visible = false
      const points = 100 * difficulty
      setScore(prev => prev + points)
      setTreasuresFound(prev => prev + 1)
      setHintText(`+${points} points! Treasure collected!`)

      setTimeout(() => {
        if (gameStarted) {
          spawnTreasure()
        }
      }, 1500)
    }
  }

  const increaseDifficulty = () => {
    setDifficulty(prev => {
      const newDifficulty = prev < 3 ? prev + 1 : 1
      setHintText(`Difficulty: ${['Easy', 'Medium', 'Hard'][newDifficulty - 1]}`)
      return newDifficulty
    })
  }

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text>Loading camera permissions...</Text>
      </View>
    )
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.permissionText}>Camera access is required for AR treasure hunt</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="back" />
      <GLView style={styles.glView} onContextCreate={onContextCreate} />

      <View style={styles.overlay}>
        <View style={styles.statsContainer}>
          <Text style={styles.score}>💰 Score: {score}</Text>
          <Text style={styles.treasures}>🏆 Found: {treasuresFound}</Text>
          {gameStarted && <Text style={styles.timer}>⏰ {timeLeft}s</Text>}
          <Text
            style={[
              styles.difficulty,
              difficulty === 1 ? styles.easy : difficulty === 2 ? styles.medium : styles.hard,
            ]}
          >
            {['Easy', 'Medium', 'Hard'][difficulty - 1]}
          </Text>
        </View>

        {hintText ? (
          <View style={styles.hintContainer}>
            <Text style={styles.hintText}>{hintText}</Text>
          </View>
        ) : null}

        {!gameStarted ? (
          <View style={styles.menuContainer}>
            <Text style={styles.title}>AR Treasure Hunt</Text>
            <Text style={styles.subtitle}>Find hidden treasures in your environment!</Text>

            <TouchableOpacity style={styles.startButton} onPress={startGame}>
              <Text style={styles.buttonText}>Start Game</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.difficultyButton} onPress={increaseDifficulty}>
              <Text style={styles.buttonText}>
                Difficulty: {['Easy', 'Medium', 'Hard'][difficulty - 1]}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.gameControls}>
            <TouchableOpacity style={styles.collectButton} onPress={collectTreasure}>
              <Text style={styles.buttonText}>Collect Treasure!</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.endButton} onPress={endGame}>
              <Text style={styles.buttonText}>End Game</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.instructions}>
          <Text style={styles.instructionText}>
            💡 Move your device to look around{'\n'}
            🔍 Treasures hide behind virtual objects{'\n'}
            ⏱️ Find them before they disappear!
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { ...StyleSheet.absoluteFillObject },
  glView: { ...StyleSheet.absoluteFillObject },
  overlay: {
    position: "absolute",
    top: 50,
    bottom: 20,
    left: 20,
    right: 20,
    justifyContent: "space-between",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  score: { color: "#FFD700", fontSize: 14, fontWeight: "bold" },
  treasures: { color: "#FF6B35", fontSize: 14, fontWeight: "bold" },
  timer: { color: "#FF4444", fontSize: 14, fontWeight: "bold" },
  difficulty: {
    fontSize: 12, fontWeight: "bold",
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10,
  },
  easy: { backgroundColor: "#4CAF50", color: "white" },
  medium: { backgroundColor: "#FF9800", color: "white" },
  hard: { backgroundColor: "#F44336", color: "white" },
  hintContainer: {
    backgroundColor: "rgba(0,0,0,0.7)", padding: 10, borderRadius: 10,
    alignSelf: "center", marginVertical: 10,
  },
  hintText: { color: "#4FC3F7", fontSize: 14, fontWeight: "bold", textAlign: "center" },
  menuContainer: {
    alignItems: "center", backgroundColor: "rgba(0,0,0,0.7)",
    padding: 20, borderRadius: 15, marginVertical: 20,
  },
  title: { color: "#FFD700", fontSize: 24, fontWeight: "bold", marginBottom: 5 },
  subtitle: { color: "white", fontSize: 14, textAlign: "center", marginBottom: 20 },
  gameControls: { alignItems: "center", gap: 10 },
  button: {
    backgroundColor: "#FF4500", paddingVertical: 12, paddingHorizontal: 20,
    borderRadius: 10, minWidth: 180, alignItems: "center",
  },
  startButton: {
    backgroundColor: "#4CAF50", paddingVertical: 15, paddingHorizontal: 30,
    borderRadius: 10, minWidth: 200, alignItems: "center", marginBottom: 10,
  },
  difficultyButton: {
    backgroundColor: "#2196F3", paddingVertical: 12, paddingHorizontal: 20,
    borderRadius: 10, minWidth: 180, alignItems: "center",
  },
  collectButton: {
    backgroundColor: "#FFD700", paddingVertical: 12, paddingHorizontal: 20,
    borderRadius: 10, minWidth: 180, alignItems: "center",
  },
  endButton: {
    backgroundColor: "#FF6B6B", paddingVertical: 8, paddingHorizontal: 16,
    borderRadius: 8, minWidth: 120, alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold", textAlign: "center" },
  instructions: {
    backgroundColor: "rgba(0,0,0,0.7)", padding: 10, borderRadius: 10, marginTop: 10,
  },
  instructionText: { color: "#BBBBBB", fontSize: 12, textAlign: "center", lineHeight: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  permissionText: { fontSize: 16, textAlign: "center", marginBottom: 20, color: "#333" },
})