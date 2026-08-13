import i18n from "../i18next/i18n";
import "./global.css";
import { useTheme } from "../store/useTheme";
import { useEffect, useState } from "react";
import { useColorScheme } from "nativewind"; 
import { I18nManager, View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import CustomSplash from "../components/CustomSplash";
import Onboarding from "../components/Onboarding";
import { AlertProvider } from "../components/CustomAlert";

I18nManager.allowRTL(false);
I18nManager.forceRTL(false);

const HAS_SEEN_ONBOARDING_KEY = "has_seen_onboarding";

export default function RootLayout() {
  const [isShowSplash, setIsShowSplash] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  const { setColorScheme } = useColorScheme();
  const { isDark, language } = useTheme();

  // 1. التحقق مما إذا كانت هذه هي المرة الأولى لفتح التطبيق
  useEffect(() => {
    async function checkFirstLaunch() {
      try {
        const hasSeen = await AsyncStorage.getItem(HAS_SEEN_ONBOARDING_KEY);
        if (hasSeen) {
          setIsFirstLaunch(false);
        } else {
          setIsFirstLaunch(true);
        }
      } catch {
        setIsFirstLaunch(false); // في حال حدث خطأ، يدخل للتطبيق مباشرة
      }
    }
    checkFirstLaunch();
  }, []);

  // 2. تحديث المظهر
  useEffect(() => { 
    setColorScheme(isDark ? "dark" : "light");
  }, [isDark, setColorScheme]);

  // 4. تحديث اللغة
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  // دالة تُستدعى عند تخطي أو إنهاء الـ Onboarding
  const handleFinishOnboarding = () => {
    // حفظ الحالة بشكل غير متزامن وبدون انتظار حتى لا يتأخر الخروج
    AsyncStorage.setItem(HAS_SEEN_ONBOARDING_KEY, "true").catch((error) => {
      console.error("Error saving onboarding state:", error);
    });
    setIsFirstLaunch(false);
  };

  // أولاً: عرض الـ Splash Screen حتى ينتهي المؤقت
  if (isShowSplash) {
    return <CustomSplash onFinish={() => setIsShowSplash(false)} />;
  }

  // ثانياً: شاشة إضافية مؤقتة لو لم يتحدد وضع الاستخدام الأول بعد
  if (isFirstLaunch === null) {
    return (
      <View className="flex-1 justify-center items-center bg-[#223D4D]">
        <ActivityIndicator size="large" color="#FD802E" />
      </View>
    );
  }

  // ثالثاً: إذا كانت المرة الأولى، نعرض الـ Onboarding
  if (isFirstLaunch) {
    return <Onboarding onFinish={handleFinishOnboarding} />;
  }

  // رابعاً: التطبيق الرسمي، وشاشة تسجيل الدخول محمية من داخل الصفحة الرئيسية
  // بحيث يُعاد التوجيه لـ Login عند عدم وجود توكن (index.tsx)
  return (
    <AlertProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="Auth/Login" />
        <Stack.Screen name="Auth/Register" />
      </Stack>
    </AlertProvider>
  );
}