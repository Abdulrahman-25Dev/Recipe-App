import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Text,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {useTranslation} from "react-i18next";
import i18n from "@/i18next/i18n";

interface Category {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
  mealCount?: number;
}

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const windowWidth = Dimensions.get("window").width;
  const cardWidth = (windowWidth - 24) / 2;

  const { t } = useTranslation();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/categories.php",
      );
      const data = await response.json();
      const filtered = data.categories.filter(
        (cat: Category) => cat.strCategory !== "Pork",
      );

      // Fetch meal counts in parallel for all categories
      const categoriesWithCounts = await Promise.all(
        filtered.map(async (cat: Category) => {
          try {
            const mealResponse = await fetch(
              `https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat.strCategory}`,
            );
            const mealData = await mealResponse.json();
            return {
              ...cat,
              mealCount: mealData.meals ? mealData.meals.length : 0,
            };
          } catch (error) {
            console.error(
              `Error fetching meals for ${cat.strCategory}:`,
              error,
            );
            return { ...cat, mealCount: 0 };
          }
        }),
      );

      setCategories(categoriesWithCounts);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const isRTL = i18n.language === "ar";

  // const getRandomHeight = () => {
  //   return Math.random() * (220 - 140) + 140;
  // };

  const CategoryCard = ({ item }: { item: Category }) => {
    // const cardHeight = getRandomHeight();

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => router.push(`/categories/${item.strCategory}`)}
        className="flex-1 m-1.5"
      >
        <ImageBackground
          source={{ uri: item.strCategoryThumb }}
          className="rounded-2xl overflow-hidden flex-1"
          style={{ height: 170 }}
          imageStyle={{ resizeMode: "cover" }}
        >
          {/* Icon on top-left */}
          <View className="absolute top-3 left-3 z-10">
            <View className="bg-black rounded-full w-9 h-9 items-center justify-center shadow-lg">
              <Ionicons name="restaurant" size={20} color="#FF8A00" />
            </View>
          </View>

          {/* Dark gradient overlay on the bottom */}
          <LinearGradient
            colors={["transparent", "rgba(0, 0, 0, 0.8)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            className="flex-1 justify-end p-4"
          >
            {/* Category name */}
            <Text className="text-white font-bold text-lg mb-1 leading-5">
              {item.strCategory}
            </Text>
            {/* Recipe count subtitle */}
            <Text className="text-gray-200 text-xs font-medium">
              {item.mealCount} Recipes
            </Text>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-background dark:bg-darkBackground">
      <Stack.Screen options={{ headerShown: false }} />
      

      {/* Header */}
      <View className={`${isRTL ? "flex-row" : "flex-row-reverse"} items-center mt-10 justify-between px-4 py-4 bg-background dark:bg-darkBackground`}>
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 active:bg-gray-100 rounded-full bg-black"
        >
          <Ionicons name={isRTL ? "arrow-back" : "arrow-forward"} size={24} color="#FF8A00" />
        </TouchableOpacity>
        <Text className={`${isRTL ? "text-right" : "text-left"} text-2xl font-bold flex-1 ml-3 text-primary dark:text-darkPrimary`}>
          {t("categories")}
        </Text>
      </View>

      {/* Content */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#ea580c" />
          <Text className="text-text mt-4 text-md">
            جاري تحميل التصنيفات...
          </Text>
        </View>
      ) : (
        <FlatList
          data={categories}
          renderItem={({ item }) => <CategoryCard item={item} />}
          keyExtractor={(item) => item.idCategory}
          numColumns={2}
          columnWrapperStyle={{ paddingHorizontal: 6, paddingBottom: 4 }}
          contentContainerStyle={{ paddingVertical: 8 }}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
