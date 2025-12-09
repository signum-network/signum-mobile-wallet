import { View, ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";
import { Text } from "@/components/Text";
import { useAppStore } from "@/hooks/useAppStore";
import { useNodeHostStore } from "@/hooks/useNodeHostStore";
import { useAppTheme } from "@/hooks/useAppTheme";

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
  const { tokens } = useAppTheme();

  if (!isOnline) {
    return (
      <>
        {/* Banner displayed above the overlay */}
        <View
          className="absolute inset-x-0 top-0 z-[1000]"
          pointerEvents="box-none"
        >
          <View
            className="py-2 items-center justify-center"
            style={{
              backgroundColor: tokens.primary,
            }}
          >
            <Text
              className="font-medium text-center"
              color="white"
            >
              {t("youAreOffline")}
            </Text>
          </View>
        </View>

        {/* Overlay blocks interaction and centers the loader */}
        <View
          pointerEvents="auto"
          className="absolute inset-0 z-[999] items-center justify-center"
          style={{
            elevation: 999,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
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

export const Alert = ({ label }: { label: string }) => {
  const { tokens } = useAppTheme();

  return (
    <View
      className="w-full py-2 flex items-center justify-center mb-2"
      style={{
        backgroundColor: tokens.error,
      }}
    >
      <Text
        className="font-medium text-center"
        color="white"
      >
        {label}
      </Text>
    </View>
  );
};
