import {View} from "react-native";
import {useTranslation} from "react-i18next";
import {Amount, ChainValue, convertAssetPriceToPlanck} from "@signumjs/util";
import {Text} from "@/components/Text";
import {Card} from "@/components/Card";
import {useTicker} from "@/hooks/useTicker";
import {useTokenMetadata} from "@/hooks/useTokenMetadata";
import {formatNumber} from "@/utils/formatNumber";
import type {ParsedTransaction} from "../../utils/parseTransaction";
import {TokenDescriptor} from "@/components/TokenDescriptor";
import {MessageAttachment} from "@/components/MessageAttachment";
import {TotalAmount} from "@/components/TotalAmount";

interface Props {
    parsed: ParsedTransaction;
}

export const OrderPreview = ({parsed}: Props) => {
    const {t} = useTranslation();
    const {NativeTicker} = useTicker();
    const expense = parsed.expenses[0];
    const tokenMetadata = useTokenMetadata(expense.tokenId);

    const orderType = parsed.type.i18nKey;
    const isCancel =
        orderType === "cancelSaleOrder" || orderType === "cancelBuyOrder";
    const isBuy = orderType === "createBuyOrder";

    // Format token quantity with decimals
    const quantity = expense.quantity || "0";
    const formattedQuantity = ChainValue.create(tokenMetadata.decimals)
        .setAtomic(quantity)
        .getCompound();

    // Price is in NQT per token quantum
    const priceNQT = convertAssetPriceToPlanck(expense.price || "0", tokenMetadata.decimals);
    const pricePerToken = Amount.fromPlanck(priceNQT); // Convert NQT to SIGNA

    // Total order value
    const total = pricePerToken.clone().multiply(Number(formattedQuantity)).add(parsed.fee);

    return (
        <>
            {/* Token */}
            <TokenDescriptor tokenId={expense.tokenId ?? ""} />

            {/* Order Details (for create orders) */}
            {!isCancel && (
                <>
                    <View className="w-full flex flex-col gap-1">
                        <Text size="large" color="muted" className="font-bold">
                            {t("sign.orderDetails")}
                        </Text>

                        <Card>
                            <View className="flex-row w-full justify-between">
                                <View className="">
                                    <Text size="small" color="muted">
                                        {t("sign.quantity")}
                                    </Text>
                                    <Text className="font-medium">
                                        {formatNumber({value: Number(formattedQuantity)})}
                                    </Text>
                                </View>

                                <View className="flex flex-col items-end">
                                    <Text size="small" color="muted">
                                        {t("sign.pricePerToken")}
                                    </Text>
                                    <Text className="font-medium">
                                        {`${formatNumber({value: pricePerToken.getSigna()})} ${NativeTicker}`}
                                    </Text>
                                </View>
                            </View>
                        </Card>
                    </View>
                </>
            )}

            {/* Cancellation Notice */}
            {isCancel && (
                <Card>
                    <Text size="small" color="muted">
                        {isBuy
                            ? t("sign.buyOrderCancelExplanation")
                            : t("sign.sellOrderCancelExplanation")}
                    </Text>
                </Card>
            )}

            <MessageAttachment transaction={parsed.transaction} />
            <TotalAmount fee={parsed.fee} total={total} />
        </>
    );
};
