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
import { registerUser, getMe } from "../../src/api/authService";
import { applyAccountData } from "../../src/utils/accountSync";
import { useTheme } from "../../store/useTheme";
import { useAlert } from "../../components/CustomAlert";

export default function RegisterScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { alert } = useAlert();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("تنبيه", "يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setLoading(true);
    try {
      const data = await registerUser(name, email, password);
      try {
        const me = await getMe();
        await applyAccountData(me);
      } catch {}
      alert(
        "نجاح 🍳",
        `تم إنشاء الحساب بنجاح، أهلاً بك ${data.user.name}`
      );
      router.replace("/(tabs)");
    } catch (error: any) {
      alert("خطأ", error.message);
    } finally {
      setLoading(false);
    }
  };

  const activeOutlineColor = "#FD802E";
  const textColor = isDark ? "#FFFFFF" : "#223D4D";
  const inputBgColor = isDark ? "#1A303D" : "#FFFFFF";

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
              label="اسم المستخدم"
              placeholder="عبدالرحمن"
              value={name}
              onChangeText={setName}
              textColor={textColor}
              outlineColor={isDark ? "#334B5B" : "#E2E8F0"}
              activeOutlineColor={activeOutlineColor}
              style={{ backgroundColor: inputBgColor }}
              right={
                <TextInput.Icon
                  icon="account-outline"
                  color={isDark ? "#94A3B8" : "#64748B"}
                />
              }
            />

            <TextInput
              mode="outlined"
              label="البريد الإلكتروني"
              placeholder="example@domain.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              textColor={textColor}
              outlineColor={isDark ? "#334B5B" : "#E2E8F0"}
              activeOutlineColor={activeOutlineColor}
              style={{ backgroundColor: inputBgColor }}
              right={
                <TextInput.Icon
                  icon="email-outline"
                  color={isDark ? "#94A3B8" : "#64748B"}
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
              outlineColor={isDark ? "#334B5B" : "#E2E8F0"}
              activeOutlineColor={activeOutlineColor}
              style={{ backgroundColor: inputBgColor }}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off-outline" : "eye-outline"}
                  onPress={() => setShowPassword(!showPassword)}
                  color={isDark ? "#94A3B8" : "#64748B"}
                />
              }
            />

            {/* زر إنشاء الحساب */}
            <TouchableOpacity
              onPress={handleRegister}
              disabled={loading}
              className="bg-[#FD802E] py-3.5 rounded-xl items-center mt-3"
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-white text-base font-bold">
                  إنشاء الحساب
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* التنقل لتسجيل الدخول */}
          <View className="flex-row justify-center mt-6 gap-1.5">
            <TouchableOpacity onPress={() => router.push("./Login")}>
              <Text className="text-[#FD802E] font-bold text-md">
                تسجيل الدخول
              </Text>
            </TouchableOpacity>
            <Text className="text-slate-500 dark:text-slate-400 text-md">
              لديك حساب بالفعل؟
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}