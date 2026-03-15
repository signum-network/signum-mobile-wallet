import {View} from "react-native";
import {Text} from "@/components/Text";
import {Card} from "@/components/Card";
import {TokenAvatar} from "@/components/Token/Avatar";
import {useMemo} from "react";
import {src44} from "@signumjs/standards";
import {useTokenMetadata} from "@/hooks/useTokenMetadata";
import {useTranslation} from "react-i18next";
import {Amount, ChainValue} from "@signumjs/util";
import {useTokenTransactionalData} from "@/hooks/useTokenTransactionalData";
import {useTicker} from "@/hooks/useTicker";
import {formatNumber} from "@/utils/formatNumber";

interface Props {
    tokenId: string
    quantity?: string
}

export function TokenDescriptor({tokenId, quantity = ""}: Props) {
    const {t} = useTranslation();
    const tokenMetadata = useTokenMetadata(tokenId);
    const {priceNQT} = useTokenTransactionalData(tokenId)
    const {NativeTicker} = useTicker()

    const tokenDescription = useMemo(() => {
        try {
            const descriptor = src44.DescriptorData.parse(tokenMetadata.description ?? "")
            return descriptor.description ?? ""
        } catch {
            return tokenMetadata.description ?? ""
        }

    }, [tokenMetadata.description]);

    const value = quantity ? ChainValue.create(tokenMetadata.decimals).setAtomic(quantity).getCompound() : ""
    return <>
        <View className="w-min-full flex flex-col gap-1">
            <Text size="large" color="muted" className="font-bold">
                {t("token")}
            </Text>

            <Card>
                <View className="flex flex-row items-center justify-start gap-2 w-full">
                    <TokenAvatar tokenId={tokenId ?? ""}/>
                    <View className="flex flex-col items-start">
                            <Text className="font-medium">
                                {value ? formatNumber({value: Number(value), maximumFractionDigits: tokenMetadata.decimals}) : ""}
                                &nbsp;{tokenMetadata.ticker}
                            </Text>
                        {priceNQT !== undefined &&
                            <Text size="extraSmall"
                                  color="muted">
                                {formatNumber({value: Number(Amount.fromPlanck(priceNQT).getSigna())})} {NativeTicker}</Text>
                        }
                    </View>
                </View>
                {tokenDescription && (
                    <Text size="small" color="muted">
                        {tokenDescription}
                    </Text>
                )}
            </Card>
        </View>
    </>

}
