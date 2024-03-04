import {
  TextInput as NativeTextInput,
  type TextInputProps,
} from "react-native";
import clsx from "clsx";

interface Props extends TextInputProps {
  extraClassNames?: string;
  size?: "small" | "medium" | "large" | "extraLarge";
}

export const TextInput = (props: Props) => {
  const classNames = clsx([
    "p-2 rounded-lg border border-card-border dark:border-card-border-dark w-full",
    props.editable === false && "opacity-80",
    props.size === "small" && "text-sm",
    props.size === "large" && "text-lg",
    props.size === "extraLarge" && "text-3xl",
    props.extraClassNames && props.extraClassNames,
  ]);

  return (
    <NativeTextInput className={classNames} {...props} contextMenuHidden />
  );
};
