import { useMemo, useEffect } from "react";
import {
  View,
  ActivityIndicator,
  Pressable,
  FlatList,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Image } from "expo-image";
import { signumBlueSymbolPicture } from "@/assets";
import { Text } from "@/components/Text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppTheme } from "@/hooks/useAppTheme";

interface Props {
  label: string;
  complementaryLabel: string;
  errorLabel: string;
  successLabel: string;
  length: number;
  value: string[];
  error: boolean;
  success: boolean;
  disabled?: boolean;
  onChange: (value: string[], submit: boolean) => void;
  onReset: () => void;
}

const areAllItemsFilled = (array: string[]) => array.every((i) => !!i);
const PIN_LEN = 6;

const KEY_SIZE = 68;
const KEY_GAP = 16;
const KEYPAD_PADDING_H = 48;
const SCREEN_PADDING_TOP = 12;
const SCREEN_PADDING_BOTTOM = 24;
const PIN_LINE_WIDTH = 170;
const KEYPAD_WIDTH = KEY_SIZE * 3 + KEY_GAP * 2;

export const PinAuthenticator = ({
  label,
  complementaryLabel,
  errorLabel,
  successLabel,
  value,
  error,
  success,
  disabled = false,
  onChange,
  onReset,
}: Props) => {
  const { t } = useTranslation();
  const { iconColor } = useAppTheme();

  // Normalize the value to 6 slots
  const normalized = useMemo(() => {
    const base = Array.from({ length: PIN_LEN }, () => "");
    (value ?? []).slice(0, PIN_LEN).forEach((c, i) => (base[i] = c ?? ""));
    return base;
  }, [value]);

  const filledCount = normalized.filter(Boolean).length;

  const setValues = (next: string[], submit = false) => onChange(next, submit);

  const pushDigit = (d: string) => {
    if (disabled || success) return;
    if (filledCount >= PIN_LEN) return;

    const next = [...normalized];
    const idx = next.findIndex((c) => !c);
    if (idx === -1) return;

    next[idx] = d;

    const willBeFilled = next.every(Boolean);

    if (willBeFilled) {
      setValues(next, false);
      setTimeout(() => {
        setValues(next, true);
      }, 200); // 200ms delay so that the last point remains visible
    } else {
      setValues(next, false);
    }
  };

  const backspace = () => {
    if (disabled || success) return;
    const next = [...normalized];
    let idx = next.length - 1;
    while (idx >= 0 && !next[idx]) idx--;
    if (idx >= 0) {
      next[idx] = "";
      setValues(next, false);
    }
  };

  // Error/success handling
  useEffect(() => {
    if (areAllItemsFilled(normalized)) {
      if (success) {
      } else if (error) {
        setTimeout(() => {
          const empty = Array.from({ length: PIN_LEN }, () => "");
          onChange(empty, false);
          onReset();
        }, 1200);
      }
    }
  }, [normalized, success, error, onChange, onReset]);

  if (success) {
    return (
      <View className="flex-1 items-center gap-4 pt-16">
        <View className="items-center justify-center gap-4">
          <Ionicons name="checkmark-circle" size={85} color={iconColor.green} />
          <Text className="max-w-xs w-full text-center !text-2xl">
            {successLabel}
          </Text>
          <View className="gap-2 flex flex-row items-center justify-center">
            <ActivityIndicator />
            <Text color="muted">{t("auth.loadingWait")}</Text>
          </View>
        </View>
      </View>
    );
  }

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "<", "0", "OK"];

  return (
    <View
      className="flex-1 bg-white dark:bg-black"
      style={{
        paddingTop: SCREEN_PADDING_TOP,
        paddingBottom: SCREEN_PADDING_BOTTOM,
      }}
    >
      <View className="flex-1 items-center">
        {/* Header */}
        <View className="items-center justify-center gap-2 pt-2">
          <Image
            source={{ uri: signumBlueSymbolPicture }}
            style={{ width: 75, height: 75 }}
          />
          <View className="h-20 justify-center">
            <Text className="max-w-xs w-full text-center !text-2xl">
              {label}
            </Text>
          </View>
        </View>

        {/* Subtext */}
        <Text className="mt-1" color={error ? "error" : "content"}>
          {error ? errorLabel : complementaryLabel}
        </Text>

        {/* Spacer */}
       <View className="flex-1 min-h-12 max-h-24" />

        {/* PIN */}
        <View className="w-full max-w-md mx-auto px-8 items-center mb-4">
          <View
            style={{ width: PIN_LINE_WIDTH - 10 }}
            className="flex-row items-center justify-between my-2 pt-4"
          >
            {Array.from({ length: PIN_LEN }).map((_, i) => {
              const filled = i < filledCount;
              return (
                <View
                  key={i}
                  className={`${
                    filled
                      ? "bg-signum-dark"
                      : "bg-white dark:bg-black dark:border-white/20"
                  } w-5 h-5 rounded-full mb-3`}
                />
              );
            })}
          </View>
          <View
            style={{ width: PIN_LINE_WIDTH }}
            className="h-[1px] bg-black dark:bg-white"
          />
        </View>

        {/* Numpad */}
        <FlatList
          data={keys}
          keyExtractor={(k, i) => `${k}-${i}`}
          numColumns={3}
          scrollEnabled={false}
          contentContainerStyle={{
            alignSelf: "center",
            paddingHorizontal: KEYPAD_PADDING_H,
            paddingBottom: 0,
            paddingTop: 20,
            width: KEYPAD_WIDTH,
          }}
          columnWrapperStyle={{ gap: KEY_GAP, justifyContent: "center" }}
          renderItem={({ item: lbl }) => {
            const isBack = lbl === "<";
            const isOk = lbl === "OK";
            const disabledKey =
              disabled || isOk || (isBack && filledCount === 0);

            const onPress = () => {
              if (isBack) return backspace();
              if (isOk) return; // no action
              pushDigit(lbl);
            };

            return (
              <Pressable
                style={{
                  width: KEY_SIZE,
                  height: KEY_SIZE,
                  marginBottom: KEY_GAP,
                }}
                className={`rounded-full items-center justify-center ${
                  disabledKey ? "opacity-40" : ""
                }`}
                onPress={disabledKey ? undefined : onPress}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel={lbl}
              >
                <Text
                  className="text-2xl"
                  color={disabledKey ? "muted" : "content"}
                >
                  {lbl}
                </Text>
              </Pressable>
            );
          }}
        />

        {disabled && (
          <View className="mt-3 mb-2 gap-2 flex flex-row items-center justify-center">
            <ActivityIndicator />
            <Text color="muted">{t("auth.loadingWait")}</Text>
          </View>
        )}
      </View>
    </View>
  );
};
