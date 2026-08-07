import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { TextInput } from "react-native-paper";
import { registerUser } from "../../src/api/authService";
import { useTheme } from "../../store/useTheme";

export default function RegisterScreen() {
  const router = useRouter();
  const { isDark } = useTheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("تنبيه", "يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setLoading(true);
    try {
      const data = await registerUser(name, email, password);
      Alert.alert(
        "نجاح 🍳",
        `تم إنشاء الحساب بنجاح، أهلاً بك ${data.user.name}`
      );
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("خطأ", error.message);
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
          <View className="gap-2">
            <TextInput
              mode="outlined"
              label="اسم المستخدم"
              placeholder="عبدالرحمن"
              value={name}
              onChangeText={setName}
              textColor={textColor}
              outlineColor={isDark ? "#3F3F46" : "#E5E7EB"}
              activeOutlineColor={activeOutlineColor}
              style={{ backgroundColor: inputBgColor, textAlign: "right" }}
              left={
                <TextInput.Icon
                  icon="account-outline"
                  color={isDark ? "#A1A1AA" : "#6B7280"}
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
              outlineColor={isDark ? "#3F3F46" : "#E5E7EB"}
              activeOutlineColor={activeOutlineColor}
              style={{ backgroundColor: inputBgColor, textAlign: "right" }}
              left={
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
              style={{ backgroundColor: inputBgColor, textAlign: "right" }}
              left={
                <TextInput.Icon
                  icon={showPassword ? "eye-off-outline" : "eye-outline"}
                  onPress={() => setShowPassword(!showPassword)}
                  color={isDark ? "#A1A1AA" : "#6B7280"}
                />
              }
            />

            {/* زر إنشاء الحساب */}
            <TouchableOpacity
              onPress={handleRegister}
              disabled={loading}
              className="bg-[#7A8B42] py-3.5 rounded-xl items-center mt-2.5"
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
            <TouchableOpacity onPress={() => router.push("/Auth/Login")}>
              <Text className="text-[#7A8B42] font-bold text-md">
                تسجيل الدخول
              </Text>
            </TouchableOpacity>
            <Text className="text-gray-500 dark:text-zinc-400 text-md">
              لديك حساب بالفعل؟
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}