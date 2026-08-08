import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import { router } from "expo-router";
import { useFavorites, Meal } from "../../store/useFavoriteStore";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import i18n from "../../i18next/i18n";
import { Heart, Search } from "lucide-react-native";

const getMealId = (item: Meal): string =>
  String(item._id || item.idMeal || item.externalId || "");

const Favorites = () => {
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const { favorites, toggleFavorite } = useFavorites((state) => state);

  return (
    <View className="flex-1 bg-background dark:bg-darkBackground px-4 pt-12">
      {/* 1. الهيدر مع عدد الوصفات المحفوظة */}
      <View className="flex-row items-center justify-between my-4 px-1">
        <View className="flex-row items-center gap-2">
          <View className="p-2.5 rounded-2xl bg-orange-500/10 dark:bg-orange-500/20">
            <Heart size={22} color="#F97316" fill="#F97316" />
          </View>
          <Text className="text-2xl font-extrabold text-neutral-900 dark:text-white">
            {t("favorites recipes")}
          </Text>
        </View>

        {favorites.length > 0 && (
          <View className="bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-700">
            <Text className="text-xs font-bold text-orange-500">
              {favorites.length} {isArabic ? "وصفات" : "recipes"}
            </Text>
          </View>
        )}
      </View>

      {/* 2. الشاشة الفارغة في حال عدم وجود مفضلة */}
      {favorites.length === 0 ? (
        <View className="flex-1 items-center justify-center -mt-10 px-6">
          <View className="w-24 h-24 rounded-full bg-orange-500/10 dark:bg-orange-500/20 items-center justify-center mb-5">
            <Heart size={44} color="#F97316" />
          </View>
          <Text className="text-xl font-bold text-neutral-800 dark:text-white text-center mb-2">
            {isArabic ? "لا توجد وصفات مفضلة بعد" : "No favorite recipes yet"}
          </Text>
          <Text className="text-sm text-neutral-400 dark:text-neutral-500 text-center mb-6 leading-6">
            {isArabic
              ? "احفظ الوصفات التي تعجبك بالضغط على أيقونة القلب لتتمكن من الرجوع إليها بسهولة في أي وقت."
              : "Save recipes you love by tapping the heart icon to easily access them anytime."}
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("/search")}
            className="flex-row items-center bg-orange-500 px-6 py-3.5 rounded-full gap-2 shadow-lg shadow-orange-500/30"
          >
            <Search size={18} color="#FFFFFF" />
            <Text className="text-white font-bold text-base">
              {isArabic ? "استكشف الوصفات" : "Explore Recipes"}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* 3. شبكة عرض الوصفات */
        <View className="flex-1">
          <FlashList
            data={favorites}
            numColumns={2}
            contentContainerStyle={{ paddingVertical: 10, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => getMealId(item)}
            renderItem={({ item }) => {
              const id = getMealId(item);
              const title = item.titleAr || item.title || item.strMeal;
              const image = item.image || item.strMealThumb;
              const category = isArabic
                ? item.categoryAr || item.category || item.strCategory
                : item.category || item.strCategory;

              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => router.push(`/details/${id}`)}
                  className="flex-1 m-1.5"
                >
                  <View className="rounded-3xl overflow-hidden bg-neutral-800 h-56 relative shadow-md shadow-black/20 border border-neutral-100/10">
                    <ImageBackground
                      source={{ uri: image }}
                      className="w-full h-full justify-between p-3"
                      resizeMode="cover"
                    >
                      {/* زر الحذف من المفضلة */}
                      <View className="flex-row justify-end">
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={(e) => {
                            e.stopPropagation();
                            toggleFavorite(item);
                          }}
                          className="bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/20"
                        >
                          <Heart size={16} color="#EF4444" fill="#EF4444" />
                        </TouchableOpacity>
                      </View>

                      {/* التدرج السفلي والمعلومات */}
                      <LinearGradient
                        colors={["transparent", "rgba(0, 0, 0, 0.88)"]}
                        className="absolute bottom-0 left-0 right-0 p-3 pt-8"
                      >
                        <Text
                          numberOfLines={2}
                          className="text-white font-bold text-sm leading-5 mb-1.5"
                        >
                          {title}
                        </Text>

                        {category && (
                          <View className="bg-orange-500/90 self-start px-2.5 py-0.5 rounded-full">
                            <Text className="text-white font-bold text-[10px] tracking-wide">
                              {category}
                            </Text>
                          </View>
                        )}
                      </LinearGradient>
                    </ImageBackground>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}
    </View>
  );
};

export default Favorites;