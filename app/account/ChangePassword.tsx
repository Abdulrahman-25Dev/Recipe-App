import React, { useState } from "react";
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
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, KeyRound, ChevronLeft, ChevronRight } from "lucide-react-native";
import i18n from "../../i18next/i18n";
import { useAlert } from "../../components/CustomAlert";
import { changePasswordRemote } from "../../src/api/authService";

const COLORS = {
  bg: "#223D4D",
  card: "#1A303D",
  accent: "#FD802E",
  white: "#FFFFFF",
  muted: "#94A3B8",
  border: "#334B5B",
};

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { alert } = useAlert();
  const { t } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleUpdate = async () => {
    if (!currentPassword) {
      alert(t("notice"), t("enter current password"));
      return;
    }
    if (newPassword.length < 6) {
      alert(t("notice"), t("password min length"));
      return;
    }
    if (newPassword !== confirmPassword) {
      alert(t("notice"), t("passwords not match"));
      return;
    }

    setSaving(true);
    try {
      await changePasswordRemote(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      alert(t("success"), t("password changed"), [
        { text: t("ok"), onPress: () => router.back() },
      ]);
    } catch (error: any) {
      alert(t("error"), error.message);
    } finally {
      setSaving(false);
    }
  };

  const inputBase = {
    backgroundColor: COLORS.card,
    color: COLORS.white,
    borderColor: COLORS.border,
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      style={{ backgroundColor: COLORS.bg }}
    >
      {/* الهيدر: زر الرجوع + العنوان */}
      <View className="relative flex-row items-center justify-center py-4 mt-10">
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          className={`absolute ${isRTL ? "right-4" : "left-4"} w-10 h-10 items-center justify-center rounded-full bg-[#1A303D] border border-[#334B5B]`}
        >
          {isRTL ? (
            <ChevronRight size={22} color="#FD802E" />
          ) : (
            <ChevronLeft size={22} color="#FD802E" />
          )}
        </Pressable>
        <Text className="text-lg font-bold text-white">{t("change password")}</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        className="flex-1"
      >
        <View className="px-6 pt-10">
          {/* الترويسة */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 rounded-full bg-[#1A303D] border border-[#334B5B] items-center justify-center mb-5">
              <KeyRound size={36} color="#FD802E" />
            </View>
            <Text className="text-2xl font-bold text-white mb-2">
              {t("change password")}
            </Text>
            <Text className="text-base text-center" style={{ color: COLORS.muted }}>
              {t("password change subtitle")}
            </Text>
          </View>

          {/* الحقول */}
          <View className="gap-5 mb-6">
            <View className="gap-2">
              <Text
                className={`text-sm font-semibold text-white ${isRTL ? "text-right" : "text-left"}`}
              >
                {t("current password")}
              </Text>
              <View className="flex-row items-center rounded-2xl border px-4" style={inputBase}>
                <TextInput
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="••••••••"
                  placeholderTextColor={COLORS.muted}
                  secureTextEntry={!showCurrent}
                  className={`flex-1 py-4 pr-3 text-base text-white ${isRTL ? "text-right" : "text-left"}`}
                />
                <Pressable onPress={() => setShowCurrent(!showCurrent)} hitSlop={8}>
                  {showCurrent ? (
                    <EyeOff size={20} color={COLORS.muted} />
                  ) : (
                    <Eye size={20} color={COLORS.muted} />
                  )}
                </Pressable>
              </View>
            </View>

            <View className="gap-2">
              <Text
                className={`text-sm font-semibold text-white ${isRTL ? "text-right" : "text-left"}`}
              >
                {t("new password")}
              </Text>
              <View className="flex-row items-center rounded-2xl border px-4" style={inputBase}>
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="••••••••"
                  placeholderTextColor={COLORS.muted}
                  secureTextEntry={!showNew}
                  className={`flex-1 py-4 pr-3 text-base text-white ${isRTL ? "text-right" : "text-left"}`}
                />
                <Pressable onPress={() => setShowNew(!showNew)} hitSlop={8}>
                  {showNew ? (
                    <EyeOff size={20} color={COLORS.muted} />
                  ) : (
                    <Eye size={20} color={COLORS.muted} />
                  )}
                </Pressable>
              </View>
            </View>

            <View className="gap-2">
              <Text
                className={`text-sm font-semibold text-white ${isRTL ? "text-right" : "text-left"}`}
              >
                {t("confirm new password")}
              </Text>
              <View
                className="flex-row items-center rounded-2xl border px-4"
                style={{
                  backgroundColor: COLORS.card,
                  borderColor:
                    confirmPassword && confirmPassword !== newPassword
                      ? "#EF4444"
                      : COLORS.border,
                }}
              >
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="••••••••"
                  placeholderTextColor={COLORS.muted}
                  secureTextEntry={!showConfirm}
                  className={`flex-1 py-4 pr-3 text-base text-white ${isRTL ? "text-right" : "text-left"}`}
                />
                <Pressable onPress={() => setShowConfirm(!showConfirm)} hitSlop={8}>
                  {showConfirm ? (
                    <EyeOff size={20} color={COLORS.muted} />
                  ) : (
                    <Eye size={20} color={COLORS.muted} />
                  )}
                </Pressable>
              </View>
              {confirmPassword && confirmPassword !== newPassword && (
                <Text
                  className={`text-xs mt-1 ${isRTL ? "text-right" : "text-left"}`}
                  style={{ color: "#EF4444" }}
                >
                  {t("passwords not match")}
                </Text>
              )}
            </View>
          </View>

          {/* زر التحديث */}
          <TouchableOpacity
            onPress={handleUpdate}
            disabled={saving}
            className="rounded-2xl py-4 items-center justify-center"
            style={{ backgroundColor: COLORS.accent }}
          >
            {saving ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text className="text-white text-base font-bold">
                {t("update password")}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}