import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { Text } from "@/components/Text";
import { formatNumber } from "@/utils/formatNumber";
import { TokenAvatar } from "@/components/Token/Avatar";
import { Image } from "expo-image";
import { signumBlueSymbolPicture } from "@/assets";

interface Props {
  asset: string;
  isAssetSigna: boolean;
  readableTicker: string;
  readableAvailableBalance: number;
  avatarIpfsHash: string | null;
}

export const AvailableBalanceSummary = ({
  asset,
  isAssetSigna,
  readableTicker,
  readableAvailableBalance,
  avatarIpfsHash,
}: Props) => {
  const { t } = useTranslation();

  return (
    <View className="flex flex-row gap-2 items-center justify-start flex-1">
      {isAssetSigna ? (
        <View className="size-10">
          <Image
            source={{ uri: signumBlueSymbolPicture }}
            style={{ width: "100%", height: "100%", borderRadius: 8 }}
          />
        </View>
      ) : (
        <TokenAvatar
          loading={!readableTicker}
          tokenId={asset}
          avatarIpfsHash={avatarIpfsHash || undefined}
          extraClassNames="size-10"
        />
      )}

      <View className="flex flex-col">
        <Text className="font-medium">
          {t("transfer.assetAvailableBalanceHint", { ticker: readableTicker })}
        </Text>

        <Text size="large" color="muted">
          {formatNumber({
            value: readableAvailableBalance,
          })}
        </Text>
      </View>
    </View>
  );
};
