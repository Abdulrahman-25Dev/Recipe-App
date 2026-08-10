import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updatePreferencesRemote } from "../src/api/authService";

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  language: "ar" | "en";
  setLanguage: (lang: "ar" | "en") => void;
}

const syncPreference = (prefs: {
  language?: "ar" | "en";
  isDark?: boolean;
}) => {
  AsyncStorage.getItem("userToken").then((token) => {
    if (token) updatePreferencesRemote(prefs).catch(() => {});
  });
};

export const useTheme = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: false, //
      toggleTheme: () =>
        set((state) => {
          const isDark = !state.isDark;
          syncPreference({ isDark });
          return { isDark };
        }),
      language: "ar", // القيمة الافتراضية هي العربية
      setLanguage: (lang) => {
        set({ language: lang });
        syncPreference({ language: lang });
      },
    }),
    {
      name: "recipe-theme",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
