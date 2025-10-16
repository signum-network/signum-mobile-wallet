import { Fragment, useState, useMemo } from "react";
import { View, Pressable, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { FlashList } from "@shopify/flash-list";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useNodeHostStore } from "@/hooks/useNodeHostStore";
import { HorizontalDivider } from "@/components/HorizontalDivider";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import type { nodeHost } from "@/types/nodeHost";
import { HostCard } from "../../components/HostCard";
import { AddNodeDialog } from "./components/AddNodeDialog";
import Ionicons from "@expo/vector-icons/Ionicons";

export const ManualNodeWizard = () => {
  const { t } = useTranslation();
  const { iconColor } = useAppTheme();
  const {
    reliableNodeHost,
    testnetReliableNodeHost,
    customNodeHost,
    setActiveNodeHost,
    removeCustomNode,
  } = useNodeHostStore();

  const [nodeGroup, setNodeGroup] = useState<"mainnet" | "testnet" | "custom">(
    "mainnet"
  );
  const setNodeGroupMainnet = () => setNodeGroup("mainnet");
  const setNodeGroupTestnet = () => setNodeGroup("testnet");
  const setNodeGroupCustom = () => setNodeGroup("custom");

  const isNodeGroupCustom = nodeGroup === "custom";

  const nodeHostList = useMemo(() => {
    switch (nodeGroup) {
      case "mainnet":
        return reliableNodeHost;

      case "testnet":
        return testnetReliableNodeHost;

      default:
        return customNodeHost;
    }
  }, [nodeGroup, reliableNodeHost, testnetReliableNodeHost, customNodeHost]);

  const updateActiveNode = (value: nodeHost) => {
    if (isNodeGroupCustom) {
      Alert.alert(
        t("settings.node.customNodeOptions"),
        t("settings.node.customNodeOptionsDescription", { name: value.name }),
        [
          {
            text: t("cancel"),
            style: "cancel",
          },
          {
            text: t("delete"),
            onPress: () => {
              removeCustomNode(value.name);
              alert(t("settings.node.customNodeRemoved"));
            },
            style: "destructive",
          },
          {
            text: t("settings.node.useThisCustomNode"),
            onPress: () => {
              setActiveNodeHost(value);
              alert(t("settings.node.switchedNode"));
            },
            isPreferred: true,
          },
        ],
        {
          cancelable: true,
        }
      );
    } else {
      setActiveNodeHost(value);
      alert(t("settings.node.switchedNode"));
    }
  };

  return (
    <Fragment>
      <HorizontalDivider />

      <View className="w-full flex flex-col items-center gap-4">
        <Text size="large" className="font-medium">
          {t("settings.node.selectANode")}
        </Text>

        <View className="flex flex-row items-center justify-center bg-card-foreground dark:bg-card-foreground-dark border border-card-border dark:border-card-border-dark rounded-lg max-w-md mx-auto w-full">
          <Button
            type={nodeGroup === "mainnet" ? "primary" : undefined}
            title="Mainnet"
            extraClassNames="!rounded-r-none w-4/12"
            titleClassName={
              nodeGroup === "mainnet"
                ? "text-white"
                : "text-muted-foreground dark:text-muted-foreground-dark"
            }
            pressableProps={{ onPress: setNodeGroupMainnet }}
          />

          <Button
            type={nodeGroup === "testnet" ? "primary" : undefined}
            title="Testnet"
            extraClassNames="w-4/12"
            titleClassName={
              nodeGroup === "testnet"
                ? "text-white"
                : "text-muted-foreground dark:text-muted-foreground-dark"
            }
            pressableProps={{ onPress: setNodeGroupTestnet }}
          />

          <Button
            type={nodeGroup === "custom" ? "primary" : undefined}
            title={t("settings.node.custom")}
            extraClassNames="!rounded-l-none w-4/12"
            titleClassName={
              nodeGroup === "custom"
                ? "text-white"
                : "text-muted-foreground dark:text-muted-foreground-dark"
            }
            pressableProps={{ onPress: setNodeGroupCustom }}
          />
        </View>
      </View>

      {isNodeGroupCustom && <AddNodeDialog />}

      <View
        style={{
          flex: 1,
          flexGrow: 1,
          minHeight: 200,
          width: "100%",
        }}
      >
        <FlashList
          data={nodeHostList}
          keyExtractor={({ url }) => url}
          renderItem={({ item }) => (
            <Pressable
              className="active:opacity-80 ripple-[#333] ripple-bordered rounded-xl w-full mt-4"
              onPress={() => updateActiveNode(item)}
            >
              <HostCard
                {...item}
                showNetwork={isNodeGroupCustom}
                isCustomNodeCard={isNodeGroupCustom}
                showPickButton
              />
            </Pressable>
          )}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center gap-2 py-8">
              <Ionicons
                name="server"
                size={50}
                color={iconColor.default}
                className="opacity-50"
              />

              <Text
                className="max-w-xs w-full text-center font-medium"
                size="large"
              >
                {t("settings.node.noCustomNode")}
              </Text>

              <View className="gap-2 flex flex-row items-center justify-center">
                <Text color="muted">
                  {t("settings.node.noCustomNodeDescription")}
                </Text>
              </View>
            </View>
          }
        />
      </View>
    </Fragment>
  );
};
