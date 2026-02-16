export const getMealsByCategory = async (category: string) => {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`,
  );
  const data = await res.json();
  return data.meals;
};

export const getMealById = async (id: string) => {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
  );
  const data = await res.json();
  return data.meals && data.meals.length > 0 ? data.meals[0] : null;
};
