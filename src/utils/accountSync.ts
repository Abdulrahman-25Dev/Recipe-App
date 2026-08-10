import i18n from "../../i18next/i18n";
import { useTheme } from "../../store/useTheme";
import { useFavorites, recipeToMeal } from "../../store/useFavoriteStore";

// تطبيق بيانات الحساب (المفضلة والتفضيلات) على الستورز المحلية بعد الدخول
export const applyAccountData = (me: any) => {
  if (!me) return;

  if (me.favorites) {
    useFavorites.getState().setFavorites(me.favorites.map(recipeToMeal));
  }

  if (me.preferences) {
    const language = me.preferences.language === "en" ? "en" : "ar";
    useTheme.setState({
      isDark: !!me.preferences.isDark,
      language,
    });
    i18n.changeLanguage(language);
  }
};