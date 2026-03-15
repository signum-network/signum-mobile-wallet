import {View} from "react-native";
import {Text} from "@/components/Text";
import {formatNumber} from "@/utils/formatNumber";
import {Amount} from "@signumjs/util";
import {useTranslation} from "react-i18next";
import {useTicker} from "@/hooks/useTicker";
import {useActiveMarketRate} from "@/hooks/useActiveMarketRate";

type Props  = {
    fee: Amount
    total: Amount
}

export function TotalAmount({fee, total}: Props) {
    const {t} = useTranslation()
    const {NativeTicker} = useTicker()
    const {price: marketPrice, symbol} = useActiveMarketRate();

    const marketValue = Number((marketPrice ? total.clone().multiply(marketPrice) : Amount.Zero()).getSigna());

    return (
        <>
            {/* Fees */}
            <View className="w-full flex flex-row justify-between">
                <Text color="muted" className="font-bold">
                    {t("fees")}
                </Text>
                <Text>
                    {`${formatNumber({value: Number(fee.getSigna())})} ${NativeTicker}`}
                </Text>
            </View>

            {/* Total Amount */}
            <View className="w-full flex flex-row justify-between gap-1">
                <Text size="large" color="muted" className="font-bold">
                    {t("totalValue")}
                </Text>

                <View className="flex flex-col items-end">
                    <Text className="font-medium">
                        {`${formatNumber({value: Number(total.getSigna())})} ${NativeTicker}`}
                    </Text>

                    {marketValue && (
                        <Text size="small" color="muted">
                            {`${symbol}${formatNumber({value: marketValue, isFiat: true})}`}
                        </Text>
                    )}
                </View>
            </View>
        </>
    )

}
