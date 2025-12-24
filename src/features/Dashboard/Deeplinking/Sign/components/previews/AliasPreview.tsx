import {View} from "react-native";
import {useTranslation} from "react-i18next";
import {Image} from "expo-image";
import {Text} from "@/components/Text";
import {Card} from "@/components/Card";
import {useTicker} from "@/hooks/useTicker";
import {useActiveMarketRate} from "@/hooks/useActiveMarketRate";
import {formatNumber} from "@/utils/formatNumber";
import {signumBlueSymbolPicture} from "@/assets";
import type {ParsedTransaction} from "../../utils/parseTransaction";
import {tryGetJSON} from "../../utils/tryGetJson";
import {JsonView} from "@/components/JsonView";

interface Props {
    parsed: ParsedTransaction;
}

export const AliasPreview = ({parsed}: Props) => {
    const {t} = useTranslation();
    const {NativeTicker} = useTicker();
    const {price, symbol} = useActiveMarketRate();

    const feeSigna = Number(parsed.fee.getSigna());
    const feeMarketValue = price ? feeSigna * price : 0;

    const expense = parsed.expenses[0];
    const operationType = parsed.type.i18nKey;

    const isCreation = operationType === "aliasCreation";
    const isBuy = operationType === "aliasBuy";
    const isSell = operationType === "aliasSell";

    const amount = expense.amount ? Number(expense.amount.getSigna()) : 0;
    const marketValue = price && amount ? amount * price : 0;

    const aliasName = parsed.transaction.attachment?.aliasName || "";
    const tld = parsed.transaction.attachment?.tld || "";
    const aliasContent = parsed.transaction.attachment?.aliasURI || "";
    const json = tryGetJSON(aliasContent);

    return (
        <>
            {/* Alias Name */}
            <View className="w-full flex flex-col gap-1">
                <Text size="large" color="muted" className="font-bold">
                    {t("sign.aliasName")}
                </Text>

                <Card>
                    <Text className="font-medium">
                        {aliasName || expense.aliasName || "Unknown"}
                        {tld && <Text color="muted">.{tld}</Text>}
                    </Text>
                </Card>
            </View>

            {/* Alias Content (for creation) */}
            {isCreation && aliasContent && (
                <View className="w-full flex flex-col gap-1">
                    <Text size="large" color="muted" className="font-bold">
                        {json ? t("sign.aliasData") : t("sign.aliasContent")}
                    </Text>

                    {json ? (
                        <Card>
                            <JsonView json={json} />
                        </Card>
                    ) : (
                        <Card>
                            <Text className="font-medium">{aliasContent}</Text>
                        </Card>
                    )}
                </View>
            )}

            {/* Price (for Buy/Sell) */}
            {(isBuy || isSell) && amount > 0 && (
                <View className="w-full flex flex-col gap-1">
                    <Text size="large" color="muted" className="font-bold">
                        {t("sign.price")}
                    </Text>

                    <View className="flex flex-row items-center justify-start gap-2 w-full">
                        <View className="size-10">
                            <Image
                                source={{uri: signumBlueSymbolPicture}}
                                style={{width: "100%", height: "100%", borderRadius: 8}}
                            />
                        </View>

                        <View className="flex-1 flex items-start flex-col gap-1">
                            <Text className="font-medium">
                                {`${formatNumber({value: amount})} ${NativeTicker}`}
                            </Text>

                            {!!marketValue && (
                                <Text size="small" color="muted">
                                    {`${symbol}${formatNumber({value: marketValue, isFiat: true})}`}
                                </Text>
                            )}
                        </View>
                    </View>
                </View>
            )}

            {/* Recipient/Party (for Buy/Sell) */}
            {(isBuy || isSell) && expense.to && (
                <View className="w-full flex flex-col gap-1">
                    <Text size="large" color="muted" className="font-bold">
                        {isBuy ? t("sign.seller") : t("sign.buyer")}
                    </Text>

                    <Card>
                        <Text className="font-medium">{expense.to}</Text>
                    </Card>
                </View>
            )}

            {/* Explanation for Creation */}
            {isCreation && (
                <Card>
                    <Text size="small" color="muted">
                        {t("sign.aliasCreationExplanation")}
                    </Text>
                </Card>
            )}

            {/* Fees */}
            <View className="w-full flex flex-col gap-1">
                <Text size="large" color="muted" className="font-bold">
                    {t("fees")}
                </Text>

                <View className="flex-1 flex items-start flex-col gap-1">
                    <Text className="font-medium">{`${feeSigna} ${NativeTicker}`}</Text>

                    {!!feeMarketValue && (
                        <Text size="small" color="muted">
                            {`${symbol}${formatNumber({value: feeMarketValue})}`}
                        </Text>
                    )}
                </View>
            </View>
        </>
    );
};
