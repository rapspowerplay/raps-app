import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useEffect, useRef } from "react";

const DEV_RELOAD_KEY = __DEV__ ? String(Date.now()) : "prod";

function DevForceSplashOnce() {
  const router = useRouter();
  const pathname = usePathname();
  const forcedOnce = useRef(false);
  const initialPath = useRef<string | null>(null);

  if (initialPath.current === null) {
    initialPath.current = pathname; // capture initial path once
  }

  useEffect(() => {
    if (!__DEV__) return;
    if (forcedOnce.current) return;
    forcedOnce.current = true;

    // Only redirect if we didn't already land on splash initially
    if (initialPath.current !== "/splash") {
      // Defer to next tick to avoid nested updates on mount
      setTimeout(() => router.replace("/splash"), 0);
    }
  }, [router]);

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) return null;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <DevForceSplashOnce />
      <Stack key={DEV_RELOAD_KEY} initialRouteName="splash">
        <Stack.Screen name="splash" options={{ headerShown: false }} />
        <Stack.Screen name="phone" options={{ headerShown: false }} />
        <Stack.Screen name="otp" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}