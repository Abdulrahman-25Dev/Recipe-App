import { useTheme } from "../../store/useTheme";

export type AppLanguage = "ar" | "en";

export function useAppLanguage() {
  const language = useTheme((state) => state.language);
  return { language, isRTL: language === "ar" };
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const camelSuffix = (key: string, lang: AppLanguage) =>
  `${key}${lang === "ar" ? "Ar" : "En"}`;

const resolveLocalized = (
  meal: Record<string, unknown> | null | undefined,
  lang: AppLanguage,
  baseKeys: readonly string[],
  plainFields: readonly string[] = [],
): string => {
  if (!meal) return "";

  const preferred = lang === "ar" ? "ar" : "en";
  const fallback = lang === "ar" ? "en" : "ar";

  for (const key of baseKeys) {
    const field = meal[`${key}_${preferred}`];
    if (isNonEmptyString(field)) return field;
  }

  for (const key of baseKeys) {
    const field = meal[camelSuffix(key, preferred)];
    if (isNonEmptyString(field)) return field;
  }

  for (const key of baseKeys) {
    const obj = meal[key];
    if (obj && typeof obj === "object" && !Array.isArray(obj)) {
      const record = obj as Record<string, unknown>;
      if (isNonEmptyString(record[preferred])) return record[preferred];
      if (isNonEmptyString(record[fallback])) return record[fallback];
    }
  }

  for (const key of baseKeys) {
    if (isNonEmptyString(meal[key])) return meal[key];
  }

  for (const key of plainFields) {
    if (isNonEmptyString(meal[key])) return meal[key];
  }

  for (const key of baseKeys) {
    const field = meal[`${key}_${fallback}`];
    if (isNonEmptyString(field)) return field;
  }

  for (const key of baseKeys) {
    const field = meal[camelSuffix(key, fallback)];
    if (isNonEmptyString(field)) return field;
  }

  return "";
};

export function getLocalizedMealName(
  meal: Record<string, unknown> | null | undefined,
  lang: AppLanguage,
): string {
  return resolveLocalized(meal, lang, ["title", "name"], ["strMeal", "mealName"]);
}

export function getLocalizedCategory(
  meal: Record<string, unknown> | null | undefined,
  lang: AppLanguage,
): string {
  return resolveLocalized(meal, lang, ["category"], ["strCategory"]);
}