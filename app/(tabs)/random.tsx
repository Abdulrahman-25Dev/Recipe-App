import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { Shuffle, Filter, ChefHat } from "lucide-react-native";
import i18n from "../../i18next/i18n";
import { apiClient } from "../../src/api/client";
import FilterBottomSheet, {
  RecipeFilters,
  CuisineOption,
} from "../../src/components/FilterBottomSheet";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&q=80";

const EMPTY_FILTERS: RecipeFilters = {
  calorie: null,
  cuisine: null,
  ingredients: null,
};

const cuisineMatches = (
  meal: any,
  cuisineKey: string | null,
  cuisines: CuisineOption[],
) => {
  if (!cuisineKey) return true;
  const option = cuisines.find((c) => c.key === cuisineKey);
  const names = [
    meal.category,
    meal.categoryAr,
    meal.cuisine,
    option?.labelAr,
  ].filter(Boolean);
  return names.some((n) => n === cuisineKey || n === option?.label);
};

const matchesFilters = (
  meal: any,
  f: RecipeFilters,
  cuisines: CuisineOption[],
) => {
  if (f.calorie) {
    const cat = meal.calorieCategory || meal.calorieCategoryAr;
    if (!cat || cat !== f.calorie) return false;
  }
  if (f.cuisine && !cuisineMatches(meal, f.cuisine, cuisines)) return false;
  if (f.ingredients) {
    const count = meal.ingredients?.length ?? meal.ingredientsAr?.length ?? -1;
    if (count < 0) return false;
    if (f.ingredients === "0-5" && count > 5) return false;
    if (f.ingredients === "6-10" && (count < 6 || count > 10)) return false;
    if (f.ingredients === "11-15" && (count < 11 || count > 15)) return false;
    if (f.ingredients === "16+" && count < 16) return false;
  }
  return true;
};

const pickRandomFrom = (
  list: any[],
  f: RecipeFilters,
  cuisines: CuisineOption[],
) => {
  const filtered = list.filter((meal) => matchesFilters(meal, f, cuisines));
  if (filtered.length === 0) return null;
  return filtered[Math.floor(Math.random() * filtered.length)];
};

