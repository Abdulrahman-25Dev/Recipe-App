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