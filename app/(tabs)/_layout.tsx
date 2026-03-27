import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // تمكين دعم اللغة العربية (من اليمين إلى اليسار)
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
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />
          ),
        }}
      />
        <Tabs.Screen
          name="search"
          options={{
            title: "البحث",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? "search" : "search-outline"} size={size} color={color} />
            ),
          }}
        />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "المفضلة",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "heart" : "heart-outline"} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "الإعدادات",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "settings" : "settings-outline"} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
