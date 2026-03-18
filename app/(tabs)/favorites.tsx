import {
  View,
  Text,
  FlatList,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { router } from "expo-router";
import { useFavorites } from "../../store/useFavoriteStore";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "@expo/vector-icons/build/Feather";
const Favorites = () => {
  const favorites = useFavorites((state) => state.favorites);
  return (
    <View className="flex-1 bg-background">
      <View className="p-3 flex-row items-center justify-end mt-10 bg-card">
        <Text className="text-2xl font-bold text-primary mr-2">
          وصفاتي المفضلة
        </Text>
        <Feather name="heart" size={24} color="red" />
      </View>
      <View className="flex-1 px-3">
        <FlatList
          data={favorites}
          numColumns={2}
          columnWrapperStyle={{ paddingHorizontal: 5, paddingBottom: 4 }}
          contentContainerStyle={{ paddingVertical: 8, paddingBottom: 250 }}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.idMeal}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push(`/details/${item.idMeal}`)}
              className="flex-1 m-1.5"
            >
              <Feather
                name="heart"
                size={20}
                color="#ff4d4d"
                className="absolute top-2 left-2 z-10 p-2 bg-black rounded-full"
              />

              <ImageBackground
                source={{ uri: item.strMealThumb }}
                className="rounded-3xl overflow-hidden flex-1"
                style={{ height: 200 }}
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
                  <View className="mt-1 bg-black/50 px-2 py-1 rounded-full self-start">
                    <Text className="text-primary font-semibold text-md leading-7">
                      {item.strCategory}
                    </Text>
                  </View>
                </LinearGradient>
              </ImageBackground>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

export default Favorites;
