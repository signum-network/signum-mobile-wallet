import { useMemo, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  ActivityIndicator,
  Keyboard,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
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

type Nullable<T> = T | null;

const areAllItemsFilled = (array: string[]) => array.every((i) => !!i);

export const PinAuthenticator = ({
  label,
  complementaryLabel,
  errorLabel,
  successLabel,
  length,
  value,
  error,
  success,
  disabled = false,
  onChange,
  onReset,
}: Props) => {
  const { t } = useTranslation();

  const inputRefs = useRef<Array<Nullable<TextInput>>>([]);

  const inputs = useMemo(() => [...new Array(length)], [length]);

  const onChangeValue = (text: string, index: number) => {
    const newValue = value.map((item, i) => (i === index ? text : item));
    onChange(newValue, areAllItemsFilled(newValue));
  };

  const handleChange = (text: string, index: number) => {
    // Ensure only a single character is stored (safety net, even though maxLength=1 is set)
    const char = text?.slice(0, 1) ?? "";
    onChangeValue(char, index);

    if (char.length > 0) {
      // Move focus to the next field when a digit is entered
      inputRefs.current[index + 1]?.focus?.();
    } else if (index > 0) {
      // If empty and not the first, move focus back
      inputRefs.current[index - 1]?.focus?.();
    }
  };

  const handleBackspace = (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    const { nativeEvent } = event;

    if (nativeEvent.key === "Backspace") {
      const current = value[index] ?? "";
      if (current.length === 0 && index > 0) {
        // If current field is already empty -> move focus one position left
        inputRefs.current[index - 1]?.focus?.();
        // Also clear the left field, so it feels natural
        onChangeValue("", index - 1);
      } else {
        // Otherwise just clear the current field
        onChangeValue("", index);
      }
    }
  };

  const resetValues = () => {
    // Reset values but keep refs intact
    const empty = Array.from({ length }, () => "");
    onChange(empty, false);
    // Clear native TextInputs (in case they cached a character)
    inputRefs.current.forEach((ref) => ref?.clear?.());
    // Focus back to the first input
    inputRefs.current[0]?.focus?.();
    onReset();
  };

  useEffect(() => {
    (async () => {
      if (areAllItemsFilled(value)) {
        if (success) {
          Keyboard.dismiss();
        } else if (error) {
          setTimeout(() => {
            //show error message longer
            resetValues();
          }, 1500);
        }
      }
    })();
  }, [value, success, error]);

  const { iconColor } = useAppTheme();

  if (success) {
    return (
      <View className="flex-1 items-center gap-4 pt-16">
        <View className="items-center justify-center gap-4">
          <Ionicons name="checkmark-circle" size={85} color={iconColor.green}/>

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

  return (
    <View className="flex-1 items-center gap-4 pt-4">
      <View className="items-center justify-center gap-2">
        <Image
          source={{ uri: signumBlueSymbolPicture }}
          style={{ width: 75, height: 75 }}
        />
        <View className="h-20 justify-center">
          <Text className="max-w-xs w-full text-center !text-2xl">{label}</Text>
        </View>
      </View>

      <View className="w-full max-w-md mx-auto px-4 flex flex-row items-center justify-center gap-2">
        {inputs.map((_item, index) => (
          <TextInput
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            key={index}
            autoFocus={index === 0}
            className={`text-2xl font-bold text-center w-14 h-14 border rounded-md bg-muted dark:bg-muted-dark border-card-border dark:border-card-border-dark text-black dark:text-white ${
              disabled && "opacity-50"
            }`}
            maxLength={1}
            contextMenuHidden
            selectTextOnFocus
            autoCorrect={false}
            autoComplete="off"
            keyboardType="number-pad"
            secureTextEntry
            testID={`OTPInput-${index}`}
            value={value[index] ?? ""}
            onChangeText={(text) => !disabled && handleChange(text, index)}
            onKeyPress={(event) => !disabled && handleBackspace(event, index)}
          />
        ))}
      </View>

      <Text color={error ? "error" : "content"}>
        {error ? errorLabel : complementaryLabel}
      </Text>

      {disabled && (
        <View className="gap-2 flex flex-row items-center justify-center">
          <ActivityIndicator />
          <Text color="muted">{t("auth.loadingWait")}</Text>
        </View>
      )}
    </View>
  );
};
