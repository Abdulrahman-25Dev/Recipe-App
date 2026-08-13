import { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useTranslation } from "react-i18next";
import i18n from "../../i18next/i18n";
import { useTheme } from "../../store/useTheme";
import { X } from "lucide-react-native";

export type CalorieFilter = "Low" | "Medium" | "High";
export type IngredientsFilter = "0-5" | "6-10" | "11-15" | "16+";

export interface RecipeFilters {
  calorie: CalorieFilter | null;
  category: string | null;
  ingredients: IngredientsFilter | null;
}

export interface CategoryOption {
  key: string;
  label: string;
  labelAr?: string;
}

export interface FilterBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: RecipeFilters) => void;
  currentFilters: RecipeFilters;
  categories: CategoryOption[];
}

const PRIMARY_ORANGE = "#FD802E";

const FilterBottomSheet = ({
  isVisible,
  onClose,
  onApplyFilters,
  currentFilters,
  categories,
}: FilterBottomSheetProps) => {
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const { isDark } = useTheme();

  const [calorie, setCalorie] = useState<CalorieFilter | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<IngredientsFilter | null>(null);

  useEffect(() => {
    if (isVisible) {
      setCalorie(currentFilters?.calorie ?? null);
      setCategory(currentFilters?.category ?? null);
      setIngredients(currentFilters?.ingredients ?? null);
    }
  }, [isVisible, currentFilters]);

  const handleApply = () => {
    onApplyFilters({ calorie, category, ingredients });
    onClose();
  };

  const handleSelectCategory = (value: string) => {
    setCategory(category === value ? null : value);
  };

  const calorieOptions: { label: string; value: CalorieFilter }[] = [
    { label: t("low"), value: "Low" },
    { label: t("medium"), value: "Medium" },
    { label: t("high"), value: "High" },
  ];

  const ingredientsOptions: { label: string; value: IngredientsFilter }[] = [
    { label: t("5 or fewer"), value: "0-5" },
    { label: t("6 - 10"), value: "6-10" },
    { label: t("11 - 15"), value: "11-15" },
    { label: t("16+"), value: "16+" },
  ];

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        <Pressable
          className="absolute inset-0 bg-black/50"
          onPress={onClose}
        />

        <View className="rounded-t-[32px] bg-white dark:bg-darkCard overflow-hidden max-h-[88%]">
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 28 }}
            bounces={false}
          >
            {/* Header */}
            <View className="px-5 pt-5 pb-1">
              <View className="flex-row items-center justify-between">
                <View className="w-8" />
                <Text className="text-lg font-bold text-zinc-900 dark:text-white">
                  {t("filter search")}
                </Text>
                <TouchableOpacity
                  onPress={onClose}
                  className="w-8 h-8 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800"
                >
                  <X size={18} color={isDark ? "#D4D4D8" : "#52525B"} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Section 1: Calories */}
            <View className={"mb-6"}>
              <Text className={`text-base font-bold text-zinc-900 dark:text-white mb-3 px-5 ${isArabic ? "text-right" : "text-left"}`}>
                {t("calories")}
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, gap: 10, flexDirection: isArabic ? "row-reverse" : "row"  }}
              >
                {calorieOptions.map((option) => (
                  <FilterChip
                    key={option.value}
                    label={option.label}
                    selected={calorie === option.value}
                    onPress={() =>
                      setCalorie(calorie === option.value ? null : option.value)
                    }
                  />
                ))}
              </ScrollView>
            </View>

            {/* Section 2: Categories */}
            <View className="mb-6">
              <Text className={`text-base font-bold text-zinc-900 dark:text-white mb-3 px-5 ${isArabic ? "text-right" : "text-left"}`}>
                {t("categories")}
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, gap: 10, flexDirection: isArabic ? "row-reverse" : "row" }}
              >
                {categories.map((cat) => (
                  <FilterChip
                    key={cat.key}
                    label={isArabic ? cat.labelAr || cat.label : cat.label}
                    selected={category === cat.key}
                    onPress={() => handleSelectCategory(cat.key)}
                  />
                ))}
              </ScrollView>
            </View>

            {/* Section 3: Ingredients count */}
            <View className="mb-7">
              <Text className={`text-base font-bold text-zinc-900 dark:text-white mb-3 px-5 ${isArabic ? "text-right" : "text-left"}`}>
                {t("number of ingredients")}
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, gap: 10, flexDirection: isArabic ? "row-reverse" : "row" }}
              >
                {ingredientsOptions.map((option) => (
                  <FilterChip
                    key={option.value}
                    label={option.label}
                    selected={ingredients === option.value}
                    onPress={() =>
                      setIngredients(
                        ingredients === option.value ? null : option.value,
                      )
                    }
                  />
                ))}
              </ScrollView>
            </View>

            {/* Action Button */}
            <View className="px-5">
              <TouchableOpacity
                onPress={handleApply}
                style={{ backgroundColor: PRIMARY_ORANGE }}
                className="h-14 rounded-2xl items-center justify-center shadow-lg"
                activeOpacity={0.85}
              >
                <Text className="text-white text-base font-bold tracking-wide">
                  {t("filter")}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const FilterChip = ({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.85}
    className={`px-4 py-2.5 rounded-full border-2 border-primary ${
      selected ? "bg-primary" : "bg-white dark:bg-darkCard"
    }`}
  >
    <Text
      className={`text-sm font-semibold ${
        selected ? "text-white" : "text-primary"
      }`}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

export default FilterBottomSheet;