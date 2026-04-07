import React from "react";
import { View, Text, ScrollView, Pressable, Linking } from "react-native";
import { useTheme } from "../store/useTheme"; // الستور حقك الفخم
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

export default function AboutApp() {
  const { language } = useTheme();
  const { t } = useTranslation();

  const features = [
    {
      id: 1,
      icon: "🍳",
      title: t("feature1"),
      description: t("feature1_desc"),
    },
    {
      id: 2,
      icon: "🌐",
      title: t("feature2"),
      description: t("feature2_desc"),
    },
    {
      id: 3,
      icon: "📱",
      title: t("feature3"),
      description: t("feature3_desc"),
    },
    {
      id: 4,
      icon: "💾",
      title: t("feature4"),
      description: t("feature4_desc"),
    },
  ];
  return (
    <ScrollView className="flex-1 bg-white dark:bg-neutral-900 p-6">
      <Stack.Screen options={{ headerShown: false }} />
      <View className="items-center my-8">
        {/* أيقونة التطبيق أو شعار مبرمج (ممكن تحط صورتك هنا) */}
        <View className="w-24 h-24 bg-orange-500 rounded-full items-center justify-center shadow-lg">
          <Text className="text-4xl text-white">🍳</Text>
        </View>
        <Text className="text-2xl font-bold mt-4 text-neutral-800 dark:text-white">
          {t("app name")}
        </Text>
        <Text className="text-neutral-500 dark:text-neutral-400">
          {t("version")}
        </Text>
      </View>

      <View className={language === "ar" ? "items-end" : "items-start"}>
        <Text className="text-lg font-bold text-orange-500 mb-2">
          {t("title")}
        </Text>
        <Text
          className={`text-neutral-600 dark:text-neutral-400 leading-6 mb-6 text-base ${language === "ar" ? "text-right" : "text-left"}`}
        >
          {t("description")}
        </Text>

        {/* الميزات */}
        <View className="mt-8 px-4">
          {/* عنوان القسم */}
          <Text
            className={`text-xl font-bold mb-6 text-orange-500 ${language === "ar" ? "text-right" : "text-left"}`}
          >
            {language === "ar" ? "مميزات التطبيق" : "App Features"}
          </Text>

          {/* شبكة الميزات (Grid-like layout) */}
          <View className="flex-row flex-wrap justify-between">
            {features.map((f) => (
              <View
                key={f.id}
                className="w-full bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-3xl mb-4 border border-neutral-100 dark:border-neutral-700 shadow-sm"
              >
                <Text
                  className={` font-bold text-neutral-800 dark:text-white mb-1 ${language === "ar" ? "text-right" : "text-left"}`}
                >
                  {f.title} <Text className="text-xl mt-2">{f.icon}</Text>
                </Text>
                <Text
                  className={`text-xs text-neutral-400 dark:text-neutral-400 leading-4 ${language === "ar" ? "text-right" : "text-left"}`}
                >
                  {f.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <Text className="text-lg font-bold text-orange-500 mb-4">
          {t("tech")}
        </Text>
        <View className="flex-row flex-wrap gap-2 mb-8 justify-center">
          {[
            "React Native",
            "Expo SDK 55",
            "Zustand",
            "Tailwind CSS",
            "TheMealDB API",
            "Google translate API",
          ].map((item) => (
            <View
              key={item}
              className="bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-700"
            >
              <Text className="text-neutral-700 dark:text-neutral-300 text-xs">
                {item}
              </Text>
            </View>
          ))}
        </View>

        {/* معلومات المطور */}
        <View className="w-full p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20">
          <Text className="text-neutral-800 dark:text-white font-semibold text-center mb-4">
            {t("developer")} 🐧
          </Text>
          <Pressable
            onPress={() =>
              Linking.openURL("https://github.com/dooom77-0?tab=repositories")
            }
            className="bg-orange-500 p-3 rounded-xl items-center shadow-sm"
          >
            <Text className="text-white font-bold">{t("github")}</Text>
          </Pressable>

          <Pressable
            onPress={() => Linking.openURL("mailto:dooomww@gmail.com")}
            className="bg-orange-500 mt-4 p-3 rounded-xl items-center shadow-sm"
          >
            <Text className="text-white dark:text-white font-semibold">
              تواصل عبر Gmail
            </Text>
          </Pressable>
        </View>
      </View>

      <Text className="text-center text-neutral-400 dark:text-neutral-500 my-8 text-md pb-6 italic">
        {t("copyright")}
      </Text>
    </ScrollView>
  );
}
