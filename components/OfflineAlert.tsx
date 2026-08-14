import { useEffect, useState } from "react";
import { BackHandler, Modal, Platform, Pressable, Text, View } from "react-native";
import NetInfo from "@react-native-community/netinfo";

export default function OfflineAlert() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const offline =
        state.isConnected === false || state.isInternetReachable === false;
      setIsOffline(offline);
    });
    return unsubscribe;
  }, []);

  const handleOk = () => {
    if (Platform.OS === "android") {
      BackHandler.exitApp();
    }
    // iOS: لا يوجد API رسمي لإنهاء التطبيق، يبقى التنبيه ظاهراً حتى تعود الشبكة
  };

  return (
    <Modal
      visible={isOffline}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {}}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-white dark:bg-darkCard rounded-2xl p-6 w-full max-w-sm shadow-lg">
          <Text className="text-xl font-bold text-text dark:text-darkText mb-2 text-center">
            لا يوجد اتصال بالإنترنت
          </Text>
          <Text className="text-gray-600 dark:text-gray-300 mb-6 text-center text-base">
            يتطلب تطبيق مقادير الاتصال بالإنترنت لتقليب واستكشاف الوصفات من قاعدة
            البيانات.
          </Text>
          <View className="flex-row justify-center">
            <Pressable
              onPress={handleOk}
              className="px-5 py-2.5 rounded-lg bg-[#FD802E]"
            >
              <Text className="text-base text-white">حسناً</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}