import { apiClient, extractProfileImageUrl } from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';

// تطبيع بيانات المستخدم عند حدود الـ API:
// مجرد تعيين حقل الصورة من أي مفتاح يرجع به الخادم + تحويل الرابط النسبي إلى مطلق
const sanitizeUser = (user: any) => {
  if (!user) return user;
  return {
    ...user,
    name: user.name ?? '',
    bio: user.bio ?? '',
    profileImage: extractProfileImageUrl(user),
  };
};

// 1. تسجيل الدخول
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await apiClient.post('/users/login', { email, password });
    
    // حفظ التوكن وبيانات المستخدم عند النجاح
    if (response.data.token) {
      await AsyncStorage.setItem('userToken', response.data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(sanitizeUser(response.data.user)));
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
      await AsyncStorage.setItem('userData', JSON.stringify(sanitizeUser(response.data.user)));
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
  return sanitizeUser(response.data.user);
};

// 5. مزامنة التفضيلات (اللغة والثيم) مع الحساب
export const updatePreferencesRemote = async (prefs: {
  language?: 'ar' | 'en';
  isDark?: boolean;
}) => {
  const response = await apiClient.put('/users/me/preferences', prefs);
  return response.data.preferences;
};

// 6. تحديث الملف الشخصي (الاسم، الحالة، صورة البروفايل)
export const updateProfileRemote = async (payload: {
  name: string;
  bio?: string;
  profileImage?: string | null;
}) => {
  const response = await apiClient.patch('/users/me/profile', payload);
  return sanitizeUser(response.data.user);
};

// 6.1 رفع صورة البروفايل إلى الخادم وإرجاع الرابط الدائم (HTTP) بدلاً من المسار المحلي
export const uploadProfileImageRemote = async (imageUri: string): Promise<string> => {
  const formData = new FormData();
  const filename = imageUri.split('/').pop() || `avatar-${Date.now()}.jpg`;
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1].toLowerCase()}` : 'image/jpeg';
  formData.append('image', { uri: imageUri, name: filename, type } as any);

  try {
    const response = await apiClient.post('/users/me/profile-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const url = extractProfileImageUrl(response.data);
    if (!url) {
      throw new Error('لم يُرجع الخادم رابط صورة صالحاً');
    }
    return url;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'فشل رفع الصورة إلى الخادم');
  }
};

// 7. إضافة وصفة للمفضلة في الحساب
export const addFavoriteRemote = async (recipeId: string) => {
  const response = await apiClient.post('/users/me/favorites', { recipeId });
  return response.data.favorites;
};

// 8. حذف وصفة من المفضلة في الحساب
export const removeFavoriteRemote = async (recipeId: string) => {
  const response = await apiClient.delete(`/users/me/favorites/${recipeId}`);
  return response.data.favorites;
};

// 9. حذف جميع المفضلة من الحساب
export const clearFavoritesRemote = async () => {
  const response = await apiClient.delete('/users/me/favorites');
  return response.data.favorites;
};

// 10. حذف الحساب نهائياً
export const deleteAccountRemote = async () => {
  const response = await apiClient.delete('/users/me');
  return response.data;
};