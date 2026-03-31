import React from "react";
import { View, Text, ScrollView, Switch, Pressable } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useFavorites } from "../../store/useFavoriteStore"; // تأكد من مسار ملف الستور عندك
import { useTheme } from "../../store/useTheme";
import { useTranslation } from "react-i18next";
import i18n from "../../i18next/i18n";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const isRTL = i18n.language === "ar";
  // جلب البيانات من الستور
  const { favorites, clearFavorites } = useFavorites();

  const { isDark, toggleTheme } = useTheme();

  const language = useTheme((state) => state.language);
  const setLanguage = useTheme((state) => state.setLanguage);

  // حساب عدد المفضلة
  const favoritesCount = favorites.length;

  // دالة وهمية للحصول على أكثر تصنيف مكرر (يمكنك تطويرها لاحقاً)
  const getTopCategory = () => {
    if (favoritesCount === 0) return "لا يوجد";
    const categories = favorites.map((m) => m.strCategory).filter(Boolean);
    return (
      categories
        .sort(
          (a, b) =>
            categories.filter((v) => v === a).length -
            categories.filter((v) => v === b).length,
        )
        .pop() || "متنوع"
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="flex-1 bg-background dark:bg-darkBackground"
    >
      {/* 1. الهيدر: البروفايل */}
      <View className="items-center mt-10 mb-8 px-5">
        <View className="w-28 h-28 rounded-full bg-white dark:bg-darkBackground items-center justify-center border-4 border-white dark:border-darkBackground shadow-sm">
          <Feather name="user" size={55} color="#FF8A00" />
        </View>
        <Text className="text-2xl font-bold mt-4 text-text dark:text-darkText text-center">
          {t("skilled cook")}
        </Text>
        <Text className="text-gray-400 dark:text-gray-300 text-center text-base mt-1">
          {t("welcome to your own kitchen")}
        </Text>
      </View>

      {/* 2. قسم الإحصائيات: مربعات الإحصائيات (Stat Cards) */}
      <View className="px-5 mb-8">
        <Text className="text-right text-gray-400 dark:text-gray-300 font-bold mb-4 mr-2">
          {t("stats")}
        </Text>
        <View className="flex-row-reverse gap-4">
          {/* مربع المفضلة - يقرأ من الستور */}
          <View className="flex-1 bg-card dark:bg-darkCard p-5 rounded-[35px] items-center shadow-sm border border-gray-50 dark:border-gray-800">
            <View className="bg-orange-50 dark:bg-orange-900 p-2.5 rounded-2xl mb-2">
              <Ionicons name="heart" size={22} color="#FF8A00" />
            </View>
            <Text className="text-gray-400 dark:text-gray-300 text-xs mb-1">
              {t("favorites")}
            </Text>
            <Text className="text-2xl font-bold text-black dark:text-darkText">
              {favoritesCount}
            </Text>
          </View>

          {/* مربع التصنيف المفضل */}
          <View className="flex-1 bg-white dark:bg-darkCard p-5 rounded-[35px] items-center shadow-sm border border-gray-50 dark:border-gray-800">
            <View className="bg-blue-50 dark:bg-blue-900 p-2.5 rounded-2xl mb-2">
              <Feather name="tag" size={22} color="#3B82F6" />
            </View>
            <Text className="text-gray-400 dark:text-gray-300 text-xs mb-1">
              {t("most saved")}
            </Text>
            <Text
              className="text-lg font-bold text-black dark:text-darkText"
              numberOfLines={1}
            >
              {getTopCategory()}
            </Text>
          </View>
        </View>
      </View>

      {/* 3. قسم التفضيلات */}
      <View className="px-5 mb-8">
        <Text className={` text-gray-400 dark:text-gray-300 font-bold mb-4 mr-2 ${isRTL ? "text-right" : "text-left"}`}>
          {t("preferences")}
        </Text>
        <View className="bg-white dark:bg-darkCard rounded-[35px] p-5 shadow-sm border border-gray-50 dark:border-gray-800">
          <View className={`${isRTL ? "flex-row-reverse" : "flex-row"} items-center justify-between py-3 border-b border-gray-50 dark:border-gray-800`}>
            <View className={`${isRTL ? "flex-row-reverse" : "flex-row"} items-center gap-4`}>
              <View className="bg-orange-50 dark:bg-darkCard p-2.5 rounded-2xl">
                <Feather
                  name={isDark ? "moon" : "sun"}
                  size={22}
                  color="#FF8A00"
                />
              </View>
              <Text className="text-lg font-semibold text-gray-800 dark:text-darkText">
                {t("theme")}
              </Text>
            </View>
            <Switch
              trackColor={{ true: "#FF8A00", false: "#DDD" }}
              thumbColor="white"
              value={isDark}
              onValueChange={toggleTheme}
            />
          </View>

          <View className={`${isRTL ? "flex-row-reverse" : "flex-row"} items-center justify-between py-1`}>
            <View className={`${isRTL ? "flex-row-reverse" : "flex-row"} items-center gap-4`}>
              <View className="bg-blue-50 dark:bg-darkCard p-2.5 rounded-2xl">
                <Feather name="globe" size={22} color="#3B82F6" />
              </View>
              <Text className="text-lg font-semibold text-gray-800 dark:text-darkText">
                {t("language")}
              </Text>
            </View>
            <View className="flex-row gap-4 p-2">
              {/* زر العربية */}
              <Pressable
                onPress={() => {
                  i18n.changeLanguage("ar");
                  setLanguage("ar");
                  console.log("Language set to Arabic");
                }}
                className={` p-4 rounded-2xl border-2 items-center ${
                  language === "ar"
                    ? "border-orange-500 bg-orange-500/10"
                    : "border-neutral-700"
                }`}
              >
                <Text
                  className={`text-xl font-bold ${language === "ar" ? "text-orange-500" : "text-neutral-400"}`}
                >
                  ع
                </Text>
              </Pressable>

              {/* زر الإنجليزية */}
              <Pressable
                onPress={() => {
                  i18n.changeLanguage("en");
                  setLanguage("en");
                  console.log("Language set to English");
                }}
                className={` p-4 rounded-2xl border-2 items-center ${
                  language === "en"
                    ? "border-orange-500 bg-orange-500/10"
                    : "border-neutral-700"
                }`}
              >
                <Text
                  className={`text-xl font-bold ${language === "en" ? "text-orange-500" : "text-neutral-400"}`}
                >
                  E
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      {/* 4. قسم المزيد */}
      <View className="px-5 mb-10">
        <Text className="text-right text-gray-400 font-bold mb-4 mr-2 dark:text-gray-300">
          {t("more")}
        </Text>
        <View className="bg-white dark:bg-darkCard rounded-[35px] p-5 shadow-sm border border-gray-50 dark:border-gray-800">
          <Pressable className="flex-row-reverse items-center justify-between py-3 border-b border-gray-50 dark:border-gray-800">
            <View className="flex-row-reverse items-center gap-4">
              <View className="bg-blue-50 dark:bg-darkCard p-2.5 rounded-2xl">
                <Feather name="star" size={22} color="#3B82F6" />
              </View>
              <Text className="text-lg font-semibold text-gray-800 dark:text-darkText">
                {t("rate us")}
              </Text>
            </View>
            <Feather name="chevron-left" size={20} color="#CCC" />
          </Pressable>

          <Pressable
            onPress={clearFavorites}
            className="flex-row-reverse items-center justify-between py-3"
          >
            <View className="flex-row-reverse items-center gap-4">
              <View className="bg-red-50 dark:bg-darkCard p-2.5 rounded-2xl">
                <Feather name="trash-2" size={22} color="#EF4444" />
              </View>
              <Text className="text-lg font-semibold text-red-500">
                {t("delete all favorites")}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>

      <Text className="text-center text-gray-300 font-medium mb-10">
        {t("version")}
      </Text>
    </ScrollView>
  );
}
