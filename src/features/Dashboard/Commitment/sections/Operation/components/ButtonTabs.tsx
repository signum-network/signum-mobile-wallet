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
  const { iconColor } = useAppTheme();

  return (
    <View className="flex flex-row items-center justify-center bg-card-foreground dark:bg-card-foreground-dark border border-card-border dark:border-card-border-dark rounded-lg max-w-md mx-auto w-full">
      <Button
        icon={
          <Ionicons
            name="add-circle-outline"
            size={24}
            color={isOperationTypeAdd ? "white" : iconColor.default}
          />
        }
        type={isOperationTypeAdd ? "primary" : undefined}
        title={t("add")}
        extraClassNames="!rounded-r-none w-1/2"
        size="large"
        pressableProps={{ onPress: setAddMode }}
      />

      <Button
        icon={
          <Ionicons
            name="remove-circle-outline"
            size={24}
            color={isOperationTypeRemove ? "white" : iconColor.default}
          />
        }
        type={isOperationTypeRemove ? "primary" : undefined}
        title={t("remove")}
        extraClassNames="!rounded-l-none w-1/2"
        size="large"
        pressableProps={{ onPress: setRemoveMode }}
      />
    </View>
  );
};
