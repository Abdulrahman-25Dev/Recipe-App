import { View, Text } from "react-native";
import { Stack } from "expo-router";
import { useTheme } from "../../store/useTheme";

export default function RandomRecipe() {
  const { isDark } = useTheme();

  return (
    <View
      className={`flex-1 items-center justify-center ${isDark ? "bg-darkBackground" : "bg-white"}`}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <Text className="text-lg font-semibold text-text dark:text-darkText">
        Random Recipe
      </Text>
    </View>
  );
}
