import { useMemo, useRef } from "react";
import {
  View,
  TextInput,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
} from "react-native";

interface Props {
  length: number;
  value: string[];
  disabled: boolean;
  onChange: (value: string[]) => void;
}

type Nullable<T> = T | null;

export const PinAuthenticator = ({
  length,
  value,
  disabled,
  onChange,
}: Props) => {
  const inputRefs = useRef<Array<Nullable<TextInput>>>([]);

  const inputs = useMemo(() => [...new Array(length)], [length]);

  const resetValues = () => {
    if (!inputRefs) return;

    // Reset 4 fields
  };

  const onChangeValue = (text: string, index: number) => {
    const newValue = value.map((item, valueIndex) => {
      if (valueIndex === index) {
        return text;
      }

      return item;
    });

    onChange(newValue);
  };

  const handleChange = (text: string, index: number) => {
    console.log(inputRefs?.current);

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

  return (
    <View className="flex-1 justify-center items-center">
      <View className="w-full max-w-sm mx-auto p-4 flex flex-row items-center justify-around bg-blue-600">
        {inputs.map((item, index) => (
          <TextInput
            ref={(ref) => {
              if (ref && !inputRefs.current.includes(ref)) {
                inputRefs.current = [...inputRefs.current, ref];
              }
            }}
            key={index}
            className="text-2xl font-bold text-center w-11 h-14 bg-white border-2 border-card-border rounded-md"
            maxLength={1}
            contextMenuHidden
            selectTextOnFocus
            editable={!disabled}
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
    </View>
  );
};
