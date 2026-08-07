import { Tabs } from "expo-router";
import { Home, Search, Heart, Settings2 } from "lucide-react-native";
import { useTheme } from "../../store/useTheme";

export default function TabLayout() {
  const { isDark } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#F97316", // برتقالي للأكل
        tabBarInactiveTintColor: "#9CA3AF", // رمادي هادي
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: isDark ? "#121212" : "#F9FAFB",
          borderTopColor: isDark ? "#9CA3AF" : "#E5E7EB",
          height: 54,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "الرئيسية",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "البحث",
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "المفضلة",
          tabBarIcon: ({ color, size }) => <Heart size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "الإعدادات",
          tabBarIcon: ({ color, size }) => (
            <Settings2 size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