export default function RandomRecipe() {
  const router = useRouter();
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const { openFilter } = useLocalSearchParams<{ openFilter?: string }>();

  const [isFilterVisible, setFilterVisible] = useState(false);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [cuisines, setCuisines] = useState<CuisineOption[]>([]);
  const [randomMeal, setRandomMeal] = useState<any | null>(null);
  const [noMatch, setNoMatch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<RecipeFilters>(EMPTY_FILTERS);

  useEffect(() => {
    if (openFilter === "1") setFilterVisible(true);
  }, [openFilter]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/recipes");
        const data =
          response.data?.data || response.data?.recipes || response.data || [];
        const list = Array.isArray(data) ? data : [];
        setRecipes(list);
        const chosen = pickRandomFrom(list, EMPTY_FILTERS, []);
        setRandomMeal(chosen);
        setNoMatch(!chosen);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

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

    fetchRecipes();
    fetchCuisines();
  }, []);

  const applyPick = (f: RecipeFilters) => {
    const chosen = pickRandomFrom(recipes, f, cuisines);
    setRandomMeal(chosen);
    setNoMatch(!chosen);
  };

  const handleApplyFilters = (f: RecipeFilters) => {
    setFilters(f);
    applyPick(f);
  };

  const handleShuffle = () => {
    applyPick(filters);
  };

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
    applyPick(EMPTY_FILTERS);
  };

  const handlePressRecipe = () => {
    const mealId = randomMeal?._id || randomMeal?.id || randomMeal?.idMeal;
    if (mealId) {
      router.push(`/details/${mealId}`);
    }
  };

  const hasActiveFilters =
    filters.calorie !== null ||
    filters.cuisine !== null ||
    filters.ingredients !== null;

  const activeFiltersCount = hasActiveFilters
    ? [filters.calorie, filters.cuisine, filters.ingredients].filter(
        (f) => f !== null,
      ).length
    : 0;

  const mealTitle = randomMeal
    ? isArabic
      ? randomMeal.titleAr || randomMeal.title
      : randomMeal.title || randomMeal.titleAr
    : "";

  const mealImage =
    randomMeal?.image ||
    randomMeal?.imageUrl ||
    randomMeal?.thumbUrl ||
    randomMeal?.strMealThumb ||
    PLACEHOLDER_IMAGE;

  const mealCategory = randomMeal
    ? isArabic
      ? randomMeal.categoryAr || randomMeal.category || t("cuisine")
      : randomMeal.category || randomMeal.categoryAr || t("cuisine")
    : "";

  const mealCalories = randomMeal
    ? isArabic
      ? randomMeal.calorieCategoryAr || "متوسطة"
      : randomMeal.calorieCategory || "Medium"
    : "";

  const mealIngredientsCount =
    randomMeal?.ingredients?.length ??
    randomMeal?.ingredientsAr?.length ??
    0;

  return (
    <View className="flex-1 bg-background dark:bg-darkBackground px-4 pt-12">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header: title + Filter button */}
      <View className="flex-row items-center justify-between mb-5">
        <View />
        <Text className="text-xl font-bold text-text dark:text-darkText">
          {t("random recipe")}
        </Text>
        <TouchableOpacity
          onPress={() => setFilterVisible(true)}
          activeOpacity={0.8}
          className="w-11 h-11 items-center justify-center rounded-xl bg-card dark:bg-darkCard border border-neutral-200 dark:border-neutral-700"
        >
          <View className="flex-row items-center gap-1">
            <Filter size={19} color="#FF8A00" />
            {activeFiltersCount > 0 && (
              <View className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-primary items-center justify-center px-1">
                <Text className="text-white text-[10px] font-bold">
                  {activeFiltersCount}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Active filters summary */}
      {hasActiveFilters && (
        <TouchableOpacity onPress={clearFilters} className="mb-4 flex-row items-center gap-2 self-start">
          <Text className="text-sm font-medium text-primary dark:text-primary">
            {[
              filters.calorie,
              filters.cuisine
                ? cuisines.find((c) => c.key === filters.cuisine)?.labelAr ||
                  filters.cuisine
                : null,
              filters.ingredients,
            ]
              .filter(Boolean)
              .join(" · ")}
          </Text>
          <Text className="text-xs border-2 ml-5 border-red-500 px-2 py-1 rounded-full font-semibold text-red-500">{t("clear all")}</Text>
        </TouchableOpacity>
      )}

      {/* Content */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FF8A00" />
          <Text className="text-text dark:text-darkText mt-4 text-base">
            {isArabic ? "جاري تحميل الوصفات..." : "Loading recipes..."}
          </Text>
        </View>
      ) : noMatch || !randomMeal ? (
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-24 h-24 rounded-full bg-primary/10 items-center justify-center mb-5">
            <ChefHat size={44} color="#FF8A00" />
          </View>
          <Text className="text-lg font-bold text-text dark:text-darkText text-center mb-2">
            {t("no recipes with filters")}
          </Text>
          <TouchableOpacity
            onPress={clearFilters}
            activeOpacity={0.85}
            className="mt-4 px-6 py-3 rounded-full bg-primary dark:bg-darkPrimary"
          >
            <Text className="text-white font-bold">{t("clear all")}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Random meal card */}
          <TouchableOpacity
            onPress={handlePressRecipe}
            activeOpacity={0.85}
            className="rounded-3xl overflow-hidden bg-neutral-800 relative mt-2"
          >
            <ImageBackground
              source={{ uri: mealImage }}
              className="w-full h-80"
              resizeMode="cover"
            >
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.85)"]}
                className="absolute bottom-0 left-0 right-0 p-4 pt-16"
              >
                <Text
                  className="text-white font-bold text-2xl mb-2"
                  numberOfLines={2}
                >
                  {mealTitle}
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  <View className="px-3 py-1.5 rounded-full bg-white/20 border border-white/30">
                    <Text className="text-white text-xs font-bold">{mealCategory}</Text>
                  </View>
                  {mealCalories && (
                    <View className="px-3 py-1.5 rounded-full bg-white/20 border border-white/30">
                      <Text className="text-white text-xs font-bold">
                        {mealCalories}
                      </Text>
                    </View>
                  )}
                  <View className="px-3 py-1.5 rounded-full bg-white/20 border border-white/30">
                    <Text className="text-white text-xs font-bold">
                      {mealIngredientsCount} {t("ingredients count")}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>

          {/* Shuffle button */}
          <TouchableOpacity
            onPress={handleShuffle}
            activeOpacity={0.85}
            className="mt-6 h-14 rounded-2xl bg-primary dark:bg-darkPrimary items-center justify-center flex-row gap-2"
          >
            <Shuffle size={20} color="#FFFFFF" />
            <Text className="text-white text-base font-bold">
              {t("shuffle")}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}

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