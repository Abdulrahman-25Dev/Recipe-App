import {
  Text,
  View,
  ActivityIndicator,
  Pressable,
  FlatList,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import i18n from "../../i18next/i18n";
import { apiClient } from "../../src/api/client";

// تحديث الواجهة لتناسب قاعدة البيانات الخاصة بك
type Meal = {
  _id: string;
  name:
    | {
        en: string;
        ar: string;
      }
    | string;
  thumbUrl?: string;
  strMealThumb?: string; // للحفاظ على التوافق مع أي بيانات قديمة
  category?: string;
};

export default function Index() {
  const isRTL = i18n.language === "ar";
  const { t } = useTranslation();

  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState("Chicken");

  const categories = ["Chicken", "Seafood", "Beef", "Lamb"];


    useEffect(() => {
  const fetchMealsByCategory = async () => {
    try {
      setLoading(true);
      // طلب البيانات من الباك إند المترجم بدلاً من API الخارجي
      const response = await apiClient.get(
        `/recipes/category/${encodeURIComponent(activeCategory)}`
      );
      const data =
        response.data?.data ||
        response.data?.recipes ||
        response.data ||
        [];
      setMeals(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching meals:", error);
      setMeals([]);
    } finally {
      setLoading(false);
    }
  };

  fetchMealsByCategory();
}, [activeCategory]);


  return (
    <View className="flex-1 bg-background dark:bg-darkBackground">
      {/* Header */}
      <View
        className={`p-5 flex-row items-center mt-10 ${
          isRTL ? "justify-end" : "justify-start"
        }`}
      >
        <Text className="text-lg font-bold text-primary dark:text-darkPrimary mr-2">
          {t("welcome")}
        </Text>
        <Feather name="sun" size={24} color="#FF8A00" />
      </View>

      {/* Categories Header */}
      <View
        className={`justify-between items-center px-5 mt-2 ${
          isRTL ? "flex-row" : "flex-row-reverse"
        }`}
      >
        <Pressable
          onPress={() => {
            router.push("/categories/cats");
          }}
        >
          <Text className="text-primary text-md font-semibold dark:text-darkPrimary">
            {t("show all")}
          </Text>
        </Pressable>

        <Text className="text-text text-lg font-semibold dark:text-darkText">
          {t("categories")}
        </Text>
      </View>

      {/* Category Buttons */}
      <View className="flex-row gap-4 px-5 mt-3">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          {categories.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => setActiveCategory(cat)}
              className={`px-4 py-2 mr-2 rounded-full ${
                activeCategory === cat
                  ? "bg-primary dark:bg-darkPrimary"
                  : "bg-card dark:bg-darkCard"
              }`}
            >
              <Text
                className={`font-medium ${
                  activeCategory === cat
                    ? "text-white dark:text-black"
                    : "text-text dark:text-darkText"
                }`}
              >
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Meal Title */}
      <View
        className={`p-2 mt-5 mx-5 ${
          isRTL ? "justify-end" : "justify-start"
        } items-center flex-row`}
      >
        <Text className="text-text dark:text-darkText text-2xl font-bold mb-2">
          {t("recipes")}
        </Text>
      </View>

      {/* Meals Content */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#FF8A00" size="large" />
          <Text className="text-text dark:text-darkText mt-4 text-md">
            جاري تحميل الوصفات...
          </Text>
        </View>
      ) : meals.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-text dark:text-darkText text-base">
            لا توجد وصفات متوفرة في هذا التصنيف
          </Text>
        </View>
      ) : (
        <View className="px-2 flex-1">
          <FlatList
            data={meals}
            numColumns={2}
            columnWrapperStyle={{ paddingHorizontal: 6, paddingBottom: 4 }}
            contentContainerStyle={{ paddingVertical: 8, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item._id || (item as any).idMeal}
            renderItem={({ item }: { item: any }) => {
              // رابط صورة افتراضية تعمل دائماً في حال عدم وجود صورة
              const PLACEHOLDER_IMAGE =
                "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&q=80";

              const imageUrl =
                item.image ||
                item.imageUrl ||
                item.thumbUrl ||
                item.strMealThumb ||
                item.thumbnail ||
                PLACEHOLDER_IMAGE;

              // 2. استخراج الاسم بغض النظر عن كونه كائن أو نص
              let mealName = "";
              if (typeof item.title === "string") mealName = item.title;
              else if (typeof item.name === "string") mealName = item.name;
              else if (typeof item.strMeal === "string")
                mealName = item.strMeal;
              else if (item.title?.ar || item.title?.en)
                mealName = isRTL
                  ? item.title.ar || item.title.en
                  : item.title.en || item.title.ar;
              else if (item.name?.ar || item.name?.en)
                mealName = isRTL
                  ? item.name.ar || item.name.en
                  : item.name.en || item.name.ar;

              // 3. استخراج الـ ID
              const mealId = item._id || item.id || item.idMeal;

              return (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => router.push(`/details/${mealId}`)}
                  className="m-1.5"
                  style={{ flex: 1, minHeight: 220 }}
                >
                  <ImageBackground
                    source={{ uri: imageUrl }}
                    className="rounded-3xl overflow-hidden bg-gray-800"
                    style={{ height: 220 }}
                    imageStyle={{ resizeMode: "cover" }}
                  >
                    <LinearGradient
                      colors={["transparent", "rgba(0, 0, 0, 0.85)"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      className="flex-1 justify-end p-4"
                    >
                      <Text
                        numberOfLines={2}
                        className="text-white font-bold text-base leading-5"
                      >
                        {mealName || "وصفة بدون عنوان"}
                      </Text>
                    </LinearGradient>
                  </ImageBackground>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}
    </View>
  );
}
