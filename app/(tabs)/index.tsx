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
import { getMealsByCategory } from "../../src/api/meal";
import { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import i18n from "../../i18next/i18n";
type Meal = {
  idMeal: string;
  strMeal: string;
  strInstructions: string;
  [key: string]: string;
};

export default function Index() {
  const isRTL = i18n.language === "ar";

  const { t } = useTranslation();

  const [meals, setMeals] = useState<Meal[]>([]);
  const [activeCategory, setActiveCategory] = useState("Chicken");

  const categories = ["Chicken", "Seafood", "Beef", "Lamb"];

  useEffect(() => {
    const fetchMealsByCategory = async () => {
      const data = await getMealsByCategory(activeCategory);
      setMeals(data);
    };
    fetchMealsByCategory();
  }, [activeCategory]);

  if (meals.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-darkBackground">
        <ActivityIndicator color="#FF8A00" size="large" />
        <Text className="text-text dark:text-darkText mt-4 text-md">
          جاري تحميل الوصفات...
        </Text>
      </View>
    );
  }
  return (
    <View className="flex-1 bg-background dark:bg-darkBackground">
      {/* Header */}
      <View
        className={`p-5 flex-row items-center mt-10 ${isRTL ? "justify-end" : "justify-start"}`}
      >
        <Text className="text-lg font-bold text-primary dark:text-darkPrimary mr-2">
          {t("welcome")}
        </Text>
        <Feather name="sun" size={24} color="#FF8A00" />
      </View>

      {/* Categories Header */}
      <View
        className={` justify-between items-center px-5 mt-2 ${isRTL ? "flex-row" : "flex-row-reverse"}`}
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
              className={`
              px-4 py-2 rounded-full  
              ${activeCategory === cat ? "bg-primary dark:bg-darkPrimary" : "bg-card dark:bg-darkCard"}
            `}
            >
              <Text
                className={`
                font-medium 
                ${activeCategory === cat ? "text-white dark:text-darkText" : "text-text dark:text-darkText"}
              `}
              >
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Meal Title */}
      <View
        className={`p-2 mt-5 mx-5 ${isRTL ? "justify-end" : "justify-start"} items-center flex-row`}
      >
        <Text className="text-text dark:text-darkText text-2xl font-bold mb-2">
          {t("recipes")}
        </Text>
      </View>
      {/* Random meals */}
      <View className="px-2 flex-1">
        <FlatList
          data={meals}
          numColumns={2}
          columnWrapperStyle={{ paddingHorizontal: 6, paddingBottom: 4 }}
          contentContainerStyle={{ paddingVertical: 8, paddingBottom: 250 }}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.idMeal}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push(`/details/${item.idMeal}`)}
              className="m-1.5"
              style={{ flex: 1, minHeight: 220 }}
            >
              <ImageBackground
                source={{ uri: item.strMealThumb }}
                className="rounded-3xl overflow-hidden"
                style={{ height: 220 }}
                imageStyle={{ resizeMode: "cover" }}
              >
                {/* Dark gradient overlay at the bottom */}
                <LinearGradient
                  colors={["transparent", "rgba(0, 0, 0, 0.8)"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  className="flex-1 justify-end p-4"
                >
                  {/* Meal name */}
                  <Text
                    numberOfLines={2}
                    className="text-white font-bold text-base leading-5"
                  >
                    {item.strMeal}
                  </Text>
                </LinearGradient>
              </ImageBackground>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}
