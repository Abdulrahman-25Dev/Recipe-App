import React, { useState } from "react";
import { View, Text, ScrollView, Switch, Pressable, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logoutUser, deleteAccountRemote } from "../../src/api/authService";
import { useFavorites } from "../../store/useFavoriteStore"; // تأكد من مسار ملف الستور عندك
import { useTheme } from "../../store/useTheme";
import { useTranslation } from "react-i18next";
import i18n from "../../i18next/i18n";
import { router, useFocusEffect } from "expo-router";
import { useAlert } from "../../components/CustomAlert";
import {
  Heart,
  Tag,
  Moon,
  Sun,
  Languages,
  AlertCircle,
  Trash,
  User2,
  LogOut,
  CircleUserRound,
  Lock,
} from "lucide-react-native";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const isRTL = i18n.language === "ar";
  // جلب البيانات من الستور
  const { favorites, clearFavorites } = useFavorites();

  const { isDark, toggleTheme } = useTheme();

  const language = useTheme((state) => state.language);
  const setLanguage = useTheme((state) => state.setLanguage);

  const { alert } = useAlert();

  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [bio, setBio] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem("userData")
        .then((data) => {
          if (data) {
            const user = JSON.parse(data);
            setUsername(user.name || "");
            setProfileImage(user.profileImage || null);
            setBio(user.bio || "");
          }
        })
        .catch(() => {});
    }, []),
  );

  const confirmDeleteFavorites = () => {
    alert(t("confirm delete"), t("delete confirmation message"), [
      { text: t("cancel"), style: "cancel" },
      { text: t("delete"), style: "destructive", onPress: clearFavorites },
    ]);
  };

  const handleLogout = async () => {
    await logoutUser();
    useFavorites.getState().setFavorites([]);
    router.replace("/Auth/Login");
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccountRemote();
      await logoutUser();
      useFavorites.getState().setFavorites([]);
      router.replace("/Auth/Login");
    } catch (error: any) {
      alert(t("error"), error.message || "");
    }
  };

  const confirmDeleteAccount = () => {
    // 1. تحذير أول: شرح العواقب
    alert(t("delete account"), t("delete account warning"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: () => {
          // 2. تأكيد نهائي قبل الحذف الفعلي
          alert(t("delete account"), t("delete account confirm"), [
            { text: t("cancel"), style: "cancel" },
            {
              text: t("delete"),
              style: "destructive",
              onPress: handleDeleteAccount,
            },
          ]);
        },
      },
    ]);
  };

  // حساب عدد المفضلة
  const favoritesCount = favorites.length;

  // دالة الحصول على أكثر تصنيف مكرر (بحسب اللغة الحالية)
  const getTopCategory = () => {
    if (favoritesCount === 0) return "-";
    const categories = favorites
      .map((m) =>
        isRTL
          ? m.categoryAr || m.category || m.strCategory
          : m.category || m.categoryAr || m.strCategory,
      )
      .filter(Boolean);
    return (
      categories
        .sort(
          (a, b) =>
            categories.filter((v) => v === a).length -
            categories.filter((v) => v === b).length,
        )
        .pop() || (isRTL ? "متنوع" : "Miscellaneous")
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="flex-1 bg-background dark:bg-darkBackground"
    >
      {/* 1. الهيدر: البروفايل */}
      <View className="items-center mt-10 mb-8 px-5">
        <View className="w-28 h-28 rounded-full bg-white dark:bg-darkBackground items-center justify-center border-4 border-white dark:border-darkBackground shadow-sm overflow-hidden">
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              className="w-full h-full"
              resizeMode="cover"
              onError={() => setProfileImage(null)}
            />
          ) : (
            <User2 size={55} color="#FD802E" />
          )}
        </View>
        <Text className="text-2xl font-bold mt-4 text-text dark:text-darkText text-center">
          {username || t("skilled cook")}
        </Text>
        <Text className="text-gray-400 dark:text-gray-300 text-center text-base mt-1">
          {bio || t("welcome to your own kitchen")}
        </Text>
      </View>

      {/* 2. قسم الإحصائيات: مربعات الإحصائيات (Stat Cards) */}
      <View className="px-5 mb-8">
        <Text className="text-right text-gray-400 dark:text-gray-300 font-bold mb-4 mr-2">
          {t("stats")}
        </Text>
        <View className="flex-row-reverse gap-4">
          {/* مربع المفضلة - يقرأ من الستور */}
          <View className="flex-1 bg-card dark:bg-darkCard p-5 rounded-[35px] items-center shadow-sm border border-gray-50 dark:border-darkCard">
            <View className="bg-[#FD802E]/10 dark:bg-[#FD802E]/20 p-2.5 rounded-2xl mb-2">
              <Heart size={22} color="#FD802E" />
            </View>
            <Text className="text-gray-400 dark:text-gray-300 text-xs mb-1">
              {t("favorites")}
            </Text>
            <Text className="text-2xl font-bold text-black dark:text-darkText">
              {favoritesCount}
            </Text>
          </View>

          {/* مربع التصنيف المفضل */}
          <View className="flex-1 bg-white dark:bg-darkCard p-5 rounded-[35px] items-center shadow-sm border border-gray-50 dark:border-darkCard">
            <View className="bg-blue-50 dark:bg-blue-900 p-2.5 rounded-2xl mb-2">
              <Tag size={22} color="#3B82F6" />
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
        <Text
          className={` text-gray-400 dark:text-gray-300 font-bold mb-4 mr-2 ${isRTL ? "text-right" : "text-left"}`}
        >
          {t("preferences")}
        </Text>
        <View className="bg-white dark:bg-darkCard rounded-[35px] p-5 shadow-sm border border-gray-50 dark:border-darkCard">
          <View
            className={`${isRTL ? "flex-row-reverse" : "flex-row"} items-center justify-between py-3 border-b border-gray-50 dark:border-darkCard`}
          >
            <View
              className={`${isRTL ? "flex-row-reverse" : "flex-row"} items-center gap-4`}
            >
              <View className="bg-[#FD802E]/10 dark:bg-darkCard p-2.5 rounded-2xl">
                {isDark ? (
                  <Moon size={22} color="#FD802E" />
                ) : (
                  <Sun size={22} color="#FD802E" />
                )}
              </View>
              <Text className="text-lg font-semibold text-gray-800 dark:text-darkText">
                {t("theme")}
              </Text>
            </View>
            <Switch
              trackColor={{ true: "#FD802E", false: "#DDD" }}
              thumbColor="white"
              value={isDark}
              onValueChange={toggleTheme}
            />
          </View>

          <View
            className={`${isRTL ? "flex-row-reverse" : "flex-row"} items-center justify-between py-1`}
          >
            <View
              className={`${isRTL ? "flex-row-reverse" : "flex-row"} items-center gap-4`}
            >
              <View className="bg-blue-50 dark:bg-darkCard p-2.5 rounded-2xl">
                <Languages size={22} color="#3B82F6" />
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
                }}
                className={` p-4 rounded-2xl border-2 items-center ${
                  language === "ar"
                    ? "border-[#FD802E] bg-[#FD802E]/10"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                <Text
                  className={`text-xl font-bold ${language === "ar" ? "text-[#FD802E]" : "text-neutral-400"}`}
                >
                  ع
                </Text>
              </Pressable>

              {/* زر الإنجليزية */}
              <Pressable
                onPress={() => {
                  i18n.changeLanguage("en");
                  setLanguage("en");
                }}
                className={` p-4 rounded-2xl border-2 items-center ${
                  language === "en"
                    ? "border-[#FD802E] bg-[#FD802E]/10"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                <Text
                  className={`text-xl font-bold ${language === "en" ? "text-[#FD802E]" : "text-neutral-400"}`}
                >
                  E
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      {/* 4. قسم الحساب */}
      <View className="px-5 mb-8">
        <Text
          className={`text-gray-400 dark:text-gray-300 font-bold mb-4 mr-2 ${isRTL ? "text-right" : "text-left"}`}
        >
          {t("account")}
        </Text>
        <View className="bg-white dark:bg-darkCard rounded-[35px] p-5 shadow-sm border border-gray-50 dark:border-darkCard">
          <Pressable
            onPress={() => router.push("/account/EditProfile")}
            className={` items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
          >
            <View
              className={`items-center gap-4 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
            >
              <View className="bg-[#FD802E]/10 dark:bg-darkCard p-2.5 rounded-2xl">
                <CircleUserRound size={22} color="#FD802E" />
              </View>
              <Text className="text-lg font-semibold text-gray-800 dark:text-darkText">
                {t("edit profile")}
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => router.push("/account/ChangePassword" as never)}
            className={` items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
          >
            <View
              className={`items-center gap-4 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
            >
              <View className="bg-blue-50 dark:bg-darkCard p-2.5 rounded-2xl">
                <Lock size={22} color="#3B82F6" />
              </View>
              <Text className="text-lg font-semibold text-gray-800 dark:text-darkText">
                {t("change password")}
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={confirmDeleteAccount}
            className={` items-center justify-between py-3  border-b border-gray-100 dark:border-gray-800 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
          >
            <View
              className={`items-center gap-4 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
            >
              <View className="bg-red-50 dark:bg-darkCard p-2.5 rounded-2xl">
                <Trash size={22} color="#EF4444" />
              </View>
              <Text className="text-lg font-semibold text-red-500">
                {t("delete account")}
              </Text>
            </View>
          </Pressable>
          <Pressable
            onPress={handleLogout}
            className={` items-center justify-between py-3 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
          >
            <View
              className={`items-center gap-4 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
            >
              <View className="bg-red-50 dark:bg-darkCard p-2.5 rounded-2xl">
                <LogOut size={22} color="#EF4444" />
              </View>
              <Text className="text-lg font-semibold text-red-500">
                {t("logout")}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>

      {/* 5. قسم المزيد */}
      <View className="px-5 mb-10">
        <Text
          className={`text-gray-400 px-2 font-bold mb-4 mr-2 dark:text-gray-300 ${isRTL ? "text-right" : "text-left"}`}
        >
          {t("more")}
        </Text>
        <View className="bg-white dark:bg-darkCard rounded-[35px] p-5 shadow-sm border border-gray-50 dark:border-darkCard">
          <Pressable
            onPress={() => router.push("../aboutScreen")}
            className={` items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
          >
            <View
              className={`items-center gap-4 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
            >
              <View className="bg-blue-50 dark:bg-darkCard p-2.5 rounded-2xl">
                <AlertCircle size={22} color="#3B82F6" />
              </View>
              <Text className="text-lg font-semibold text-gray-800 dark:text-darkText">
                {t("title")}
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={confirmDeleteFavorites}
            className={` items-center justify-between py-3 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
          >
            <View
              className={`items-center gap-4 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
            >
              <View className="bg-red-50 dark:bg-darkCard p-2.5 rounded-2xl">
                <Trash size={22} color="#EF4444" />
              </View>
              <Text className="text-lg font-semibold text-red-500">
                {t("delete all favorites")}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>

      <Text className="text-center text-gray-300 dark:text-gray-400 font-medium mb-10">
        {t("version")}
      </Text>
    </ScrollView>
  );
}
