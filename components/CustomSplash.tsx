import React, { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import { useTheme } from "../store/useTheme";
import { useTranslation } from "react-i18next";

interface CustomSplashProps {
  onFinish?: () => void;
}

export default function CustomSplash({ onFinish }: CustomSplashProps) {
  const [progress, setProgress] = useState(0);
    const { isDark } = useTheme(); 
    const { t } = useTranslation(); // استدعاء الدالة t للترجمة

  useEffect(() => {
    const duration = 2500;
    const start = Date.now();
    let rafId: number;

    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      setProgress(p);
      if (p < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        onFinish?.();
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [onFinish]);

  return (
    <View className="flex-1 bg-[#F2F2F2] dark:bg-[#121212] justify-center items-center px-6">
      {/* الشعار */}
      <Image 
        source={isDark ? require('../assets/images/SplashIconDark.png') : require('../assets/images/SplashIcon.png')} 
        className="w-48 h-48 p-4"
        resizeMode="contain"
      />

      {/* اسم التطبيق والوصف */}
      <Text className="text-4xl font-bold text-primary mt-4 tracking-wide">
        {t('appName')}
      </Text>
      <Text className="text-primary text-center text-sm mt-1 font-medium">
        {t('SplashDescription')}
      </Text>

      {/* منطقة شريط التحميل */}
      <View className="w-52 mt-12 items-center">
        <Text className="text-xs text-center text-primary mb-2 font-medium">
          {t('loading')}
        </Text>

        {/* حاوية الشريط */}
        <View className="w-full h-4 bg-amber-100 dark:bg-darkPrimaryLight rounded-full overflow-hidden p-1 border border-amber-300/30 dark:border-darkPrimary/30">
          {/* الشريط البرتقالي المتحرك */}
          <View 
            className="h-full bg-primary dark:bg-darkPrimary rounded-full" 
            style={{ width: `${progress * 100}%` }}
          />
        </View>
      </View>
    </View>
  );
}
