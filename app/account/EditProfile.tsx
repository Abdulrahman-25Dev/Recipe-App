import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import i18n from "../../i18next/i18n";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ChevronLeft, ChevronRight, User2, Camera } from "lucide-react-native";
import { useAlert } from "../../components/CustomAlert";
import { updateProfileRemote, uploadProfileImageRemote } from "../../src/api/authService";

export default function EditProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { alert } = useAlert();
  const isRTL = i18n.language === "ar";

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // يمنع قراءة البيانات المحفوظة من إعادة ضبط الصورة التي اختارها المستخدم للتو
  const didPickImageRef = useRef(false);
  // الصورة الأصلية المحملة من التخزين لاكتشاف إن تغيّرت أثناء الجلسة
  const originalProfileImageRef = useRef<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("userData")
      .then((data) => {
        if (data) {
          const user = JSON.parse(data);
          setUsername(user.name || "");
          setBio(user.bio || t("welcome to your own kitchen"));
          if (!didPickImageRef.current) {
            originalProfileImageRef.current = user.profileImage || null;
            setProfileImage(user.profileImage || null);
          }
        } else {
          setBio(t("welcome to your own kitchen"));
        }
      })
      .catch(() => {
        setBio(t("welcome to your own kitchen"));
      });
  }, [t]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]?.uri) {
        didPickImageRef.current = true;
        setProfileImage(result.assets[0].uri);
      }
    } catch {
      alert(t("error"), t("photo pick failed"));
    }
  };

  const handleSave = async () => {
    if (!username.trim()) {
      alert(t("error"), t("please enter username"));
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. إذا كانت الصورة محلية (من منتقي الصور)، ارفعها للخادم أولاً
      //    للحصول على رابط HTTP دائم بدلاً من مسار file:// الذي يختفي بمسح البيانات
      let finalImageUrl: string | null = profileImage;
      if (profileImage && !/^https?:\/\//i.test(profileImage)) {
        finalImageUrl = await uploadProfileImageRemote(profileImage);
      }

      const updatedUser = {
        name: username.trim(),
        bio: bio.trim(),
        profileImage: finalImageUrl,
      };

      // 2. تحديث الخادم وحفظ الرابط الدائم محلياً من استجابة الخادم
      const savedUser = await updateProfileRemote(updatedUser);
      const raw = await AsyncStorage.getItem("userData");
      const user = raw ? JSON.parse(raw) : {};
      await AsyncStorage.setItem(
        "userData",
        JSON.stringify({ ...user, ...updatedUser, ...(savedUser || {}) }),
      );

      alert(
        t("edit profile"),
        profileImage !== originalProfileImageRef.current
          ? t("profile image updated")
          : t("profile updated"),
      );
      router.back();
    } catch (error: any) {
      alert(t("error"), error?.message || "");
      router.back();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#fffdfa] dark:bg-darkBackground"
    >
      {/* الهيدر: زر الرجوع + العنوان */}
      <View className="relative flex-row items-center justify-center py-4 mt-10">
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          className={`absolute ${isRTL ? "right-4" : "left-4"} w-10 h-10 items-center justify-center rounded-full bg-white dark:bg-darkCard border border-[#f0e6d6] dark:border-gray-800`}
        >
          {isRTL ? (
            <ChevronRight size={22} color="#FF8A00" />
          ) : (
            <ChevronLeft size={22} color="#FF8A00" />
          )}
        </Pressable>
        <Text className="text-lg font-bold text-[#4a2c11] dark:text-darkText">
          {t("edit profile")}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="pb-10"
      >
        {/* قسم الصورة الشخصية */}
        <View className="items-center mt-6">
          <View className="w-32 h-32 rounded-full bg-white dark:bg-darkCard border-[3px] border-[#d97706]/30 items-center justify-center overflow-hidden">
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                className="w-full h-full"
                resizeMode="cover"
                onError={() => setProfileImage(null)}
              />
            ) : (
              <User2 size={52} color="#d97706" />
            )}
          </View>

          <TouchableOpacity
            onPress={pickImage}
            className="mt-4 flex-row items-center gap-2 bg-[#d97706]/10 px-4 py-2.5 rounded-full"
          >
            <Camera size={18} color="#d97706" />
            <Text className="text-[#d97706] font-semibold">
              {t("change photo")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* حقول النموذج */}
        <View className="px-6 mt-8 gap-5">
          <View className="gap-2">
            <Text className={`text-sm font-semibold text-[#4a2c11] dark:text-darkText ${isRTL ? "text-right" : "text-left"}`}>
              {t("username")}
            </Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder={t("username")}
              placeholderTextColor="#b8a88f"
              className={`bg-white dark:bg-darkBackground rounded-2xl border border-[#ece2d2] dark:border-gray-800 p-4 text-base text-[#4a2c11] dark:text-darkText ${isRTL ? "text-right" : "text-left"}`}
            />
          </View>

          <View className="gap-2">
            <Text className={`text-sm font-semibold text-[#4a2c11] dark:text-darkText ${isRTL ? "text-right" : "text-left"}`}>
              {t("kitchen motto")}
            </Text>
            <TextInput
              value={bio}
              onChangeText={setBio}
              maxLength={60}
              multiline
              numberOfLines={3}
              placeholder={t("welcome to your own kitchen")}
              placeholderTextColor="#b8a88f"
              className={`bg-white dark:bg-darkBackground rounded-2xl border border-[#ece2d2] dark:border-gray-800 p-4 text-base text-[#4a2c11] dark:text-darkText min-h-[100px] ${isRTL ? "text-right" : "text-left"}`}
              style={{ textAlignVertical: "top" }}
            />
            <Text className={`text-xs text-gray-400 dark:text-gray-500 ${isRTL ? "text-right" : "text-left"}`}>
              {bio.length}/60
            </Text>
          </View>
        </View>

        {/* زر الحفظ */}
        <View className="px-6 mt-8">
          <TouchableOpacity
            onPress={handleSave}
            disabled={isSubmitting}
            className="bg-[#d97706] py-4 rounded-2xl items-center justify-center"
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white text-base font-bold">
                {t("save changes")}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}