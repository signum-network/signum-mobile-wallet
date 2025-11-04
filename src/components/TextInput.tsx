import { forwardRef } from "react";
import {
  TextInput as NativeTextInput,
  type TextInputProps,
  Platform
} from "react-native";
import clsx from "clsx";
import { useColorScheme } from "react-native";

interface Props extends Omit<TextInputProps, "className" | "style"> {
  extraClassNames?: string;
  size?: "small" | "medium" | "large" | "extraLarge";
  style?: TextInputProps["style"];
}

type SizeDef = { fontSize: number; lineHeight: number; padV: number };
const sizeMap: Record<NonNullable<Props["size"]>, SizeDef> = {
  small: { fontSize: 14, lineHeight: 14, padV: 12 },
  medium: { fontSize: 16, lineHeight: 16, padV: 14 },
  large: { fontSize: 18, lineHeight: 18, padV: 16 },
  extraLarge: { fontSize: 24, lineHeight: 24, padV: 18 },
} as const;

export const TextInput = forwardRef<NativeTextInput, Props>((props, ref) => {
  const scheme = useColorScheme();
  const s = sizeMap[props.size ?? "medium"];
  const iosBump = Platform.OS === "ios" ? 1 : 0;
  const isMultiline = !!props.multiline;

  const classNames = clsx([
    "rounded-lg border border-card-border dark:border-card-border-dark w-full bg-muted dark:bg-muted-dark",
    "text-black dark:text-white",
    props.editable === false && "opacity-80",
    props.extraClassNames,
  ]);

  const baseStyle = {
    fontSize: s.fontSize,
    paddingVertical: s.padV + iosBump,
    paddingHorizontal: 16,
    flexShrink: 1,
    minWidth: 0,
    maxWidth: "100%",
    ...(isMultiline
      ? { lineHeight: s.lineHeight + iosBump, textAlignVertical: "top" as any }
      : {}),
  } as const;

  const { style: userStyle, ...rest } = props;

  return (
    <NativeTextInput
      ref={ref}
      className={classNames}
      // Styles MERGEN: first Defaults, then userStyle
      style={[baseStyle, userStyle]}
      placeholderTextColor={scheme === "dark" ? "#A1A1AA" : "#71717A"}
      underlineColorAndroid="transparent"
      allowFontScaling={false}
      {...rest}
    />
  );
});
