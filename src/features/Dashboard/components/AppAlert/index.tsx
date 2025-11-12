import { View, ActivityIndicator } from "react-native";
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
      <>
        {/* Banner displayed above the overlay */}
        <View
          className="absolute inset-x-0 top-0 z-[1000]"
          pointerEvents="box-none"
        >
          <View className="py-2 items-center justify-center bg-signum">
            <Text className="!text-white font-medium text-center">
              {t("youAreOffline")}
            </Text>
          </View>
        </View>

        {/* Overlay blocks interaction and centers the loader */}
        <View
          pointerEvents="auto"
          className="absolute inset-0 z-[999] bg-black/50 items-center justify-center"
          style={{ elevation: 999 }} // wichtig für Android-Z-Order
        >
          <ActivityIndicator size={84} />
        </View>
      </>
    );
  }

  if (!isActiveNodeAvailable && connectionType === "manual") {
    return <Alert label={t("nodeUnavailable")} />;
  }

  // TODO: Once SignumJS has improved the selectBestHost method, add the following conditional: connectionType === "manual"
  if (!isActiveNodeSynced) {
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
