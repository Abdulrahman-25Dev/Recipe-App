import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { useState, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMeals = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`,
      );
      const data = await res.json();
      setResults(data.meals || []);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  // بحث تلقائي مع كل تغيير في query (debounce)
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchMeals();
    }, 400);

    return () => clearTimeout(delay);
  }, [query]);

  return (
    <View className="flex-1 bg-background dark:bg-darkBackground px-4 pt-10">
      
      {/* شريط البحث */}
      <View className="flex-row items-center bg-white dark:bg-darkCard rounded-full px-3 py-2 mx-3 mt-4 mb-4 border border-neutral-300 ">
        <Feather name="search" size={20} color="#777" className="mr-2" />
        <TextInput
          placeholder="ابحث عن وصفة…"
          placeholderTextColor="#777"
          className="flex-1 text-text dark:text-darkText p-2 text-lg"
          value={query}
          onChangeText={setQuery}
        />
      </View>
      {/* TEXT */}
      {!loading && results.length === 0 && query.length === 0 && (
        <Text className="text-neutral-500 dark:text-neutral-400 text-xl mt-4 text-center">
          ابدأ بالبحث عن وصفاتك المفضلة!
        </Text>
      )}


      {/* حالة التحميل */}
      {loading &&(
        <ActivityIndicator size="large" color="#FF8A00" className="mt-6" />
        
      )}

      {/* لا توجد نتائج */}
      {!loading && query.length > 0 && results.length === 0 && (
        <Text className="text-neutral-700 text-center mt-10 text-lg">
          لا توجد وصفات مطابقة لبحثك
        </Text>
      )}


      {/* نتائج البحث */}
      <FlatList
        data={results}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-around" }}
        keyExtractor={(item) => item.idMeal}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity className="w-[48%] mb-3"
            onPress={() => router.push(`/details/${item.idMeal}`)} 
           >
            <View className="rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
              <ImageBackground
                source={{ uri: item.strMealThumb }}
                className="w-full h-52"
                resizeMode="cover"
              >
                {/* Dark gradient overlay at the bottom */}
                <LinearGradient
                  colors={["transparent", "rgba(0, 0, 0, 0.7)"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  className="flex-1 justify-end p-4"
                >
                  {/* اسم الوصفة */}
                  <Text
                    className="text-white font-bold text-base leading-5"
                    numberOfLines={2}
                  >
                    {item.strMeal}
                  </Text>
                </LinearGradient>
              </ImageBackground>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
