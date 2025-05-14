import { ScrollView, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useNodeHostStore } from "@/hooks/useNodeHostStore";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { KeyboardAvoidingView } from "@/components/Form/KeyboardAvoidingView";
import { AnimatedSlideContainer } from "@/components/AnimatedSlideContainer";
import { DashboardScreenContainer } from "@/features/Dashboard/components/DashboardScreenContainer";
import { CurrentNode } from "./sections/CurrentNode";
import { ManualNodeWizard } from "./sections/ManualNodeWizard";
import Ionicons from "@expo/vector-icons/Ionicons";

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
    <KeyboardAvoidingView>
      <ScrollView>
        <DashboardScreenContainer>
          <View className="flex flex-col items-center justify-center w-full gap-4 px-4">
            <Text size="large" className="font-bold text-center mt-8">
              {t("settings.node.connectionType")}
            </Text>

            <View className="flex flex-row items-center justify-center bg-card-foreground dark:bg-card-foreground-dark border border-card-border dark:border-card-border-dark rounded-lg max-w-md mx-auto w-full">
              <Button
                icon={
                  <Ionicons
                    name="bulb"
                    size={24}
                    color={
                      isConnectionTypeAutomatic ? "white" : iconColor.default
                    }
                  />
                }
                type={isConnectionTypeAutomatic ? "primary" : undefined}
                title={t("settings.node.auto")}
                extraClassNames="!rounded-r-none w-1/2 px-0"
                size="large"
                pressableProps={{ onPress: setAutomaticMode }}
              />

              <Button
                icon={
                  <Ionicons
                    name="options"
                    size={24}
                    color={isConnectionTypeManual ? "white" : iconColor.default}
                  />
                }
                type={isConnectionTypeManual ? "primary" : undefined}
                title={t("settings.node.manual")}
                extraClassNames="!rounded-l-none w-1/2 px-0"
                size="large"
                pressableProps={{ onPress: setManualMode }}
              />
            </View>

            <CurrentNode />

            {isConnectionTypeManual ? (
              <AnimatedSlideContainer>
                <ManualNodeWizard />
              </AnimatedSlideContainer>
            ) : (
              <Text color="muted" className="font-bold text-center">
                {t("settings.node.nodeAutomaticSelected")}
              </Text>
            )}
          </View>
        </DashboardScreenContainer>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
