import { useEffect, useState, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { useRouter } from "expo-router";

const VIDEO_KEY = __DEV__ ? String(Date.now()) : "video";

export default function SplashScreen() {
  const router = useRouter();
  const [navigated, setNavigated] = useState(false);

  const player = useVideoPlayer(require("../assets/vid/rapsvid.mp4"), (p: any) => {
    try { p.muted = false; } catch {}
    try { p.loop = false; } catch {}
    try { p.play(); } catch {}
  });

  const goNext = useCallback(() => {
    if (navigated) return;
    setNavigated(true);
    router.replace("/phone");
  }, [navigated, router]);

  useEffect(() => {
    const t = setTimeout(goNext, 6000); // fallback
    return () => {
      clearTimeout(t);
      try { player.pause?.(); } catch {}
    };
  }, [goNext, player]);

  return (
    <View style={styles.container}>
      <VideoView
        key={VIDEO_KEY}
        style={styles.video}
        player={player}
        contentFit="contain"       // shows entire video, no cropping
        contentPosition="center"   // center it inside the view
        nativeControls={false}
        onPlaybackStatusUpdate={(s: any) => {
          if (s?.isLoaded && s.didJustFinish) goNext();
        }}
        onError={(e: any) => {
          console.error("Video error:", e?.nativeEvent ?? e);
          goNext();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" }, // black bars if aspect ratios differ
  video: { ...StyleSheet.absoluteFillObject, backgroundColor: "#000" },
});