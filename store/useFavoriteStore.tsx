import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  addFavoriteRemote,
  removeFavoriteRemote,
  clearFavoritesRemote,
} from '../src/api/authService';
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

const isLoggedIn = async (): Promise<boolean> => {
  try {
    return !!(await AsyncStorage.getItem('userToken'));
  } catch {
    return false;
  }
};

// تحويل وصفة قادمة من السيرفر إلى شكل Meal المستخدم في التطبيق
export const recipeToMeal = (recipe: any): Meal => ({
  _id: recipe._id,
  title: recipe.title,
  titleAr: recipe.titleAr,
  image: recipe.image,
  externalId: recipe.externalId,
  strMeal: recipe.title,
  strMealThumb: recipe.image,
  category: recipe.category,
  categoryAr: recipe.categoryAr,
  country: recipe.country,
  countryAr: recipe.countryAr,
  calories: recipe.calories,
  calorieCategory: recipe.calorieCategory,
  calorieCategoryAr: recipe.calorieCategoryAr,
  ingredients: recipe.ingredients,
  ingredientsAr: recipe.ingredientsAr,
});

interface FavoritesState {
  favorites: Meal[];
  toggleFavorite: (meal: Meal) => void;
  isFavorite: (mealId: string) => boolean;
  clearFavorites: () => void;
  setFavorites: (meals: Meal[]) => void;
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
          isLoggedIn().then((loggedIn) => {
            if (loggedIn) removeFavoriteRemote(mealId).catch(() => {});
          });
        } else {
          // إضافة للمفضلة
          set({
            favorites: [...favorites, meal],
          });
          isLoggedIn().then((loggedIn) => {
            if (loggedIn) addFavoriteRemote(mealId).catch(() => {});
          });
        }
      },
      isFavorite: (mealId) => {
        const { favorites } = get();
        return favorites.some((f) => getMealId(f) === mealId);
      },
      clearFavorites: () => {
        set({ favorites: [] });
        isLoggedIn().then((loggedIn) => {
          if (loggedIn) clearFavoritesRemote().catch(() => {});
        });
      },
      setFavorites: (meals) => {
        set({ favorites: meals });
      },
    }),
    {
      name: 'recipe-favorites',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);