import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useNodeHostStore } from "@/hooks/useNodeHostStore";
import { Text } from "@/components/Text";
import { HostCard } from "../../components/HostCard";

export const CurrentNode = () => {
  const { t } = useTranslation();
  const { activeNodeHost } = useNodeHostStore();

  return (
    <View className="w-full flex flex-col items-center gap-2">
      <Text size="large" className="font-medium">
        {t("settings.node.currentSelectedNode")}
      </Text>

      <HostCard {...activeNodeHost} showNetwork />
    </View>
  );
};
