import { apiClient } from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. تسجيل الدخول
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await apiClient.post('/users/login', { email, password });
    
    // حفظ التوكن وبيانات المستخدم عند النجاح
    if (response.data.token) {
      await AsyncStorage.setItem('userToken', response.data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'فشل الاتصال بالخادم');
  }
};

// 2. إنشاء حساب جديد
export const registerUser = async (name: string, email: string, password: string) => {
  try {
    const response = await apiClient.post('/users/register', { name, email, password });
    
    if (response.data.token) {
      await AsyncStorage.setItem('userToken', response.data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'فشل الاتصال بالخادم');
  }
};

// 3. تسجيل الخروج
export const logoutUser = async () => {
  await AsyncStorage.removeItem('userToken');
  await AsyncStorage.removeItem('userData');
};

// 4. جلب بيانات المستخدم (المفضلة والتفضيلات) من الحساب
export const getMe = async () => {
  const response = await apiClient.get('/users/me');
  return response.data.user;
};

// 5. مزامنة التفضيلات (اللغة والثيم) مع الحساب
export const updatePreferencesRemote = async (prefs: {
  language?: 'ar' | 'en';
  isDark?: boolean;
}) => {
  const response = await apiClient.put('/users/me/preferences', prefs);
  return response.data.preferences;
};

// 6. إضافة وصفة للمفضلة في الحساب
export const addFavoriteRemote = async (recipeId: string) => {
  const response = await apiClient.post('/users/me/favorites', { recipeId });
  return response.data.favorites;
};

// 7. حذف وصفة من المفضلة في الحساب
export const removeFavoriteRemote = async (recipeId: string) => {
  const response = await apiClient.delete(`/users/me/favorites/${recipeId}`);
  return response.data.favorites;
};

// 8. حذف جميع المفضلة من الحساب
export const clearFavoritesRemote = async () => {
  const response = await apiClient.delete('/users/me/favorites');
  return response.data.favorites;
};

// 9. حذف الحساب نهائياً
export const deleteAccountRemote = async () => {
  const response = await apiClient.delete('/users/me');
  return response.data;
};