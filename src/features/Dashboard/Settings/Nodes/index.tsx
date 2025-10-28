import { ScrollView, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useNodeHostStore } from "@/hooks/useNodeHostStore";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { KeyboardAvoidingView } from "@/components/Form/KeyboardAvoidingView";
import { AnimatedFadeContainer } from "@/components/AnimatedFadeContainer";
import { DashboardScreenContainer } from "@/features/Dashboard/components/DashboardScreenContainer";
import { CurrentNode } from "./sections/CurrentNode";
import { ManualNodeWizard } from "./sections/ManualNodeWizard";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AppHeader } from "@/components/AppHeader";

export const NodeSettingsScreen = () => {
  const { t } = useTranslation();
  const { iconColor } = useAppTheme();
  const { connectionType, setConnectionType, resetActiveNodeHost } =
    useNodeHostStore();

  const isConnectionTypeAutomatic = connectionType === "automatic";
  const isConnectionTypeManual = connectionType === "manual";

  const setManualMode = () => setConnectionType("manual");
  const setAutomaticMode = () => {
    resetActiveNodeHost();
    setConnectionType("automatic");
  };

  return (
    <>
      <AppHeader title={t("settings.node.title")} />

      <DashboardScreenContainer>
        <View className="flex-1 flex-col items-center w-full gap-4 px-4">
          <View className="flex flex-row items-stretch gap-2 bg-card-foreground dark:bg-card-foreground-dark border border-card-border dark:border-card-border-dark rounded-full max-w-md w-full p-1 overflow-hidden">
            <Button
              icon={
                <Ionicons
                  name="bulb"
                  size={24}
                  color={isConnectionTypeAutomatic ? "white" : iconColor.muted}
                />
              }
              type={isConnectionTypeAutomatic ? "primary" : undefined}
              title={t("settings.node.auto")}
              extraClassNames="flex-1 px-4"
              size="medium"
              titleClassName={
                isConnectionTypeAutomatic
                  ? "text-white"
                  : "text-muted-foreground dark:text-muted-foreground-dark"
              }
              pressableProps={{ onPress: setAutomaticMode }}
            />

            <Button
              icon={
                <Ionicons
                  name="options"
                  size={24}
                  color={isConnectionTypeManual ? "white" : iconColor.muted}
                />
              }
              type={isConnectionTypeManual ? "primary" : undefined}
              title={t("settings.node.manual")}
              extraClassNames="flex-1 px-4"
              size="medium"
              titleClassName={
                isConnectionTypeManual
                  ? "text-white"
                  : "text-muted-foreground dark:text-muted-foreground-dark"
              }
              pressableProps={{ onPress: setManualMode }}
            />
          </View>

          <CurrentNode />

          {isConnectionTypeManual ? (
            <ManualNodeWizard />
          ) : (
            <Text color="muted" className="font-bold text-center">
              {t("settings.node.nodeAutomaticSelected")}
            </Text>
          )}
        </View>
      </DashboardScreenContainer>
    </>
  );
};
