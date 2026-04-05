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
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export default function CategoryMealsScreen() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useLocalSearchParams();
  const categoryName = params.catId as string;
  const windowWidth = Dimensions.get("window").width;

  useEffect(() => {
    if (categoryName) {
      fetchMeals();
    }
  }, [categoryName]);

  const fetchMeals = async () => {
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`,
      );
      const data = await response.json();
      setMeals(data.meals || []);
    } catch (error) {
      console.error("Error fetching meals:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRandomHeight = () => {
    return Math.floor(Math.random() * (220 - 150) + 150);
  };

  const MealCard = ({ item }: { item: Meal }) => {
    const cardHeight = getRandomHeight();

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => router.push(`/details/${item.idMeal}`)}
        className="flex-1 m-1.5"
      >
        <ImageBackground
          source={{ uri: item.strMealThumb }}
          className="rounded-2xl overflow-hidden flex-1"
          style={{ height: cardHeight }}
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
            <Text numberOfLines={2} className="text-white font-bold text-base leading-5">
              {item.strMeal}
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
      <View className="flex-row items-center justify-between px-4 py-4 bg-background dark:bg-darkBackground mt-10">
        <Text className="text-2xl font-bold flex-1 ml-3 truncate text-primary">
          {categoryName}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 active:bg-gray-100 rounded-full bg-black"
        >
          <Ionicons name="arrow-forward" size={24} color="#FF8A00" />
        </TouchableOpacity>

      </View>

      {/* Content */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#ea580c" />
          <Text className="text-gray-500 mt-2">جاري تحميل الوصفات...</Text>
        </View>
      ) : meals.length > 0 ? (
        <FlatList
          data={meals}
          renderItem={({ item }) => <MealCard item={item} />}
          keyExtractor={(item) => item.idMeal}
          numColumns={2}
          columnWrapperStyle={{ paddingHorizontal: 6, paddingBottom: 4 }}
          contentContainerStyle={{ paddingVertical: 8 }}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500 text-lg">No meals found</Text>
        </View>
      )}
    </View>
  );
}
