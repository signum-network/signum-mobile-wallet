import { Modal, View } from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const PromptDialog = ({ visible, onClose }: Props) => {
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
      ></View>
    </Modal>
  );
};
