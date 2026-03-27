import React from "react";
import { View, Text, ScrollView, Switch, Pressable } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useFavorites } from "../../store/useFavoriteStore"; // تأكد من مسار ملف الستور عندك
import { useTheme } from "../../store/useTheme";

export default function SettingsScreen() {
  // جلب البيانات من الستور
  const { favorites } = useFavorites();

  const { isDark, toggleTheme, language, setLanguage } = useTheme();

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
          طباخ ماهر
        </Text>
        <Text className="text-gray-400 dark:text-gray-300 text-center text-base mt-1">
          مرحباً بك في مطبخك الخاص
        </Text>
      </View>

      {/* 2. قسم الإحصائيات: مربعات الإحصائيات (Stat Cards) */}
      <View className="px-5 mb-8">
        <Text className="text-right text-gray-400 dark:text-gray-300 font-bold mb-4 mr-2">
          الإحصائيات
        </Text>
        <View className="flex-row-reverse gap-4">
          {/* مربع المفضلة - يقرأ من الستور */}
          <View className="flex-1 bg-card dark:bg-darkCard p-5 rounded-[35px] items-center shadow-sm border border-gray-50 dark:border-gray-800">
            <View className="bg-orange-50 dark:bg-orange-900 p-2.5 rounded-2xl mb-2">
              <Ionicons name="heart" size={22} color="#FF8A00" />
            </View>
            <Text className="text-gray-400 dark:text-gray-300 text-xs mb-1">المفضلة</Text>
            <Text className="text-2xl font-bold text-black dark:text-darkText">
              {favoritesCount}
            </Text>
          </View>

          {/* مربع التصنيف المفضل */}
          <View className="flex-1 bg-white dark:bg-darkCard p-5 rounded-[35px] items-center shadow-sm border border-gray-50 dark:border-gray-800">
            <View className="bg-blue-50 dark:bg-blue-900 p-2.5 rounded-2xl mb-2">
              <Feather name="tag" size={22} color="#3B82F6" />
            </View>
            <Text className="text-gray-400 dark:text-gray-300 text-xs mb-1">الأكثر حفظاً</Text>
            <Text className="text-lg font-bold text-black dark:text-darkText" numberOfLines={1}>
              {getTopCategory()}
            </Text>
          </View>
        </View>
      </View>

      {/* 3. قسم التفضيلات */}
      <View className="px-5 mb-8">
        <Text className="text-right text-gray-400 dark:text-gray-300 font-bold mb-4 mr-2">
          التفضيلات
        </Text>
        <View className="bg-white dark:bg-darkCard rounded-[35px] p-5 shadow-sm border border-gray-50 dark:border-gray-800">
          <View className="flex-row-reverse items-center justify-between py-3 border-b border-gray-50 dark:border-gray-800">
            <View className="flex-row-reverse items-center gap-4">
              <View className="bg-orange-50 dark:bg-darkCard p-2.5 rounded-2xl">
                <Feather name="moon" size={22} color="#FF8A00" />
              </View>
              <Text className="text-lg font-semibold text-gray-800 dark:text-darkText">
                الوضع الليلي
              </Text>
            </View>
            <Switch
              trackColor={{ true: "#FF8A00", false: "#DDD" }}
              thumbColor="white"
              value={isDark}
              onValueChange={toggleTheme}
            />
          </View>

          <View className="flex-row-reverse items-center justify-between py-3">
            <View className="flex-row-reverse items-center gap-4">
              <View className="bg-blue-50 dark:bg-darkCard p-2.5 rounded-2xl">
                <Feather name="globe" size={22} color="#3B82F6" />
              </View>
              <Text className="text-lg font-semibold text-gray-800 dark:text-darkText">اللغة</Text>
            </View>
            <View className="flex-row gap-4">
              <Pressable className=" border border-primary dark:border-darkPrimary p-2 rounded-lg">
                <Text className="text-lg font-semibold dark:text-darkText">ع</Text>
              </Pressable>
              <Pressable className=" border border-primary dark:border-darkPrimary p-2 rounded-lg">
                <Text className="text-lg font-semibold dark:text-darkText">En</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      {/* 4. قسم المزيد */}
      <View className="px-5 mb-10">
        <Text className="text-right text-gray-400 font-bold mb-4 mr-2 dark:text-gray-300">
          المزيد
        </Text>
        <View className="bg-white dark:bg-darkCard rounded-[35px] p-5 shadow-sm border border-gray-50 dark:border-gray-800">
          <Pressable className="flex-row-reverse items-center justify-between py-3 border-b border-gray-50 dark:border-gray-800">
            <View className="flex-row-reverse items-center gap-4">
              <View className="bg-blue-50 dark:bg-darkCard p-2.5 rounded-2xl">
                <Feather name="star" size={22} color="#3B82F6" />
              </View>
              <Text className="text-lg font-semibold text-gray-800 dark:text-darkText">
                تقييم التطبيق
              </Text>
            </View>
            <Feather name="chevron-left" size={20} color="#CCC" />
          </Pressable>

          <Pressable className="flex-row-reverse items-center justify-between py-3">
            <View className="flex-row-reverse items-center gap-4">
              <View className="bg-red-50 dark:bg-darkCard p-2.5 rounded-2xl">
                <Feather name="trash-2" size={22} color="#EF4444" />
              </View>
              <Text className="text-lg font-semibold text-red-500">
                مسح كل المفضلة
              </Text>
            </View>
          </Pressable>
        </View>
      </View>

      <Text className="text-center text-gray-300 font-medium mb-10">
        إصدار 1.0.0
      </Text>
    </ScrollView>
  );
}
