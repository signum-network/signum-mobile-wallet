import { View } from "react-native";
import { Text } from "@/components/Text";
import { useQueryAccountResolver } from "@/hooks/useQueryAccountResolver";
import { GenericAccountCard } from "@/components/Account/GenericAccountCard";
import { BurnAccountCard } from "./BurnAccountCard";

interface Props {
    recipient: string;
}


export const ResolvingAccountCard = ({recipient}: Props) => {
  const { account: resolvedAccount, isLoading } = useQueryAccountResolver(recipient);

  // Burn Address - Show BurnAccountCard
  if (recipient === "0" || recipient?.includes("2222-2222-2222-2222")) {
    return <BurnAccountCard onSelect={() => {}} isSelected={true} />;
  }

  // or some loading indicator?
  if (isLoading || !resolvedAccount) return null;

  const resolvedAccountName = resolvedAccount.aliasName ?? resolvedAccount?.name ?? "";

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
