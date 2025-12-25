import {View} from "react-native";
import {useTranslation} from "react-i18next";
import {Address} from "@signumjs/core";
import {Image} from "expo-image";
import {Text} from "@/components/Text";
import {useTicker} from "@/hooks/useTicker";
import {useActiveMarketRate} from "@/hooks/useActiveMarketRate";
import {formatNumber} from "@/utils/formatNumber";
import {signumBlueSymbolPicture} from "@/assets";
import type {ParsedTransaction} from "../../utils/parseTransaction";
import {useNodeHostStore} from "@/hooks/useNodeHostStore";
import {Amount} from "@signumjs/util";
import {TotalAmount, MessageAttachment} from "./components";

interface Props {
    parsed: ParsedTransaction;
}

const MAX_EXPENSES = 10;

export const PaymentPreview = ({parsed}: Props) => {
    const {t} = useTranslation();
    const {NativeTicker} = useTicker();
    const {price, symbol} = useActiveMarketRate();
    const {addressPrefix} = useNodeHostStore()

    const total = parsed.expenses.reduce((acc, expense) => acc.add(expense.amount ?? Amount.Zero()), parsed.fee.clone());
    const hasALotRecipients = parsed.expenses.length > MAX_EXPENSES;
    const cappedExpenses = hasALotRecipients ? parsed.expenses.slice(0, MAX_EXPENSES) : parsed.expenses;

    return (
        <>
            {/* Expenses (Recipients) */}
            {cappedExpenses.map((expense, index) => {
                const amount = expense.amount ? Number(expense.amount.getSigna()) : 0;
                const address = Address.fromNumericId(expense.to, addressPrefix)
                const marketValue = price && amount ? amount * price : 0;

                return (
                    <View key={index} className="w-full flex flex-col gap-1">
                        <View className="w-full flex flex-row items-center justify-between gap-2">

                            <Text color="muted" className="font-bold">
                                {t("recipient")} {parsed.expenses.length > 1 && `#${index + 1}`}
                            </Text>

                            <Text className="font-medium">{address.getReedSolomonAddress()}</Text>
                        </View>

                        {expense.amount && (
                            <View className="flex flex-row items-center justify-end gap-2 w-full mt-2">
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
                                        <Text size="small" color="muted">{`${symbol}${formatNumber({
                                            value: marketValue,
                                            isFiat: true,
                                        })}`}</Text>
                                    )}
                                </View>
                            </View>
                        )}
                    </View>
                );
            })}

            {hasALotRecipients && (
                <View className="w-full flex flex-row justify-center gap-1">
                    <Text color="muted">
                        {t("sign.andMoreRecipients", {count: parsed.expenses.length - MAX_EXPENSES})}
                    </Text>
                </View>
            )}

            <TotalAmount fee={parsed.fee} total={total} />
            <MessageAttachment transaction={parsed.transaction} />

        </>
    );
};
