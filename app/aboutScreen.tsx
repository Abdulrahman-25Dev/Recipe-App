import React from "react";
import { View, Text, ScrollView, Pressable, Linking, Image } from "react-native";
import { useTheme } from "../store/useTheme"; // الستور حقك الفخم
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  Database,
  Languages,
  Smartphone,
  Bookmark,
  Github,
  Mail,
  
} from "lucide-react-native";
export default function AboutApp() {
  const { language } = useTheme();
  const { t } = useTranslation();

  const features = [
    {
      id: 1,
      icon: Database,
      title: t("feature1"),
      description: t("feature1_desc"),
    },
    {
      id: 2,
      icon: Languages,
      title: t("feature2"),
      description: t("feature2_desc"),
    },
    {
      id: 3,
      icon: Smartphone,
      title: t("feature3"),
      description: t("feature3_desc"),
    },
    {
      id: 4,
      icon: Bookmark,
      title: t("feature4"),
      description: t("feature4_desc"),
    },
  ];
  return (
    <ScrollView className="flex-1 bg-white dark:bg-darkBackground p-6">
      <Stack.Screen options={{ headerShown: false }} />
      <View className="items-center my-8">
        {/* أيقونة التطبيق أو شعار مبرمج (ممكن تحط صورتك هنا) */}
        <Image
          source={require("../assets/images/AboutIcon.png")}
          className="w-28 h-28 rounded-full"
          resizeMode="contain"
        />
        
        <Text className="text-2xl font-bold mt-4 text-neutral-800 dark:text-white">
          {t("appName")}
        </Text>
        <Text className="text-neutral-500 dark:text-neutral-400">
          {t("version")}
        </Text>
      </View>

      <View className={language === "ar" ? "items-end" : "items-start"}>
        <Text className="text-lg font-bold text-[#FD802E] mb-2">
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
            className={`text-xl font-bold mb-6 text-[#FD802E] ${language === "ar" ? "text-right" : "text-left"}`}
          >
            {language === "ar" ? "مميزات التطبيق" : "App Features"}
          </Text>

          {/* شبكة الميزات (Grid-like layout) */}
          <View className="flex-row flex-wrap justify-between">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <View
                  key={f.id}
                  className="w-full bg-neutral-50 dark:bg-darkCard p-4 rounded-3xl mb-4 border border-neutral-100 dark:border-neutral-700 shadow-sm"
                >
                  <View className="flex-row items-start gap-3">
                    <View className="w-11 h-11 rounded-2xl bg-[#FD802E]/10 items-center justify-center">
                      <Icon size={20} color="#FD802E" strokeWidth={1.8} />
                    </View>
                    <View className="flex-1">
                      <Text
                        className={`font-bold text-neutral-800 dark:text-white mb-1 ${language === "ar" ? "text-right" : "text-left"}`}
                      >
                        {f.title}
                      </Text>

                      <Text
                        className={`text-xs text-neutral-400 dark:text-neutral-400 leading-4 ${language === "ar" ? "text-right" : "text-left"}`}
                      >
                        {f.description}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <Text className="text-lg font-bold text-[#FD802E] mb-4">
          {t("tech")}
        </Text>
        <View className="flex-row flex-wrap gap-2 mb-8 justify-center">
          {[
            "React Native",
            "Expo SDK 55",
            "Zustand",
            "Tailwind CSS",
            "TheMealDB API / MongoDB",
            "DeepL translate API",
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
        <View className="w-full p-4 bg-[#FD802E]/10 rounded-2xl border border-[#FD802E]/20">
          <Text className="text-neutral-800 dark:text-white font-semibold text-center mb-4">
            {t("developer")} 🐧
          </Text>
          <Pressable
            onPress={() =>
              Linking.openURL(
                "https://github.com/Abdulrahman-25Dev?tab=repositories",
              )
            }
            className="bg-[#FD802E] p-3 rounded-xl flex-row items-center justify-center shadow-sm"
          >
            <Github size={18} color="#fff" strokeWidth={1.8} />
            <Text className="text-white font-bold ml-2">{t("github")}</Text>
          </Pressable>

          <Pressable
            onPress={() =>
              Linking.openURL("mailto:abdulrahman.dev25@gmail.com")
            }
            className="bg-[#FD802E] mt-4 p-3 rounded-xl flex-row items-center justify-center shadow-sm"
          >
            <Mail size={18} color="#fff" strokeWidth={1.8} />
            <Text className="text-white dark:text-white font-semibold ml-2">
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
