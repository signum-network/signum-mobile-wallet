import React, { forwardRef, useMemo, useRef, useState } from "react";
import {
  TextInput as NativeTextInput,
  type TextInputProps,
  Platform,
  View,
  Pressable,
  Text,
  type TextStyle,
} from "react-native";
import clsx from "clsx";
import { useAppTheme } from "@/hooks/useAppTheme";

interface Props extends Omit<TextInputProps, "className" | "style"> {
  extraClassNames?: string;
  size?: "small" | "medium" | "large" | "extraLarge";
  style?: TextInputProps["style"];
  clearButtonEnabled?: boolean;
  onClear?: () => void;
}

type SizeDef = { fontSize: number; lineHeight: number; padV: number };

const sizeMap: Record<NonNullable<Props["size"]>, SizeDef> = {
  small: { fontSize: 14, lineHeight: 14, padV: 10 },
  medium: { fontSize: 16, lineHeight: 16, padV: 12 },
  large: { fontSize: 18, lineHeight: 18, padV: 14 },
  extraLarge: { fontSize: 24, lineHeight: 24, padV: 16 },
} as const;

export const TextInput = forwardRef<NativeTextInput, Props>((props, ref) => {
  const { tokens } = useAppTheme();
  const s = sizeMap[props.size ?? "medium"];
  const iosBump = Platform.OS === "ios" ? 1 : 0;
  const isMultiline = !!props.multiline;
  const clearButtonEnabled = props.clearButtonEnabled ?? true;

  const [innerValue, setInnerValue] = useState<string>(
    typeof props.value === "string" ? props.value : ""
  );

  const inputRef = useRef<NativeTextInput>(null);
  React.useImperativeHandle(ref, () => inputRef.current as NativeTextInput);

  // TOKEN COLORS
  const backgroundColor = tokens.surfaceElevated;
  const borderColor = tokens.border;
  const textColor = tokens.text;
  const placeholderColor = tokens.textMuted;

  // Clear button colors
  const iconFg = tokens.textMuted; // X color
  const iconBg = tokens.surface; // circle background

  const classNames = clsx(
    "rounded-lg border w-full",
    props.editable === false && "opacity-80",
    props.extraClassNames
  );

  const baseStyle = useMemo(() => {
    const style: TextStyle = {
      fontSize: s.fontSize,
      paddingVertical: s.padV + iosBump,
      paddingHorizontal: 16,
      flexShrink: 1,
      minWidth: 0,
      maxWidth: "100%",
      paddingRight: 16, // space for clear button
      color: textColor,
      backgroundColor,
      borderColor,
      ...(isMultiline
        ? {
            lineHeight: s.lineHeight + iosBump,
            textAlignVertical: "top" as any,
          }
        : {}),
    };
    return style;
  }, [
    s.fontSize,
    s.padV,
    iosBump,
    isMultiline,
    textColor,
    backgroundColor,
    borderColor,
  ]);

  const {
    style: userStyle,
    onChangeText,
    value,
    editable = true,
    ...rest
  } = props;

  const currentText = typeof value === "string" ? value : innerValue;
  const showClear =
    clearButtonEnabled &&
    editable &&
    !props.secureTextEntry &&
    currentText.length > 0;

  const handleChangeText = (txt: string) => {
    if (typeof value !== "string") setInnerValue(txt);
    onChangeText?.(txt);
  };

  const handleClear = () => {
    if (Platform.OS === "android") inputRef.current?.clear?.();
    if (typeof value !== "string") setInnerValue("");
    onChangeText?.("");
    props.onClear?.();
  };

  return (
    <View className="relative w-full">
      <NativeTextInput
        ref={inputRef}
        className={classNames}
        style={[baseStyle, userStyle]}
        placeholderTextColor={placeholderColor}
        underlineColorAndroid="transparent"
        allowFontScaling={false}
        {...(Platform.OS === "ios"
          ? { clearButtonMode: "never" as const }
          : {})}
        value={value}
        onChangeText={handleChangeText}
        editable={editable}
        {...rest}
      />

      {showClear && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Eingabe löschen"
          onPress={handleClear}
          hitSlop={8}
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: [{ translateY: -12 }],
          }}
        >
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: iconBg,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 18, lineHeight: 18, color: iconFg }}>
              ×
            </Text>
          </View>
        </Pressable>
      )}
    </View>
  );
});

export default TextInput;
