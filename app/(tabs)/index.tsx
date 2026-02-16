import {
  Text,
  View,
  ActivityIndicator,
  Pressable,
  Image,
  FlatList,
  ScrollView,
  Dimensions,
} from "react-native";
import { getMealsByCategory } from "../../src/api/meal";
import { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

type Meal = {
  idMeal: string;
  strMeal: string;
  strInstructions: string;
  [key: string]: string;
};

export default function Index() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [imageHeights, setImageHeights] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState("Chicken");

  const categories = [
    "Chicken",
    "Seafood",
    "Beef",
    "Lamb",
    ];

 

  useEffect(() => {
    const fetchMealsByCategory = async () => {
      const data = await getMealsByCategory(activeCategory);
      setMeals(data);
    };
    fetchMealsByCategory();
  }, [activeCategory]);

  useEffect(() => {
    if (meals.length === 0) return;
    const colWidth = (Dimensions.get("window").width - 40) / 2; // approximate column width
    meals.forEach((m) => {
      if (!m.strMealThumb) return;
      Image.getSize(
        m.strMealThumb,
        (w, h) => {
          const scaled = Math.round((colWidth * h) / w);
          setImageHeights((prev) => ({ ...prev, [m.idMeal]: scaled }));
        },
        () => {},
      );
    });
  }, [meals]);

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
        <Pressable onPress={() => {
            console.log("Show all categories");
        }}>
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
      <View className="px-2">
        <FlatList
          data={meals}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={{ paddingBottom: 250 }}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.idMeal}
          renderItem={({ item }) => (
            <View className="flex-1 m-2 bg-card rounded-lg p-4">
              <Pressable 
              key={item.idMeal}
              onPress={() => {
                 router.push(`/details/${item.idMeal}`);
              }}>
                <Image
                source={{ uri: item.strMealThumb }}
                style={{
                  width: "100%",
                  height: imageHeights[item.idMeal] ?? 160,
                }}
                className="rounded-lg mb-2"
              />
                <Text className="text-text text-md font-semibold text-center">
                  {item.strMeal}
                </Text>
              </Pressable>
              
            </View>
          )}
        />
      </View>
    </View>
  );
}
