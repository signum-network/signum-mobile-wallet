import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { FlashList } from "@shopify/flash-list";
import { useWalletAccount } from "@/hooks/useWalletAccount";
import { Dialog } from "@/components/Dialog";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { ITEM_HEIGHT, AssetCard } from "./components/AssetCard";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Props {
  visible: boolean;
  onClose?: () => void;
  signaAvailableBalance: number;
}

export const AssetPickerDialog = ({
  visible,
  onClose,
  signaAvailableBalance,
}: Props) => {
  const { t } = useTranslation();
  const {
    accountData: { tokenBalance },
  } = useWalletAccount();

  const maxVisibleTokenRows = 6;
  const rowsToShow = Math.min(tokenBalance.length, maxVisibleTokenRows);
  const listHeight = Math.max(ITEM_HEIGHT, rowsToShow * ITEM_HEIGHT);

  return (
    <Dialog variant="transparent" visible={visible} onClose={onClose}>
      <View
        style={{
          width: "100%",
          gap: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Text className="font-medium">{t("transfer.pickAnAsset")}</Text>
        <View style={{ width: "100%" }}>
          <AssetCard
            asset=""
            balanceQNT=""
            unconfirmedBalanceQNT=""
            isSigna
            signaAvailableBalance={signaAvailableBalance}
          />
        </View>
        <View
          style={{
            width: "100%",
            height: listHeight,
          }}
        >
          <FlashList
            data={tokenBalance}
            keyExtractor={({ asset }) => asset}
            renderItem={({ item }) => <AssetCard {...item} />}
          />
        </View>
        <Button
          icon={<Ionicons name="close" size={24} color="white" />}
          wide
          title={t("cancel")}
          type="error"
          pressableProps={{ onPress: onClose }}
          extraClassNames="mt-6"
        />
      </View>
    </Dialog>
  );
};
