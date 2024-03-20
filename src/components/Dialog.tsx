import { Modal, View } from "react-native";
import type { ChildrenProps } from "@/types/childrenProps";
import { Card } from "@/components/Card";
import { useAppTheme } from "@/hooks/useAppTheme";

interface Props extends ChildrenProps {
  visible: boolean;
  variant: "full" | "transparent";
  onClose?: () => void;
}

export const Dialog = ({ visible, variant, onClose, children }: Props) => {
  const { theme } = useAppTheme();

  const backDropBackgroundColor =
    variant === "transparent" ? "rgba(0,0,0,0.85)" : theme.colors.card;

  return (
    <Modal
      animationType="fade"
      transparent={variant === "transparent"}
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        className="flex flex-1 justify-center items-center px-8"
        style={{ backgroundColor: backDropBackgroundColor }}
      >
        <View className="w-full max-w-lg">
          <Card>{children}</Card>
        </View>
      </View>
    </Modal>
  );
};
