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
import { useAudioPlayer } from "expo-audio";
import Ionicons from "@expo/vector-icons/Ionicons";

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

const successAudioSource = require("../../../assets/audio/success-ringtone.mp3");
const errorAudioSource = require("../../../assets/audio/error-ringtone.mp3");

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

  const successAudio = useAudioPlayer(successAudioSource);
  const errorAudio = useAudioPlayer(errorAudioSource);

  const inputRefs = useRef<Array<Nullable<TextInput>>>([]);

  const inputs = useMemo(() => [...new Array(length)], [length]);

  const resetValues = async () => {
    if (!inputRefs || !inputRefs?.current) return;

    inputRefs.current.map((ref, index) => {
      if (!ref || !ref.focus) return;
      if (index === 0) ref.focus();
      ref.clear();
      onChangeValue("", index);
    });

    onReset();
  };

  const onChangeValue = (text: string, index: number) => {
    const newValue = value.map((item, valueIndex) => {
      if (valueIndex === index) {
        return text;
      }

      return item;
    });

    onChange(newValue, areAllItemsFilled(newValue));
  };

  const handleChange = (text: string, index: number) => {
    onChangeValue(text, index);

    if (text.length !== 0) {
      return inputRefs?.current[index + 1]?.focus();
    }

    return inputRefs?.current[index - 1]?.focus();
  };

  const handleBackspace = (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    const { nativeEvent } = event;

    if (nativeEvent.key === "Backspace") {
      handleChange("", index);
    }
  };

  const playSuccessSound = () => {
    successAudio.volume = 0.5;
    successAudio.seekTo(0);
    successAudio.play();
  };

  const playErrorSound = () => {
    errorAudio.volume = 0.5;
    errorAudio.seekTo(0.55);
    errorAudio.play();
  };

  useEffect(() => {
    (async () => {
      if (areAllItemsFilled(value)) {
        if (success) {
          playSuccessSound();
          inputRefs.current = [];
          Keyboard.dismiss();
        } else if (error) {
          playErrorSound();
          resetValues();
        }
      }
    })();
  }, [value, success, error]);

  if (success) {
    return (
      <View className="flex-1 justify-center items-center gap-4">
        <View className="items-center justify-center gap-4">
          <Ionicons name="checkmark-circle" size={85} color="green" />

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
    <View className="flex-1 justify-center items-center gap-4">
      <View className="items-center justify-center gap-2">
        <Image
          source={{ uri: signumBlueSymbolPicture }}
          style={{ width: 75, height: 75 }}
        />

        <Text className="max-w-xs w-full text-center !text-2xl">{label}</Text>
      </View>

      <View className="w-full max-w-md mx-auto px-4 flex flex-row items-center justify-center gap-2">
        {inputs.map((_item, index) => (
          <TextInput
            ref={(ref) => {
              if (ref && !inputRefs.current.includes(ref)) {
                inputRefs.current = [...inputRefs.current, ref];
              }
            }}
            key={index}
            autoFocus={index === 0}
            className={`text-2xl font-bold text-center w-14 h-14 border rounded-md bg-white border-card-border dark:border-card-border-dark ${
              disabled && "opacity-50"
            }`}
            maxLength={1}
            contextMenuHidden
            selectTextOnFocus
            autoCorrect={false}
            autoComplete="off"
            keyboardType="decimal-pad"
            secureTextEntry
            testID={`OTPInput-${index}`}
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
