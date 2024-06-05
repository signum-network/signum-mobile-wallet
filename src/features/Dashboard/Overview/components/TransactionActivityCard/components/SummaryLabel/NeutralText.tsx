import { Text } from "@/components/Text";
import type { TextProps } from "./types";

export const NeutralText = ({ value }: TextProps) => {
  return (
    <Text className="font-bold text-end" size="small" color="muted">
      {value}
    </Text>
  );
};
