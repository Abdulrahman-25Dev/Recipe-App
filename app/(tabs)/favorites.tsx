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
      <View className="p-5 flex-row items-center justify-end mt-10">
        <Text className="text-2xl font-bold text-primary mr-2">وصفاتي المفضلة</Text>
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
                <ImageBackground
                  source={{ uri: item.strMealThumb }}
                  className="rounded-2xl overflow-hidden flex-1"
                  style={{ height: 190 }}
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
};

export default Favorites;
