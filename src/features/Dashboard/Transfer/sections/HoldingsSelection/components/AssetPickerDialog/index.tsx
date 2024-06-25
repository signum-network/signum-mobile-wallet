import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { FlashList } from "@shopify/flash-list";
import { useAccount } from "@/hooks/useAccount";
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
  } = useAccount();

  return (
    <Dialog variant="transparent" visible={visible} onClose={onClose}>
      <View
        style={{
          width: "100%",
          height: "98%",
          gap: 8,
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Text className="font-medium">{t("transfer.pickAnAsset")}</Text>

        <View
          style={{
            flex: 1,
            flexGrow: 1,
            minHeight: ITEM_HEIGHT,
            width: "100%",
          }}
        >
          <AssetCard
            asset=""
            balanceQNT=""
            unconfirmedBalanceQNT=""
            isSigna
            signaAvailableBalance={signaAvailableBalance}
          />

          <FlashList
            data={tokenBalance}
            keyExtractor={({ asset }) => asset}
            renderItem={({ item }) => <AssetCard {...item} />}
            estimatedItemSize={ITEM_HEIGHT}
          />
        </View>

        <Button
          icon={<Ionicons name="close" size={24} color="white" />}
          wide
          title={t("cancel")}
          type="error"
          pressableProps={{ onPress: onClose }}
        />
      </View>
    </Dialog>
  );
};
