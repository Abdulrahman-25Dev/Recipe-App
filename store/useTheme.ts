import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ThemeState {
    isDark: boolean;
    toggleTheme: () => void;
    language: 'ar' | 'en';
    setLanguage: (lang: 'ar' | 'en') => void;
}

export const useTheme = create<ThemeState>()(
    persist(
        (set) => ({
            isDark: false, // 
            toggleTheme: () => set((state) => ({ isDark: !state.isDark })), // دالة لتبديل الثيم
            language: 'ar', // القيمة الافتراضية هي العربية
            setLanguage: (lang) => set({ language: lang }), // دالة لتغيير اللغة
        }),
        {
            name: "recipe-theme",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);