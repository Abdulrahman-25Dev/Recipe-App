import "../i18next/i18n";
import { Stack } from "expo-router";
import "./global.css";
import { useTheme } from "../store/useTheme";
import { useEffect } from "react";
// ⚠️ تأكد إن الاستدعاء من nativewind وليس react-native
import { useColorScheme } from "nativewind"; 
import { I18nManager } from "react-native";

I18nManager.allowRTL(false);
I18nManager.forceRTL(false);

export default function RootLayout() {
  const { setColorScheme } = useColorScheme();
  const { isDark } = useTheme(); // القيمة من الستور حقك

  useEffect(() => { 
    // هنا السحر: نحدث وضع nativewind كل ما تغير الستور
    setColorScheme(isDark ? "dark" : "light");
  }, [isDark, setColorScheme]);

  

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="Auth/Login" options={{ headerShown: false }} />
      <Stack.Screen name="Auth/Register" options={{ headerShown: false }} />
    </Stack>
  );
}