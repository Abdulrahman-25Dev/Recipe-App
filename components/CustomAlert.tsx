import React, { createContext, useCallback, useContext, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import i18n from "../i18next/i18n";

export type AlertButtonStyle = "default" | "destructive" | "cancel";

export type AlertButton = {
  text: string;
  style?: AlertButtonStyle;
  onPress?: () => void;
};

type AlertState = {
  title: string;
  message?: string;
  buttons: AlertButton[];
};

type AlertContextValue = {
  alert: (title: string, message?: string, buttons?: AlertButton[]) => void;
};

const AlertContext = createContext<AlertContextValue>({ alert: () => {} });

export function useAlert() {
  return useContext(AlertContext);
}

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AlertState | null>(null);

  const close = useCallback(() => setState(null), []);

  const alert = useCallback(
    (title: string, message?: string, buttons?: AlertButton[]) => {
      setState({
        title,
        message,
        buttons:
          buttons && buttons.length > 0
            ? buttons
            : [{ text: i18n.t("ok"), onPress: close }],
      });
    },
    [close],
  );

  const isRTL = i18n.language === "ar";

  return (
    <AlertContext.Provider value={{ alert }}>
      {children}
      <Modal
        visible={state !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={close}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white dark:bg-darkCard rounded-2xl p-6 w-full max-w-sm shadow-lg">
            <Text className="text-xl font-bold text-text dark:text-darkText mb-2 text-center">
              {state?.title}
            </Text>
            {state?.message ? (
              <Text className="text-gray-600 dark:text-gray-300 mb-6 text-center text-base">
                {state.message}
              </Text>
            ) : null}
            <View
              className={`gap-3 ${isRTL ? "flex-row-reverse" : "flex-row"} justify-center`}
            >
              {state?.buttons.map((btn, index) => {
                const style =
                  btn.style === "destructive"
                    ? "bg-red-500"
                    : btn.style === "cancel"
                      ? "bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
                      : "bg-[#FD802E]";
                const textStyle =
                  btn.style === "cancel"
                    ? "text-gray-700 dark:text-gray-300"
                    : "text-white";
                return (
                  <Pressable
                    key={index}
                    onPress={() => {
                      close();
                      btn.onPress?.();
                    }}
                    className={`px-5 py-2.5 rounded-lg ${style}`}
                  >
                    <Text className={`text-base ${textStyle}`}>{btn.text}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </AlertContext.Provider>
  );
}