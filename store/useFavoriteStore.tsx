import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
export interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb?: string;
  strInstructions?: string;
  [key: string]: any; // للسماح بأي حقول أخرى تأتي من API
  favorite?: boolean;
  // أضف أي حقول أخرى تحتاجها من API
}

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
        const isExist = favorites.some((f) => f.idMeal === meal.idMeal);

        if (isExist) {
          // حذف من المفضلة
          set({ 
            favorites: favorites.filter((f) => f.idMeal !== meal.idMeal) 
          });
        } else {
          // إضافة للمفضلة
          set({ 
            favorites: [...favorites, meal] 
          });
        }
      },
      isFavorite: (mealId) => {
        const { favorites } = get();
        return favorites.some((f) => f.idMeal === mealId);
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