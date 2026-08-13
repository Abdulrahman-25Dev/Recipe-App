import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  ImageBackground,
  Text,
  ActivityIndicator,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ChefHat } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import i18n from "@/i18next/i18n";
import { apiClient } from "@/src/api/client";

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { t } = useTranslation();
  const isRTL = i18n.language === "ar";

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      // استخدام المسار الصحيح المربوط بـ recipe.routes
      const response = await apiClient.get("/recipes/categories");

      const data =
        response.data?.data || response.data?.categories || response.data || [];

      const filtered = Array.isArray(data)
        ? data.filter((cat: any) => {
            const name = cat.name || cat.strCategory || cat.title || "";
            return name.toLowerCase() !== "pork";
          })
        : [];

      setCategories(filtered);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const DEFAULT_CATEGORY_IMAGE =
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&q=80";

  const CategoryCard = ({ item }: { item: any }) => {
    const [imgError, setImgError] = useState(false);

    const categoryName = isRTL
      ? item.nameAr || item.categoryAr || item.name || item.strCategory
      : item.name || item.strCategory || item.nameAr;

    // فحص كافة الحقول المحتملة لرابط الصورة من MongoDB أو API
    const rawImage =
      item.image || item.imageUrl || item.strCategoryThumb || item.thumbUrl;

    const categoryImage =
      !imgError &&
      rawImage &&
      typeof rawImage === "string" &&
      rawImage.trim() !== ""
        ? rawImage
        : DEFAULT_CATEGORY_IMAGE;

    const count = item.mealCount ?? item.recipesCount ?? 0;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() =>
          router.push({
            pathname: "/categories/[catId]",
            params: { catId: item.name || item.strCategory },
          })
        }
        className="flex-1 m-1.5"
      >
        <ImageBackground
          source={{ uri: categoryImage }}
          className="rounded-2xl overflow-hidden flex-1 bg-gray-800"
          style={{ height: 170 }}
          imageStyle={{ resizeMode: "cover" }}
          onError={() => setImgError(true)}
        >
          {/* Icon on top-left */}
          <View className="absolute top-3 left-3 z-10">
            <View className="bg-black/70 rounded-full w-9 h-9 items-center justify-center shadow-lg">
              <ChefHat size={20} color="#FD802E" />
            </View>
          </View>

          {/* Dark gradient overlay */}
          <LinearGradient
            colors={["transparent", "rgba(0, 0, 0, 0.85)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            className="flex-1 justify-end p-4"
          >
            <Text className="text-white font-bold text-lg mb-1 leading-5">
              {categoryName}
            </Text>

            {count > 0 && (
              <Text className="text-gray-300 text-xs font-medium">
                {count}{" "}
                {isRTL
                  ? count < 10
                    ? "وصفات"
                    : "وصفة"
                  : count === 1
                    ? "Recipe"
                    : "Recipes"}
              </Text>
            )}
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-background dark:bg-darkBackground">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="items-center justify-center mt-10 px-4 py-4 bg-background dark:bg-darkBackground">
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute left-4 p-2 rounded-full bg-black"
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#FD802E"
          />
        </TouchableOpacity>
        <Text className="text-2xl font-bold truncate text-center text-primary dark:text-darkPrimary">
          {t("categories")}
        </Text>
      </View>

      {/* Content */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FD802E" />
          <Text className="text-text mt-4 text-md">
            جاري تحميل التصنيفات...
          </Text>
        </View>
      ) : (
        <FlashList
          data={categories}
          renderItem={({ item }) => <CategoryCard item={item} />}
          keyExtractor={(item, index) =>
            item._id || item.idCategory || String(index)
          }
          numColumns={2}
          contentContainerStyle={{ paddingVertical: 8 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
