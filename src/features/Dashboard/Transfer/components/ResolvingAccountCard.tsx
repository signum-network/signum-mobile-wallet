import { View } from "react-native";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text } from "@/components/Text";
import { useQueryAccountResolver } from "../utils/useQueryAccountResolver";
import { GenericAccountCard } from "@/components/Account/GenericAccountCard";

interface Props {
    recipient: string;
}


export const ResolvingAccountCard = ({recipient}: Props) => {
  const { t } = useTranslation();
  const { account: resolvedAccount, isLoading } = useQueryAccountResolver(recipient);

  // or some loading indicator?
  if (isLoading || !resolvedAccount) return null;

  const resolvedAccountName = resolvedAccount.aliasName ?? resolvedAccount?.name ?? "";
  // Burn Address special design
  if (recipient === "0" || recipient?.includes("2222-2222-2222-2222")) {
    return (
      <View
        className="rounded-xl overflow-hidden"
        style={{
          height: 100,
        }}
      >
        {/* Gradient background for burn address */}
        <View
          className="absolute inset-0"
          style={{
            backgroundColor: "#FF6B35",
          }}
        />

        {/* Content */}
        <View className="relative w-full h-full px-4 flex flex-row items-center gap-3">
          {/* Flame Icon */}
          <View className="size-16 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/40">
            <Ionicons name="flame" size={36} color="white" />
          </View>

          {/* Text Content */}
          <View className="flex-1 gap-1">
            <Text
              color="white"
              className="font-bold"
              size="medium"
              style={{
                textShadowColor: "rgba(0, 0, 0, 0.3)",
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
              }}
            >
              {t("transfer.recipientBurnAddress")}
            </Text>

            <Text
              color="white"
              size="small"
              style={{
                textShadowColor: "rgba(0, 0, 0, 0.3)",
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
              }}
            >
              {t("transfer.recipientBurnAddressHint")}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // GenericAccountCard automatically handles images and status indicators!
  return (
    <GenericAccountCard account={resolvedAccount} height={100}>
      {({ showBackground }) => (
        <>
          {/* Account Name or Alias */}
          {resolvedAccountName && (
            showBackground ? (
              <View className="bg-black/30 rounded-lg px-2 py-1 self-start">
                <Text
                  color="white"
                  className="font-bold"
                  style={{
                    textShadowColor: "rgba(0, 0, 0, 0.75)",
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 3,
                  }}
                >
                  {resolvedAccountName}
                </Text>
              </View>
            ) : (
              <Text color="content" className="font-bold">
                {resolvedAccountName}
              </Text>
            )
          )}

          {/* Address */}
          <Text
            size="small"
            color={showBackground ? "white" : "muted"}
            style={
              showBackground
                ? {
                    textShadowColor: "rgba(0, 0, 0, 0.75)",
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 3,
                  }
                : {}
            }
          >
            {resolvedAccount.accountRS}
          </Text>

          {/* Numeric ID */}
          <Text
            size="extraSmall"
            color={showBackground ? "white" : "muted"}
            style={
              showBackground
                ? {
                    textShadowColor: "rgba(0, 0, 0, 0.75)",
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 3,
                  }
                : {}
            }
          >
            {resolvedAccount.account}
          </Text>
        </>
      )}
    </GenericAccountCard>
  );
};
