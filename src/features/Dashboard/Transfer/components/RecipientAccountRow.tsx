import React, { useMemo } from "react";
import { Pressable, View } from "react-native";
import { Text } from "@/components/Text";
import { AccountAvatar } from "@/components/Account/Avatar";
import { Address } from "@signumjs/core";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAccountStore } from "@/hooks/useAccountStore";
import { useNodeHostStore } from "@/hooks/useNodeHostStore";
import { useAppTheme } from "@/hooks/useAppTheme";
import { asRSAddress } from "@/utils/account/asRSAddress";

type Props = {
  publicKey: string;
  walletName: string;
  onSelect: (rs: string) => void;
  selectedRS?: string | null;
  descriptionOverride?: string;
};

export const RecipientAccountRow: React.FC<Props> = ({
  publicKey,
  walletName,
  onSelect,
  selectedRS,
  descriptionOverride,
}) => {
  const { accounts } = useAccountStore();
  const { currentNetwork } = useNodeHostStore();
  const { iconColor } = useAppTheme();

  const account = accounts[publicKey];
  const numericId = useMemo(
    () => Address.fromPublicKey(publicKey).getNumericId(),
    [publicKey]
  );
  const rs = useMemo(() => asRSAddress(numericId), [numericId, currentNetwork]);

  const isSecured = account?.[currentNetwork]?.isSecured === true;
  const description =
    descriptionOverride ?? account?.[currentNetwork]?.description ?? "";
  const avatarLoading =
    !(descriptionOverride && descriptionOverride.length > 0) && !isSecured;
  const isSelected = selectedRS && selectedRS === rs;

  return (
    <Pressable
      onPress={() => onSelect(rs!)}
      className="flex-row items-center justify-between py-3 bg-white dark:bg-card-foreground-dark"
    >
      <View className="flex-1 flex-row items-center gap-4">
        <AccountAvatar
          loading={avatarLoading}
          accountId={numericId}
          description={description}
        />
        <View className="flex-1">
          <Text size="medium" color="content" className="font-medium">
            {walletName}
          </Text>
          <Text size="large" color="muted">
            {rs}
          </Text>
        </View>
      </View>

      {isSelected ? (
        <View className="flex-row items-center gap-1">
          <Ionicons name="checkmark-circle" size={20} color={iconColor.green} />
        </View>
      ) : null}
    </Pressable>
  );
};
