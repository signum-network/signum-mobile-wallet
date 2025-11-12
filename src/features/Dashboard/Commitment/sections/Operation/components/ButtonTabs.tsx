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
    <View className="flex flex-row items-stretch gap-2 bg-card-foreground dark:bg-card-foreground-dark border border-card-border dark:border-card-border-dark rounded-full max-w-md w-full p-1 overflow-hidden">
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
        titleClassName={
          isOperationTypeAdd
            ? "text-white"
            : "text-muted-foreground dark:text-muted-foreground-dark"
        }
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
        titleClassName={
          isOperationTypeRemove
            ? "text-white"
            : "text-muted-foreground dark:text-muted-foreground-dark"
        }
        pressableProps={{ onPress: setRemoveMode }}
      />
    </View>
  );
};
