import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { TextInput } from "react-native-paper";
import { loginUser, getMe } from "../../src/api/authService";
import { applyAccountData } from "../../src/utils/accountSync";
import { useTheme } from "../../store/useTheme";
import { useAlert } from "../../components/CustomAlert";

export default function LoginScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { alert } = useAlert();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("تنبيه", "يرجى كتابة البريد الإلكتروني وكلمة المرور");
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(email, password);
      // تحميل المفضلة والتفضيلات المحفوظة في الحساب
      try {
        const me = await getMe();
        await applyAccountData(me);
      } catch {}
      alert(
        "أهلاً بك! 🍳",
        `تم تسجيل الدخول بنجاح، مرحباً ${data.user.name}`
      );
      router.replace("/(tabs)");
    } catch (error: any) {
      alert("خطأ في الدخول", error.message);
    } finally {
      setLoading(false);
    }
  };

  const activeOutlineColor = "#7A8B42";
  const textColor = isDark ? "#FFFFFF" : "#111827";
  const inputBgColor = isDark ? "#18181B" : "#FFFFFF";

  return (
    <ImageBackground
      source={
        isDark
          ? require("../../assets/images/AuthBackgroundDark.png")
          : require("../../assets/images/AuthBackground.png")
      }
      className="flex-1"
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
          }}
          className="p-6"
        >
          {/* نموذج البيانات */}
          <View className="gap-3">
            <TextInput
              mode="outlined"
              label="البريد الإلكتروني"
              placeholder="example@domain.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              textColor={textColor}
              outlineColor={isDark ? "#3F3F46" : "#E5E7EB"}
              activeOutlineColor={activeOutlineColor}
              style={{ backgroundColor: inputBgColor}}
              right={
                <TextInput.Icon
                  icon="email-outline"
                  color={isDark ? "#A1A1AA" : "#6B7280"}
                />
              }
            />

            <TextInput
              mode="outlined"
              label="كلمة المرور"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              textColor={textColor}
              outlineColor={isDark ? "#3F3F46" : "#E5E7EB"}
              activeOutlineColor={activeOutlineColor}
              style={{ backgroundColor: inputBgColor }}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off-outline" : "eye-outline"}
                  onPress={() => setShowPassword(!showPassword)}
                  color={isDark ? "#A1A1AA" : "#6B7280"}
                />
              }
            />

            {/* زر تسجيل الدخول */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              className="bg-[#7A8B42] py-3.5 rounded-xl items-center mt-3"
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-white text-base font-bold">
                  تسجيل الدخول
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* التنقل لإنشاء حساب */}
          <View className="flex-row justify-center mt-6 gap-1.5">
            <TouchableOpacity onPress={() => router.push("./Register")}>
              <Text className="text-[#7A8B42] font-bold text-md">
                إنشاء حساب جديد
              </Text>
            </TouchableOpacity>
            <Text className="text-gray-500 dark:text-zinc-400 text-md">
              ليس لديك حساب؟
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}