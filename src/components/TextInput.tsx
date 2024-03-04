import {
  useWindowDimensions,
  TextInput as NativeTextInput,
  type TextInputProps,
} from "react-native";
import clsx from "clsx";

interface Props extends Omit<TextInputProps, "className"> {
  extraClassNames?: string;
  size?: "small" | "medium" | "large" | "extraLarge";
}

export const TextInput = (props: Props) => {
  const { width } = useWindowDimensions();

  const classNames = clsx([
    "p-4 rounded-lg border border-card-border dark:border-card-border-dark w-full",
    props.editable === false && "opacity-80",
    props.size === "small" && "text-sm",
    props.size === "large" && "text-lg",
    props.size === "extraLarge" && "text-3xl",
    props.extraClassNames && props.extraClassNames,
  ]);

  const dynamicWidth = width > 335 ? 335 : width * 0.75;

  return (
    <NativeTextInput
      className={classNames}
      {...props}
      contextMenuHidden
      style={{ width: dynamicWidth }}
    />
  );
};
