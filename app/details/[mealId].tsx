import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Switch,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { getMealById } from "../../src/api/meal";
import { useFavorites } from "../../store/useFavoriteStore";
import i18n from "../../i18next/i18n";

// استيراد الأيقونات من Lucide
import {
  UtensilsCrossed,
  Clock,
  ListOrdered,
  ArrowRight,
  Heart,
  List,
  BookOpen,
  AlertCircle,
  MapPin,
} from "lucide-react-native";

const HARAM_INGREDIENTS = ["pork", "bacon", "ham", "pepperoni", "prosciutto"];

export default function MealDetails() {
  const { mealId } = useLocalSearchParams();
  const [meal, setMeal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isHaram, setIsHaram] = useState(false);

  const [isArabic, setIsArabic] = useState(i18n.language === "ar");

  const { toggleFavorite } = useFavorites();

  const favorited = useFavorites((state) =>
    state.favorites.some(
      (f: any) => (f._id || f.idMeal || f.id) === String(mealId),
    ),
  );

  useEffect(() => {
    if (!mealId) return;
    const fetchMeal = async () => {
      setLoading(true);
      const data = await getMealById(String(mealId));
      setMeal(data);

      if (data && Array.isArray(data.ingredients)) {
        const hasHaram = data.ingredients.some((ing: string) =>
          HARAM_INGREDIENTS.some((h) => ing.toLowerCase().includes(h)),
        );
        setIsHaram(hasHaram);
      }
      setLoading(false);
    };
    fetchMeal();
  }, [mealId]);

  if (!mealId) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-text">لم يتم اختيار وصفة</Text>
      </View>
    );
  }

  if (loading || !meal) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-darkBackground">
        <ActivityIndicator size="large" color="#FF8A00" />
        <Text className="text-text dark:text-darkText mt-4">
          جاري تحميل تفاصيل الوصفة...
        </Text>
      </View>
    );
  }

  const imageUrl =
    meal.image ||
    meal.thumbUrl ||
    meal.strMealThumb ||
    "https://via.placeholder.com/400x300.png?text=No+Image";

  const title = isArabic
    ? meal.titleAr || meal.title
    : meal.title || meal.titleAr;

  const category = isArabic
    ? meal.categoryAr || meal.category || "عام"
    : meal.category || meal.categoryAr || "General";

  const country = isArabic
    ? meal.countryAr || meal.country || "عالمي"
    : meal.country || meal.countryAr || "International";

  const prepTime = meal.prepTime
    ? `${meal.prepTime} ${isArabic ? "دقيقة" : "min"}`
    : isArabic
      ? "غير محدد"
      : "not specified";

  const ingredientsList: string[] = isArabic
    ? meal.ingredientsAr && meal.ingredientsAr.length > 0
      ? meal.ingredientsAr
      : meal.ingredients || []
    : meal.ingredients || [];

  const instructionsList: string[] = isArabic
    ? meal.instructionsAr && meal.instructionsAr.length > 0
      ? meal.instructionsAr
      : meal.instructions || []
    : meal.instructions || [];

  if (isHaram) {
    return (
      <View className="flex-1 bg-background dark:bg-darkBackground">
        <Stack.Screen options={{ headerShown: false }} />
        <View className="flex-1 items-center justify-center px-6">
          <Pressable
            onPress={() => router.back()}
            className="absolute top-4 bg-black right-4 z-10 p-2 rounded-full shadow mt-7"
          >
            <ArrowRight size={24} color="#FF8A00" />
          </Pressable>
          <Image
            source={{ uri: imageUrl }}
            className="w-full h-64 rounded-lg mb-6 mt-16"
            style={{ resizeMode: "cover" }}
          />
          <Text className="text-2xl font-bold text-primary mb-4 text-center">
            {title}
          </Text>
          <View className="bg-red-100 rounded-xl px-6 py-8 items-center">
            <AlertCircle size={48} color="#EF4444" />
            <Text className="text-lg font-semibold text-red-600 mt-4 text-center">
              الوصفة غير حلال
            </Text>
            <Text className="text-base text-red-500 mt-2 text-center leading-6">
              تحتوي هذه الوصفة على مكونات غير مسموحة (لحم خنزير أو مشتقاته)
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background dark:bg-darkBackground">
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* صورة الوجبة والأزرار العلوية */}
        <View className="relative">
          <Image
            source={{ uri: imageUrl }}
            className="w-full h-64"
            style={{ resizeMode: "cover" }}
          />

          <Pressable
            onPress={() => router.back()}
            className="absolute top-4 bg-black/60 right-4 z-10 p-2.5 rounded-full shadow mt-7"
          >
            <ArrowRight size={22} color="#FF8A00" />
          </Pressable>

          <Pressable
            onPress={() => toggleFavorite(meal)}
            className="absolute top-4 bg-black/60 left-4 z-10 p-2.5 rounded-full shadow mt-7"
          >
            <Heart
              size={22}
              color="#FF8A00"
              fill={favorited ? "#FF8A00" : "none"}
            />
          </Pressable>
        </View>

        <View className="p-4 bg-background dark:bg-darkBackground">
          {/* عنوان الوصفة */}
          <Text
            className={`text-2xl font-bold text-primary dark:text-darkPrimary mb-4 ${isArabic ? "text-right" : "text-left"}`}
          >
            {title}
          </Text>

          {/* شبكة المربعات من عمودين (Grid 2 Columns) */}
          <View className="flex-row flex-wrap justify-between gap-y-3 mb-5">
            {/* 1. التصنيف */}
            <View className="w-[48%] bg-primary/10 rounded-2xl border border-primary/30 dark:border-darkPrimary/30 p-3 items-center justify-center">
              <UtensilsCrossed size={22} color="#FF8A00" />
              <Text
                numberOfLines={1}
                className="text-sm text-text dark:text-darkText mt-1.5 font-bold"
              >
                {category}
              </Text>
            </View>

            {/* 2. المنطقة / البلد */}
            <View className="w-[48%] bg-primary/10 rounded-2xl border border-primary/30 dark:border-darkPrimary/30 p-3 items-center justify-center">
              <MapPin size={22} color="#FF8A00" />
              <Text
                numberOfLines={1}
                className="text-sm text-text dark:text-darkText mt-1.5 font-bold"
              >
                {country}
              </Text>
            </View>

            {/* 3. وقت التحضير */}
            <View className="w-[48%] bg-primary/10 rounded-2xl border border-primary/30 dark:border-darkPrimary/30 p-3 items-center justify-center">
              <Clock size={22} color="#FF8A00" />
              <Text className="text-sm text-text dark:text-darkText mt-1.5 font-bold">
                {prepTime}
              </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                {isArabic ? "الوقت ليس دقيق" : "is not accurate"}
              </Text>
            </View>

            {/* 4. عدد المكونات */}
            <View className="w-[48%] bg-primary/10 rounded-2xl border border-primary/30 dark:border-darkPrimary/30 p-3 items-center justify-center">
              <ListOrdered size={22} color="#FF8A00" />
              <Text className="text-sm text-text dark:text-darkText mt-1.5 font-bold">
                {meal.ingredientsCount || ingredientsList.length}{" "}
                {isArabic ? "مكونات" : "ingredients"}
              </Text>
            </View>
          </View>

          {/* زر تبديل اللغة */}
          <View className="mb-4">
            <View className="flex-row items-center justify-between bg-background dark:bg-darkBackground p-3.5 rounded-2xl border border-primary/40 dark:border-darkPrimary/40">
              <Switch
                value={isArabic}
                onValueChange={(val) => setIsArabic(val)}
                thumbColor={isArabic ? "#FF8A00" : "#f4f3f4"}
                trackColor={{ false: "#767577", true: "#FF8A00" }}
              />
              <Text className="text-text dark:text-darkText text-base font-bold">
                عرض باللغة العربية
              </Text>
            </View>
          </View>

          {/* عنوان المكونات */}
          <View className="p-2 rounded-xl flex-row items-center justify-end mb-1">
            <Text className="text-xl font-bold text-primary dark:text-darkPrimary mr-2 text-right">
              المكونات
            </Text>
            <List size={22} color="#FF8A00" />
          </View>

          {/* قائمة المكونات */}
          <View className="mb-5 bg-primary/5 p-4 rounded-2xl">
            {ingredientsList.length > 0 ? (
              ingredientsList.map((ing: string, idx: number) => (
                <View
                  key={idx}
                  className={`flex-row items-center mb-2.5 ${
                    isArabic ? "flex-row-reverse" : ""
                  }`}
                >
                  <View className="w-2 h-2 rounded-full bg-primary mx-2" />
                  <Text
                    className={`text-text text-sm font-semibold dark:text-darkText flex-1 ${
                      isArabic ? "text-right" : "text-left"
                    }`}
                  >
                    {ing}
                  </Text>
                </View>
              ))
            ) : (
              <Text className="text-text dark:text-darkText text-center">
                لا توجد مكونات مسجلة
              </Text>
            )}
          </View>

          {/* عنوان طريقة التحضير */}
          <View className="p-2 rounded-xl flex-row items-center justify-end mb-1">
            <Text className="text-xl font-bold text-primary dark:text-darkPrimary mr-2 text-right">
              طريقة التحضير
            </Text>
            <BookOpen size={22} color="#FF8A00" />
          </View>

          {/* قائمة طريقة التحضير */}
          <View className="bg-primary/5 p-4 rounded-2xl mb-8">
            {instructionsList.length > 0 ? (
              instructionsList.map((step: string, idx: number) => (
                <Text
                  key={idx}
                  className={`text-text dark:text-darkText leading-7 text-base font-semibold mb-3 ${
                    isArabic ? "text-right" : "text-left"
                  }`}
                >
                  {instructionsList.length > 1 ? `${idx + 1}. ` : ""}
                  {step}
                </Text>
              ))
            ) : (
              <Text className="text-text dark:text-darkText text-center">
                لا توجد تعليمات تحضير مسجلة
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
