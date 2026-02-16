import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { getMealById } from "../../src/api/meal";
import { Feather, Ionicons } from "@expo/vector-icons";
type Meal = {
  idMeal: string;
  strMeal: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strMealThumb?: string;
  [key: string]: any;
};

const HARAM_INGREDIENTS = ["pork", "bacon", "ham", "pepperoni", "prosciutto"];

const containsHaramIngredients = (meal: Meal): boolean => {
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    if (ingredient) {
      const lowerIngredient = ingredient.toLowerCase();
      if (HARAM_INGREDIENTS.some((haram) => lowerIngredient.includes(haram))) {
        return true;
      }
    }
  }
  return false;
};

const parseIngredients = (meal: Meal) => {
  const list: { ingredient: string; measure: string }[] = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ing && ing.trim()) {
      list.push({ ingredient: ing.trim(), measure: (measure || "").trim() });
    }
  }
  return list;
};

export default function MealDetails() {
  const { mealId } = useLocalSearchParams();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);
  const [isHaram, setIsHaram] = useState(false);

  useEffect(() => {
    if (!mealId) return;
    const fetchMeal = async () => {
      setLoading(true);
      const data = await getMealById(String(mealId));
      setMeal(data);
      if (data && containsHaramIngredients(data)) {
        setIsHaram(true);
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
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#FF8A00" />
        <Text className="text-text mt-4">جاري تحميل تفاصيل الوصفة...</Text>
      </View>
    );
  }

  // Show halal message if meal contains haram ingredients
  if (isHaram) {
    return (
      <View className="flex-1 bg-background">
        <Stack.Screen options={{ headerShown: false }} />
        <View className="flex-1 items-center justify-center px-6">
          <Pressable
            onPress={() => router.back()}
            className="absolute top-4 bg-black right-4 z-10 p-2 rounded-full shadow mt-7"
          >
            <Feather name="arrow-right" size={24} color="#FF8A00" />
          </Pressable>

          {meal.strMealThumb ? (
            <Image
              source={{ uri: meal.strMealThumb }}
              className="w-full h-64 rounded-lg mb-6 mt-16"
              style={{ resizeMode: "cover" }}
            />
          ) : null}

          <Text className="text-2xl font-bold text-primary mb-4 text-center">
            {meal.strMeal}
          </Text>

          <View className="bg-red-100 rounded-xl px-6 py-8 items-center">
            <Feather name="alert-circle" size={48} color="#EF4444" />
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

  const ingredients = parseIngredients(meal);

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => router.back()}
          className="absolute top-4 bg-black right-4 z-10 p-2 rounded-full shadow mt-7"
        >
          <Feather name="arrow-right" size={24} color="#FF8A00" />
        </Pressable>
        {meal.strMealThumb ? (
          <Image
            source={{ uri: meal.strMealThumb }}
            className="w-full h-64"
            style={{ resizeMode: "cover" }}
          />
        ) : null}
        <Pressable
          onPress={() => setFavorite(!favorite)}
          className="absolute top-4 bg-black left-4 z-10 p-2 rounded-full shadow mt-7"
        >
          <Ionicons
            name={favorite ? "heart" : "heart-outline"}
            size={26}
            color="#FF8A00"
            style={{ marginRight: 4 }}
          />
        </Pressable>

        <View className="p-4">
          <Text className="text-2xl font-bold text-primary mb-2">
            {meal.strMeal}
          </Text>
          <Text className="text-text mb-1 text-right my-2 text-lg font-semibold">
            التصنيف: {meal.strCategory || "-"}
          </Text>
          <Text className="text-text mb-3 text-right my-2 text-lg font-semibold">
            المنطقة: {meal.strArea || "-"}
          </Text>

          <Text className="text-2xl font-bold text-primary mt-2 mb-2 text-right">
            المكونات
          </Text>
          {ingredients.map((it, idx) => (
            <View
              key={idx}
              className="flex-row justify-between items-center py-1"
            >
              <Text className="text-text font-semibold">{it.ingredient}</Text>
              <Text className="text-text text-sm text-muted font-semibold">{it.measure}</Text>
            </View>
          ))}

          <Text className="text-xl font-bold text-primary mt-4 mb-2 text-right">
            طريقة التحضير
          </Text>
          <Text className="text-text leading-6 font-semibold">{meal.strInstructions}</Text>
        </View>
      </ScrollView>
    </View>
  );
}
