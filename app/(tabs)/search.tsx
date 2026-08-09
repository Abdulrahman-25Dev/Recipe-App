import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useState, useEffect } from "react";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { apiClient } from "../../src/api/client"; // استيراد العميل المعرف لديك المربوط بالباك إند
import { Filter } from "lucide-react-native";
import i18n from "../../i18next/i18n";
import FilterBottomSheet, {
  RecipeFilters,
  CuisineOption,
} from "../../src/components/FilterBottomSheet";

const EMPTY_FILTERS: RecipeFilters = {
  calorie: null,
  cuisine: null,
  ingredients: null,
};

const INGREDIENTS_API_MAP: Record<string, string> = {
  "0-5": "5-or-fewer",
  "6-10": "6-10",
  "11-15": "11-15",
  "16+": "16-plus",
};

export default function Search() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<RecipeFilters>(EMPTY_FILTERS);
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [cuisines, setCuisines] = useState<CuisineOption[]>([]);

const isArabic = i18n.language === "ar"; // تحقق من اللغة الحالية

  useEffect(() => {
    const fetchCuisines = async () => {
      try {
        const response = await apiClient.get("/recipes/categories");
        const data =
          response.data?.data || response.data?.categories || response.data || [];
        const list = Array.isArray(data) ? data : [];
        const mapped: CuisineOption[] = list
          .map((cat: any) => {
            const name = cat.name || cat.strCategory || cat.title || "";
            return {
              key: name,
              label: name,
              labelAr: cat.nameAr || cat.categoryAr || name,
            };
          })
          .filter((c: CuisineOption) => c.key && c.key.toLowerCase() !== "pork");
        setCuisines(mapped);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCuisines([]);
      }
    };
    fetchCuisines();
  }, []);

  useEffect(() => {
    const hasActiveFilters =
      filters.calorie !== null ||
      filters.cuisine !== null ||
      filters.ingredients !== null;

    const fetchMeals = async () => {
      if (!query.trim() && !hasActiveFilters) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (query.trim()) params.append("query", query.trim());
        if (filters.calorie) params.append("calories", filters.calorie);
        if (filters.cuisine) params.append("category", filters.cuisine);
        if (filters.ingredients)
          params.append(
            "ingredientsCount",
            INGREDIENTS_API_MAP[filters.ingredients] ?? filters.ingredients,
          );

        const response = await apiClient.get(
          `/recipes/search?${params.toString()}`,
        );
        const data = response.data?.data || response.data?.recipes || [];
        setResults(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log("خطأ أثناء جلب الوصفات:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const delay = setTimeout(() => {
      fetchMeals();
    }, 400);

    return () => clearTimeout(delay);
  }, [query, filters]);

  const hasActiveFilters =
    filters.calorie !== null ||
    filters.cuisine !== null ||
    filters.ingredients !== null;

  const activeFiltersCount = hasActiveFilters
    ? [filters.calorie, filters.cuisine, filters.ingredients].filter(
        (f) => f !== null,
      ).length
    : 0;

  const handleApplyFilters = (f: RecipeFilters) => {
    setFilters(f);
  };

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
  };

  return (
    <View className="flex-1 bg-white dark:bg-darkBackground px-4 pt-12">
      {/* 1. Header: زر العودة + حقل البحث + زر الفلترة */}
      <View className="flex-row items-center gap-2 mb-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-darkCard"
        >
          <Feather name="chevron-left" size={22} color="#FF8A00" />
        </TouchableOpacity>

        <View className="flex-1 flex-row items-center bg-neutral-100 dark:bg-neutral-800 rounded-full px-3 py-2">
          <Feather name="search" size={20} color="#9CA3AF" className="mr-2" />
          <TextInput
            placeholder={t("search for a recipe")}
            placeholderTextColor={"#9CA3AF"}
            className="flex-1 text-neutral-800 dark:text-neutral-100 text-base py-1 px-1"
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => setQuery("")}
              className="bg-neutral-600 rounded-full p-1"
            >
              <Ionicons name="close" size={14} color="#FFF" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          onPress={() => setFilterVisible(true)}
          className="w-10 h-10 items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-darkCard"
        >
          <Filter size={18} color="#FF8A00" />
          {activeFiltersCount > 0 && (
            <View className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-primary items-center justify-center px-1">
              <Text className="text-white text-[10px] font-bold">
                {activeFiltersCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Active filters bar */}
      {hasActiveFilters && (
        <View className="flex-row items-center justify-between mb-2 px-1">
          <Text className="text-sm font-medium text-primary dark:text-primary ml-1">
            {[
              filters.calorie,
              filters.cuisine
                ? cuisines.find((c) => c.key === filters.cuisine)?.labelAr ||
                  filters.cuisine
                : null,
              filters.ingredients
                ? t(filters.ingredients === "0-5" ? "5 or fewer" : filters.ingredients === "6-10" ? "6 - 10" : filters.ingredients === "11-15" ? "11 - 15" : "16+")
                : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </Text>
          <TouchableOpacity onPress={clearFilters} activeOpacity={0.8}>
            <Text className="text-xs font-semibold text-red-500">
              {t("clear all")}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 2. شريط النتيجة وعداد النتائج */}
      <View className={`items-center justify-between my-3 px-1 ${isArabic ? "flex-row-reverse" : "flex-row"}`}>
        <Text className={"text-xl font-bold text-neutral-900 dark:text-white"}>
          {t("results")}
        </Text>
        <Text className="text-sm font-medium text-neutral-400">
          {results.length > 0 ? ` ${t("results")} ${results.length}` : ""}
        </Text>
      </View>

      {/* حالة الانتظار وتحذير عدم وجود نتائج */}
      {!loading &&
        results.length === 0 &&
        query.length === 0 &&
        !hasActiveFilters && (
          <Text className="text-neutral-400 text-center mt-12 text-base">
            {t("start searching for your favorite recipe")}
          </Text>
        )}

      {loading && (
        <ActivityIndicator size="large" color="#FF8A00" className="mt-8" />
      )}

      {!loading &&
        (query.length > 0 || hasActiveFilters) &&
        results.length === 0 && (
          <Text className="text-neutral-500 text-center mt-10 text-base">
            لا توجد وصفات مطابقة لبحثك
          </Text>
        )}

      {/* 3. القائمة بالتنسيق الموحد */}
      <FlashList
        data={results}
        numColumns={2}
        keyExtractor={(item) =>
          item._id || item.idMeal || Math.random().toString()
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => {
          const id = item._id || item.idMeal;
          const title = item.titleAr || item.title || item.strMeal;
          const image = item.image || item.imageUrl || item.strMealThumb;
          const area =
            item.countryAr || item.cuisine || item.strArea || "الشيف";

          return (
            <TouchableOpacity
              activeOpacity={0.8}
              className="flex-1 m-1.5"
              onPress={() => router.push(`/details/${id}`)}
            >
              <View className="rounded-3xl overflow-hidden bg-neutral-800 h-56 relative shadow-sm">
                <ImageBackground
                  source={{ uri: image }}
                  className="w-full h-full justify-between p-3"
                  resizeMode="cover"
                >
                  <View className="flex-row justify-end">
                    <TouchableOpacity
                      onPress={() => {
                        // دالة إضافة/حذف من المفضلة
                      }}
                      className="bg-black/30 backdrop-blur-md p-2 rounded-full border border-white/20"
                    >
                      <Text className="text-white font-bold text-sm">{isArabic ? item.categoryAr  : item.category}</Text>
                    </TouchableOpacity>
                  </View>

                  <LinearGradient
                    colors={["transparent", "rgba(0, 0, 0, 0.85)"]}
                    className="absolute bottom-0 left-0 right-0 p-3 pt-6"
                  >
                    <Text
                      className="text-white font-bold text-sm leading-5 mb-0.5"
                      numberOfLines={2}
                    >
                      {title}
                    </Text>
                    <Text
                      className="text-orange-300 text-[11px] font-bold"
                      numberOfLines={1}
                    >
                      {area}
                    </Text>
                  </LinearGradient>
                </ImageBackground>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* Filter BottomSheet */}
      <FilterBottomSheet
        isVisible={isFilterVisible}
        onClose={() => setFilterVisible(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={filters}
        cuisines={cuisines}
      />
    </View>
  );
}
