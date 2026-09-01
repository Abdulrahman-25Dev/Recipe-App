import { create } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  "https://maqadeer-backend.onrender.com/api"; 

const ASSETS_BASE_URL = BASE_URL.replace(/\/api\/?$/, "");

// تحويل رابط الصورة إلى رابط مطلق صالح للعرض، وإرجاع null للروابط المحلية المكسورة
export const toAbsoluteImageUrl = (url?: string | null): string | null => {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  // مسارات الأجهزة المحلية (file://, content://, data:, ...) لا تدوم بعد مسح البيانات
  if (/^(file|content|data|ph|blob|assets):/i.test(trimmed)) return null;
  // مسار نسبي مثل /uploads/image.png → أضف قاعدة الـ API
  return `${ASSETS_BASE_URL}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
};

// استخراج رابط صورة البروفايل الطبيعي من أي شكل يعيده الخادم
export const extractProfileImageUrl = (obj: any): string | null => {
  if (!obj || typeof obj !== "object") return null;
  const candidates = [
    "profileImage",
    "profile_image",
    "avatar",
    "imageUrl",
    "image_url",
    "photo",
    "image",
    "url",
  ];
  for (const key of candidates) {
    const value = obj[key];
    if (typeof value === "string" && value.trim()) {
      return toAbsoluteImageUrl(value);
    }
  }
  if (obj.user && typeof obj.user === "object") {
    return extractProfileImageUrl(obj.user);
  }
  return null;
};

export const apiClient = create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
