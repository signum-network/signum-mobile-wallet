import { useMemo, useRef, useState, useEffect } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";

interface Props {
  label: string;
  complementaryLabel: string;
  errorLabel: string;
  successLabel: string;
  length: number;
  value: string[];
  error: boolean;
  success: boolean;
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
  onChange,
  onReset,
}: Props) => {
  const { t } = useTranslation();

  const [successSound, setSuccessSound] = useState<Audio.Sound>();
  const [errorSound, setErrorSound] = useState<Audio.Sound>();

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

  const playSuccessSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../../../assets/audio/success-ringtone.mp3")
    );

    setSuccessSound(sound);
    await sound.playAsync();
  };

  const playErrorSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../../../assets/audio/error-ringtone.mp3"),
      { positionMillis: 550 }
    );

    setErrorSound(sound);
    await sound.playAsync();
  };

  useEffect(() => {
    return successSound
      ? () => {
          successSound.unloadAsync();
        }
      : undefined;
  }, [successSound]);

  useEffect(() => {
    return errorSound
      ? () => {
          errorSound.unloadAsync();
        }
      : undefined;
  }, [errorSound]);

  useEffect(() => {
    (async () => {
      if (areAllItemsFilled(value)) {
        if (success) {
          inputRefs.current = [];
          Keyboard.dismiss();
          await playSuccessSound();
        } else {
          await resetValues();
          await playErrorSound();
        }
      }
    })();
  }, [value]);

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

      <View className="w-full max-w-md mx-auto px-4 flex flex-row items-center justify-between">
        {inputs.map((_item, index) => (
          <TextInput
            ref={(ref) => {
              if (ref && !inputRefs.current.includes(ref)) {
                inputRefs.current = [...inputRefs.current, ref];
              }
            }}
            key={index}
            autoFocus={index === 0}
            className="text-2xl font-bold text-center w-14 h-14 border-2 rounded-md bg-white border-card-border dark:border-card-border-dark"
            maxLength={1}
            contextMenuHidden
            selectTextOnFocus
            autoCorrect={false}
            autoComplete="off"
            keyboardType="decimal-pad"
            secureTextEntry
            testID={`OTPInput-${index}`}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(event) => handleBackspace(event, index)}
          />
        ))}
      </View>

      <Text color={error ? "error" : "content"}>
        {error ? errorLabel : complementaryLabel}
      </Text>
    </View>
  );
};
