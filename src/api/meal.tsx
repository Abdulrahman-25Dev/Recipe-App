import { apiClient } from "./client";

export const getMealsByCategory = async (category: string) => {
  try {
    const response = await apiClient.get(`/recipes/category/${category}`);

    // التحقق هل البيانات مصفوفة أم كائن يحوي مصفوفة
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else if (response.data?.recipes && Array.isArray(response.data.recipes)) {
      return response.data.recipes;
    }
    return [];
  } catch (error: any) {
    console.error("Error fetching meals by category:", error.response?.data || error.message);
    return [];
  }
};

export const getMealById = async (id: string) => {
  try {
    const response = await apiClient.get(`/recipes/${id}`);
    
    // التعامل مع مرونة هيكل البيانات المرجعة
    if (response.data?.data) return response.data.data;
    if (response.data?.recipe) return response.data.recipe;
    return response.data;
  } catch (error: any) {
    console.error("Error fetching meal details:", error.response?.data || error.message);
    return null;
  }
};