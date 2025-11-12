import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useNodeHostStore } from "@/hooks/useNodeHostStore";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import type { nodeHost } from "@/types/nodeHost";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Props extends nodeHost {
  showNetwork?: boolean;
  isCustomNodeCard?: boolean;
  showPickButton?: boolean;
}

export const HostCard = ({
  name,
  url,
  isCustomNodeCard = false,
  showNetwork = false,
  showPickButton = false,
  isTestnet,
}: Props) => {
  const { t } = useTranslation();
  const { iconColor } = useAppTheme();
  const { activeNodeHost } = useNodeHostStore();

  const isCurrentActiveNode = activeNodeHost.url === url;

  return (
    <Card>
      <View className="w-full flex flex-row justify-between items-center">
        <View className="flex flex-col gap-1">
          <Text>{name}</Text>
          <Text size="small" color="muted">
            {url}
          </Text>
          {showNetwork && (
            <Text size="small" color="muted">{`${t("settings.node.network")}: ${
              isTestnet ? "Testnet" : "Mainnet"
            }`}</Text>
          )}
        </View>

        {showPickButton && (
          <View className="w-20 flex flex-col items-center justify-center">
            <Ionicons
              name={
                isCurrentActiveNode
                  ? "checkmark-circle"
                  : "checkmark-circle-outline"
              }
              size={20}
              color={
                isCurrentActiveNode ? iconColor.green : iconColor.muted
              }
            />

            <Text size="small" color={isCurrentActiveNode ? "success" : "muted"}>
              {t(
                isCustomNodeCard
                  ? "settings.node.options"
                  : isCurrentActiveNode
                  ? "settings.node.selected"
                  : "settings.node.select"
              )}
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
};
