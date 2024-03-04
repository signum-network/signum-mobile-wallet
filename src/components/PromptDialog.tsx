import { Modal, View } from "react-native";
import type { ChildrenProps } from "@/types/childrenProps";

interface Props extends ChildrenProps {
  visible: boolean;
  onClose: () => void;
}

export const PromptDialog = ({ visible, onClose, children }: Props) => {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        className="flex flex-1 justify-center items-center"
        style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
      >
        <View className="flex flex-col justify-center items-center bg-white border border-card-border rounded-xl p-4 shadow">
          {children}
        </View>
      </View>
    </Modal>
  );
};
