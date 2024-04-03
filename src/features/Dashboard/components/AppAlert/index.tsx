import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { Text } from "@/components/Text";
import { useAppStore } from "@/hooks/useAppStore";
import { useNodeHostStore } from "@/hooks/useNodeHostStore";

// Detect alerts:
// Offline
// Unsynced node
// Unavailable node
// Using testnet node

export const AppAlert = () => {
  const { t } = useTranslation();
  const { isOnline } = useAppStore();
  const {
    isActiveNodeAvailable,
    isActiveNodeSynced,
    activeNodeSyncedPercentage,
    isTestnet,
    connectionType,
  } = useNodeHostStore();

  if (!isOnline) {
    return (
      <View className="w-full py-2 flex items-center justify-center bg-signum mb-2">
        <Text className="!text-white font-medium text-center">
          {t("youAreOffline")}
        </Text>
      </View>
    );
  }

  if (!isActiveNodeAvailable && connectionType === "manual") {
    return <Alert label={t("nodeUnavailable")} />;
  }

  if (!isActiveNodeSynced && connectionType === "manual") {
    return (
      <Alert
        label={t("unSyncedNode", {
          percentage: activeNodeSyncedPercentage.toFixed(0),
        })}
      />
    );
  }

  if (isTestnet) {
    return <Alert label={t("testnetMode")} />;
  }

  return null;
};

export const Alert = ({ label }: { label: string }) => (
  <View className="w-full py-2 flex items-center justify-center bg-[#FF5724] mb-2">
    <Text className="!text-white font-medium text-center">{label}</Text>
  </View>
);
