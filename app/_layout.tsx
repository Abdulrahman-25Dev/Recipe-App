import i18n from "../i18next/i18n";
import { Stack } from "expo-router";
import "./global.css";
import { useTheme } from "../store/useTheme";
import { useEffect, useState } from "react";
// ⚠️ تأكد إن الاستدعاء من nativewind وليس react-native
import { useColorScheme } from "nativewind"; 
import { I18nManager } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { AlertProvider } from "../components/CustomAlert";
import CustomSplash from "../components/CustomSplash";

I18nManager.allowRTL(false);
I18nManager.forceRTL(false);

export default function RootLayout() {
  const [isShowSplash, setIsShowSplash] = useState(true);
  const { setColorScheme } = useColorScheme();
  const { isDark, language } = useTheme(); // القيمة من الستور حقك

  useEffect(() => { 
    // هنا السحر: نحدث وضع nativewind كل ما تغير الستور
    setColorScheme(isDark ? "dark" : "light");
  }, [isDark, setColorScheme]);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  // عرض الـ Splash Screen أولاً حتى ينتهي شريط التحميل
  if (isShowSplash) {
    return <CustomSplash onFinish={() => setIsShowSplash(false)} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <AlertProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="Auth/Login" options={{ headerShown: false }} />
            <Stack.Screen name="Auth/Register" options={{ headerShown: false }} />
            <Stack.Screen
              name="account/EditProfile"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="account/ChangePassword"
              options={{ headerShown: false }}
            />
          </Stack>
        </AlertProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}