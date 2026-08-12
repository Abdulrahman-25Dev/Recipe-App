import React, { useCallback, useRef, useState } from "react";
import {
  FlatList,
  I18nManager,
  Image,
  ImageSourcePropType,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "../store/useTheme";

const COLORS = {
  primary: "#EA580C",
  dark: {
    background: "#121212",
    textPrimary: "#FFFFFF",
    textSecondary: "#A1A1AA",
    dotInactive: "#3F3F46",
  },
  light: {
    background: "#F2F2F2",
    textPrimary: "#18181B",
    textSecondary: "#71717A",
    dotInactive: "#E4E4E7",
  },
} as const;

interface Slide {
  id: string;
  image: ImageSourcePropType;
  title: string;
  description: string;
}

const SLIDES: Slide[] = [
  {
    id: "step-1",
    image: require("../assets/images/Step1.png"),
    title: "المقادير الصح، السر في الطعم",
    description: "استكشف مئات الوصفات المكتوبة بأسلوب دقيق يضمن نجاح أطباقك.",
  },
  {
    id: "step-2",
    image: require("../assets/images/Step2.png"),
    title: "سرعة، سهولة، وإتقان",
    description: "طريقة تحضير واضحة وبسيطة تحول أي وصفة إلى تجربة ممتعة.",
  },
];

interface SlideViewProps {
  slide: Slide;
  width: number;
}

function SlideView({ slide, width }: SlideViewProps) {
  const { isDark } = useTheme();
  const colors = isDark ? COLORS.dark : COLORS.light;
  return (
    <View
      style={{ width }}
      className="flex-1 items-center justify-center px-8"
    >
      <Image
        source={slide.image}
        resizeMode="contain"
        className="w-[60%] h-[40%] aspect-square mb-6"
      />
      <Text
        className="text-2xl font-bold text-center mb-3"
        style={{ color: colors.textPrimary }}
      >
        {slide.title}
      </Text>
      <Text
        className="text-base text-center leading-6 max-w-md"
        style={{ color: colors.textSecondary }}
      >
        {slide.description}
      </Text>
    </View>
  );
}

interface OnboardingProps {
  onFinish?: () => void;
}

export default function Onboarding({ onFinish }: OnboardingProps) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isDark } = useTheme();
  const colors = isDark ? COLORS.dark : COLORS.light;
  const flatListRef = useRef<FlatList<Slide>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const isLastSlide = currentIndex === SLIDES.length - 1;

  // حساب المؤشر الحالي من إزاحة التمرير مباشرة
  // Math.abs يحمي من القيم السالبة في حالات الـ RTL على أندرويد
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offset = Math.abs(event.nativeEvent.contentOffset.x);
      const index = Math.round(offset / width);
      setCurrentIndex(Math.max(0, Math.min(SLIDES.length - 1, index)));
    },
    [width]
  );

  const getItemLayout = useCallback(
    (_data: ArrayLike<Slide> | null | undefined, index: number) => ({
      length: width,
      offset: width * index,
      index,
    }),
    [width]
  );

  const renderItem = useCallback(
    ({ item }: { item: Slide }) => <SlideView slide={item} width={width} />,
    [width]
  );

  const handleFinish = useCallback(() => {
    if (onFinish) {
      onFinish();
    } else {
      router.replace("../Auth/Login");
    }
  }, [onFinish, router]);

  const handleNext = () => {
    if (isLastSlide) {
      handleFinish();
      return;
    }
    const nextIndex = currentIndex + 1;
    // في وضع RTL تكون الإزاحات سالبة على أندرويد، والعكس في LTR
    // لذلك نحدد الإشارة حسب اتجاه التطبيق حتى يعمل الزر دائماً
    const offset = I18nManager.isRTL
      ? -nextIndex * width
      : nextIndex * width;
    flatListRef.current?.scrollToOffset({ offset, animated: true });
  };

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: colors.background,
        paddingTop: insets.top,
        paddingBottom: Math.max(insets.bottom, 24),
      }}
    >
      {/* زر تخطي */}
      <View className="px-6 pt-2 flex-row justify-end">
        <Pressable
          onPress={handleFinish}
          className="px-3 py-2 active:opacity-60"
          hitSlop={8}
        >
          <Text
            className="text-base font-semibold"
            style={{ color: COLORS.primary }}
          >
            تخطي
          </Text>
        </Pressable>
      </View>

      {/* الشرايح — الاتجاه LTR دائماً لمنع مشاكل الـ RTL في التمرير */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        snapToInterval={width}
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        getItemLayout={getItemLayout}
        className="flex-1"
      />

      {/* المؤشرات والزر السفلي */}
      <View className="px-8 mt-4">
        <View className="flex-row justify-center items-center gap-2 mb-8">
          {SLIDES.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <View
                key={slide.id}
                className={`h-2.5 rounded-full ${isActive ? "w-8" : "w-2.5"}`}
                style={{
                  backgroundColor: isActive
                    ? COLORS.primary
                    : colors.dotInactive,
                }}
              />
            );
          })}
        </View>

        <Pressable
          onPress={handleNext}
          className="h-14 rounded-2xl items-center justify-center active:opacity-80"
          style={{ backgroundColor: COLORS.primary }}
        >
          <Text className="text-lg font-bold text-white">
            {isLastSlide ? "ابدأ الآن" : "التالي"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}