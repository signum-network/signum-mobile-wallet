import {
  TextInput as NativeTextInput,
  type TextInputProps,
} from "react-native";
import clsx from "clsx";
import { useColorScheme } from "react-native";

interface Props extends Omit<TextInputProps, "className"> {
  extraClassNames?: string;
  size?: "small" | "medium" | "large" | "extraLarge";
}

export const TextInput = (props: Props) => {

  const scheme = useColorScheme();

  const classNames = clsx([
    "p-4 rounded-lg border border-card-border dark:border-card-border-dark w-full bg-muted dark:bg-muted-dark color-black dark:color-white",
    props.editable === false && "opacity-80",
    props.size === "small" && "text-sm",
    props.size === "large" && "text-lg",
    props.size === "extraLarge" && "text-3xl",
    props.extraClassNames && props.extraClassNames,
  ]);

return (
    <NativeTextInput
      className={classNames}
      style={{
        flexShrink: 1,    
        minWidth: 0,       
        maxWidth: "100%",  
      }}         
      contextMenuHidden={false}    
      placeholderTextColor={scheme === "dark" ? "#A1A1AA" : "#71717A"}
      {...props}
    />
  );
};
