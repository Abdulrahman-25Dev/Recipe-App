import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  ImageBackground,
  Text,
  ActivityIndicator,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import i18n from "@/i18next/i18n";
import { apiClient } from "@/src/api/client";

const DEFAULT_MEAL_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80";

export default function CategoryMealsScreen() {
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryAr, setCategoryAr] = useState("");
  const router = useRouter();
  const params = useLocalSearchParams();
  const categoryName = params.catId as string;
  const isRTL = i18n.language === "ar";

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        setLoading(true);
        // الطلب من الباك إند عبر المسار المخصص للوجبات حسب التصنيف
        const response = await apiClient.get(
          `/recipes/category/${encodeURIComponent(categoryName)}`,
        );

        const data =
          response.data?.data || response.data?.recipes || response.data || [];

        setMeals(Array.isArray(data) ? data : []);

        const first = Array.isArray(data) ? data[0] : null;
        setCategoryAr(first?.categoryAr || first?.strCategory || "");
      } catch (error) {
        console.error("Error fetching category meals:", error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryName) {
      fetchMeals();
    }
  }, [categoryName]);

  const MealCard = ({ item }: { item: any }) => {
    const [imgError, setImgError] = useState(false);

    // استخراج اسم الوجبة بناءً على اللغة المحددة
    const mealTitle = isRTL
      ? item.titleAr || item.title || item.strMeal
      : item.title || item.strMeal || item.titleAr;

    // استخراج رابط الصورة مع التأكد من وجوده
    const rawImage =
      item.image || item.imageUrl || item.thumbUrl || item.strMealThumb;

    const imageUrl =
      !imgError &&
      rawImage &&
      typeof rawImage === "string" &&
      rawImage.trim() !== ""
        ? rawImage
        : DEFAULT_MEAL_IMAGE;

    const mealId = item._id || item.idMeal || item.id;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() =>
          router.push({
            pathname: "/details/[mealId]",
            params: { mealId: String(mealId) },
          })
        }
        className="m-1.5 flex-1"
        style={{ minHeight: 180 }}
      >
        <ImageBackground
          source={{ uri: imageUrl }}
          className="rounded-2xl overflow-hidden bg-gray-800"
          style={{ height: 180 }}
          imageStyle={{ resizeMode: "cover" }}
          onError={() => setImgError(true)}
        >
          <LinearGradient
            colors={["transparent", "rgba(0, 0, 0, 0.85)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            className="flex-1 justify-end p-4"
          >
            <Text
              numberOfLines={2}
              className={`text-white font-bold text-base leading-5 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {mealTitle}
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
      <View
        className={`${
          isRTL ? "flex-row" : "flex-row-reverse"
        } items-center justify-between px-4 py-4 bg-background dark:bg-darkBackground mt-10`}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 rounded-full bg-black"
        >
          <Ionicons
            name={isRTL ? "arrow-back" : "arrow-forward"}
            size={24}
            color="#FF8A00"
          />
        </TouchableOpacity>
        <Text
          className={`text-2xl font-bold flex-1 mx-3 truncate text-center text-primary dark:text-darkPrimary`}
        >
          {isRTL ? `${categoryAr || categoryName}` : `${categoryName}`}
        </Text>
      </View>

      {/* Content */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FF8A00" />
          <Text className="text-text dark:text-darkText mt-3 font-semibold">
            {isRTL ? "جاري تحميل الوصفات..." : "Loading recipes..."}
          </Text>
        </View>
      ) : meals.length > 0 ? (
        <FlashList
          data={meals}
          renderItem={({ item }) => <MealCard item={item} />}
          keyExtractor={(item, index) =>
            item._id || item.idMeal || String(index)
          }
          numColumns={2}
          contentContainerStyle={{ paddingVertical: 8 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500 dark:text-gray-300 text-lg font-semibold">
            {isRTL ? "لا توجد وجبات في هذا التصنيف" : "No meals found"}
          </Text>
        </View>
      )}
    </View>
  );
}
