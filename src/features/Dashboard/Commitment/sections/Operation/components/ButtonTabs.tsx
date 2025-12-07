import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Button } from "@/components/Button";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Props {
  isOperationTypeAdd: boolean;
  isOperationTypeRemove: boolean;
  setAddMode: () => void;
  setRemoveMode: () => void;
}

export const ButtonTabs = ({
  isOperationTypeAdd,
  isOperationTypeRemove,
  setAddMode,
  setRemoveMode,
}: Props) => {
  const { t } = useTranslation();
  const { iconColor, tokens } = useAppTheme();

  return (
    <View
      className="flex flex-row items-stretch gap-2 rounded-full max-w-md w-full p-1 overflow-hidden border"
      style={{
        backgroundColor: tokens.surface,
        borderColor: tokens.border,
      }}
    >
      <Button
        icon={
          <Ionicons
            name="add-circle-outline"
            size={24}
            color={isOperationTypeAdd ? "white" : iconColor.muted}
          />
        }
        type={isOperationTypeAdd ? "primary" : undefined}
        title={t("add")}
        extraClassNames="flex-1 px-4"
        size="medium"
        titleClassName="font-medium"
        pressableProps={{ onPress: setAddMode }}
      />
      <Button
        icon={
          <Ionicons
            name="remove-circle-outline"
            size={24}
            color={isOperationTypeRemove ? "white" : iconColor.muted}
          />
        }
        type={isOperationTypeRemove ? "primary" : undefined}
        title={t("remove")}
        extraClassNames="flex-1 px-4"
        size="medium"
        titleClassName="font-medium"
        pressableProps={{ onPress: setRemoveMode }}
      />
    </View>
  );
};
