import {
  Text,
  View,
  ActivityIndicator,
  Pressable,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";
import { Redirect, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { getMealsByCategory } from "../../src/api/meal";
import { getLocalizedMealName, useAppLanguage } from "../../src/utils/localizedMeal";
import { Coffee, Salad, UtensilsCrossed } from "lucide-react-native";

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

const CATEGORY_LABEL_KEYS: Record<string, string> = {
  Chicken: "chicken",
  Seafood: "seafood",
  Beef: "beef",
  Lamb: "lamb",
};

const getGreetingKey = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "greeting morning";
  if (hour < 18) return "greeting afternoon";
  return "greeting evening";
};

export default function Index() {
  const { t } = useTranslation();
  const { language, isRTL } = useAppLanguage();

  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState("Chicken");

  const categories = ["Chicken", "Seafood", "Beef", "Lamb"];

  // حارس الدخول: بدون توكن نعيد التوجيه لشاشة تسجيل الدخول
  // حتى لا يفتح التطبيق على الصفحة الرئيسية بدون حساب
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    let isMounted = true;
    AsyncStorage.getItem("userToken")
      .then((token) => {
        if (isMounted) setIsAuthed(!!token);
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setAuthChecked(true);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchMealsByCategory = async () => {
      try {
        setLoading(true);
        // طلب البيانات من الباك إند المترجم بدلاً من API الخارجي
        const meals = await getMealsByCategory(activeCategory);
        if (isMounted) {
          setMeals(Array.isArray(meals) ? meals : []);
        }
      } catch (error) {
        console.error("Error fetching meals:", error);
        if (isMounted) setMeals([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMealsByCategory();

    return () => {
      isMounted = false;
    };
  }, [activeCategory]);

  if (!authChecked) {
    return (
      <View className="flex-1 justify-center items-center bg-[#223D4D]">
        <ActivityIndicator size="large" color="#FD802E" />
      </View>
    );
  }

  if (!isAuthed) {
    return <Redirect href="/Auth/Login" />;
  }

  return (
    <View className="flex-1 bg-background dark:bg-darkBackground">
      {/* Header */}
      <View
        className={`p-5 flex-row items-center gap-2 mt-10 ${
          isRTL ? "flex-row" : "flex-row-reverse"
        }`}
      >
        <View className="flex-1 mr-2">
          <Text
            className="text-primary"
            style={{
              fontSize: 14,
              fontWeight: "bold",
              textAlign: isRTL ? "right" : "left",
            }}
          >
            {t(getGreetingKey())}
          </Text> 
        </View>
          {getGreetingKey() === "greeting morning" ? (
            <Coffee color="#FD802E" size={24}  />
          ) : getGreetingKey() === "greeting afternoon" ? (
            <Salad color="#FD802E" size={24} />
          ) : (
            <UtensilsCrossed color="#FD802E" size={24} />
          )}
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
      <View className="flex-row gap-4 px-5 py-2 my-3">
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
                className={`font-semibold ${
                  activeCategory === cat
                    ? "text-white dark:text-black"
                    : "text-text dark:text-darkText"
                }`}
              >
                {t(CATEGORY_LABEL_KEYS[cat] ?? cat)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Meals Content */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#FD802E" size="large" />
          <Text className="text-text dark:text-darkText mt-4 text-md">
            {t("loading recipes")}
          </Text>
        </View>
      ) : meals.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-text dark:text-darkText text-base">
            {t("no recipes in category")}
          </Text>
        </View>
      ) : (
        <View className="px-2 flex-1">
          <FlashList
            data={meals}
            numColumns={2}
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

              // الاسم المترجم حسب لغة التطبيق الحالية مع آلية استرجاع تلقائية
              const mealName = getLocalizedMealName(item, language);

              // 3. استخراج الـ ID
              const mealId = item._id || item.id || item.idMeal;

              return (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => mealId && router.push(`/details/${mealId}`)}
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
                        {mealName || t("untitled recipe")}
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
