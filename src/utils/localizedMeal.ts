import { useTheme } from "../../store/useTheme";

export type AppLanguage = "ar" | "en";

export function useAppLanguage() {
  const language = useTheme((state) => state.language);
  return { language, isRTL: language === "ar" };
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const OBJECT_FIELDS = ["title", "name"] as const;
const PLAIN_FIELDS = ["title", "name", "strMeal", "mealName"] as const;

export function getLocalizedMealName(
  meal: Record<string, unknown> | null | undefined,
  lang: AppLanguage,
): string {
  if (!meal) return "";

  const preferred = lang === "ar" ? "ar" : "en";
  const fallback = lang === "ar" ? "en" : "ar";

  for (const key of OBJECT_FIELDS) {
    const field = meal[`${key}_${preferred}`];
    if (isNonEmptyString(field)) return field;
  }

  for (const key of OBJECT_FIELDS) {
    const obj = meal[key];
    if (obj && typeof obj === "object" && !Array.isArray(obj)) {
      const record = obj as Record<string, unknown>;
      if (isNonEmptyString(record[preferred])) return record[preferred];
      if (isNonEmptyString(record[fallback])) return record[fallback];
    }
  }

  for (const key of OBJECT_FIELDS) {
    const field = meal[`${key}_${fallback}`];
    if (isNonEmptyString(field)) return field;
  }

  for (const key of PLAIN_FIELDS) {
    if (isNonEmptyString(meal[key])) return meal[key];
  }

  return "";
}