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

type Meal = {
  idMeal: string;
  strMeal: string;
  strInstructions: string;
  [key: string]: string;
};

export default function Index() {

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

  const getRandomHeight = () => {
    return Math.floor(Math.random() * (220 - 150) + 160);
  };

  if (meals.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color="#FF8A00" size="large" />
        <Text className="text-text mt-4 text-md">جاري تحميل الوصفات...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="p-5 flex-row items-center justify-end mt-10">
        <Text className="text-lg font-bold text-primary mr-2">مرحبا بك</Text>
        <Feather name="sun" size={24} color="#FF8A00" />
      </View>

      {/* Categories Header */}
      <View className="flex-row justify-between items-center px-5 mt-2">
        <Pressable
          onPress={() => {
            router.push("/categories/cats");;
          }}
        >
          <Text className="text-primary text-md font-semibold">عرض الكل</Text>
        </Pressable>

        <Text className="text-text text-lg font-semibold">التصنيفات</Text>
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
              ${activeCategory === cat ? "bg-primary" : "bg-card"}
            `}
            >
              <Text
                className={`
                font-medium 
                ${activeCategory === cat ? "text-white" : "text-text"}
              `}
              >
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Meal Title */}
      <View className="p-2 mt-5 justify-end items-center flex-row">
        <Text className="text-text text-2xl font-bold mb-2">الوصفات</Text>
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
              className="flex-1 m-1.5"
            >
              <ImageBackground
                source={{ uri: item.strMealThumb }}
                className="rounded-3xl overflow-hidden flex-1"
                style={{ height: getRandomHeight() }}
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
          )}
        />
      </View>
    </View>
  );
}
