import i18n from "../../i18next/i18n";
import { useTheme } from "../../store/useTheme";
import { useFavorites, recipeToMeal } from "../../store/useFavoriteStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { extractProfileImageUrl } from "../api/client";

// تطبيق بيانات الحساب (المفضلة والتفضيلات وبيانات البروفايل) على الستورز المحلية بعد الدخول
export const applyAccountData = async (me: any) => {
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

  // مزامنة بيانات البروفايل (الاسم، الحالة، صورة البروفايل) مع التخزين المحلي
  // حتى تظهر صورة البروفايل بعد تسجيل الدخول من جديد (مسح بيانات التطبيق)
  try {
    const raw = await AsyncStorage.getItem("userData");
    const user = raw ? JSON.parse(raw) : {};

    const remoteImage = extractProfileImageUrl(me) ?? null;

    await AsyncStorage.setItem(
      "userData",
      JSON.stringify({
        ...user,
        name: me.name ?? user.name ?? "",
        bio: me.bio ?? user.bio ?? "",
        profileImage: remoteImage ?? user.profileImage ?? null,
      }),
    );
  } catch {}
};