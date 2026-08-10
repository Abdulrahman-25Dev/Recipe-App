import { View, Pressable, StyleSheet } from "react-native";
import { Tabs, useRouter } from "expo-router";
import { Home, Search, Heart, Settings2, Dices } from "lucide-react-native";
import { useTheme } from "../../store/useTheme";
import { useTranslation } from "react-i18next";

export default function TabLayout() {
  const { isDark } = useTheme();
  const router = useRouter();
  const { t } = useTranslation();

  const handleRandomRecipe = async () => {
    try {
      router.push({ pathname: "/random", params: { openFilter: "1" } });
    } catch (error) {
      console.error("خطأ في التنقل إلى الوصفة العشوائية", error);
    }
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#F97316",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: isDark ? "#121212" : "#FFFFFF",
          borderTopWidth: 0,
          height: 75,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 18,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -6 },
          shadowOpacity: 0.14,
          shadowRadius: 14,
          // borderTopLeftRadius: 30,
          // borderTopRightRadius: 30,
          paddingBottom: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("Home"),
          tabBarIcon: ({ color, size }) => <Home size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: t("Search"),
          tabBarIcon: ({ color, size }) => <Search size={26} color={color} />,
        }}
      />

      <Tabs.Screen
        name="random"
        options={{
          title: "عشوائي",
          tabBarButton: ({ style }: { style?: any }) => (
            <Pressable
              onPress={handleRandomRecipe}
              style={[styles.randomButtonContainer, style]}
            >
              <View
                style={[
                  styles.randomButton,
                  { backgroundColor: "#F97316"  },
                ]}
              >
                <Dices size={30} color="#FFFFFF" />
              </View>
            </Pressable>
          ),
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          title: t("favorites"),
          tabBarIcon: ({ color, size }) => <Heart size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("Settings"),
          tabBarIcon: ({ color, size }) => (
            <Settings2 size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  randomButtonContainer: {
    top: -24,
    justifyContent: "center",
    alignItems: "center",
    width: 68,
    height: 68,
    borderRadius: 34,
  },
  randomButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
});
