import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
export interface Meal {
  _id?: string;
  idMeal?: string;
  externalId?: string;
  title?: string;
  strMeal?: string;
  strMealThumb?: string;
  strInstructions?: string;
  calories?: number;
  calorieCategory?: "Low" | "Medium" | "High";
  calorieCategoryAr?: "قليلة" | "متوسطة" | "عالية";
  [key: string]: any; // للسماح بأي حقول أخرى تأتي من API
  favorite?: boolean;
  // أضف أي حقول أخرى تحتاجها من API
}

const getMealId = (meal: Meal): string =>
  String(meal._id || meal.idMeal || meal.externalId || "");

interface FavoritesState {
  favorites: Meal[];
  toggleFavorite: (meal: Meal) => void;
  isFavorite: (mealId: string) => boolean;
  clearFavorites: () => void;
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      toggleFavorite: (meal) => {
        const { favorites } = get();
        const mealId = getMealId(meal);
        const isExist =
          mealId !== "" &&
          favorites.some((f) => getMealId(f) === mealId);

        if (isExist) {
          // حذف من المفضلة
          set({
            favorites: favorites.filter((f) => getMealId(f) !== mealId),
          });
        } else {
          // إضافة للمفضلة
          set({
            favorites: [...favorites, meal],
          });
        }
      },
      isFavorite: (mealId) => {
        const { favorites } = get();
        return favorites.some((f) => getMealId(f) === mealId);
      },
      clearFavorites: () => {
        set({ favorites: [] });
      }
    }),
    {
      name: 'recipe-favorites',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);