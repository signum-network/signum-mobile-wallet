import {View} from "react-native";
import {useTranslation} from "react-i18next";
import {Amount, ChainValue} from "@signumjs/util";
import {Text} from "@/components/Text";
import type {ParsedTransaction} from "../../utils/parseTransaction";
import {
    AccountDescriptor,
    MessageAttachment, TokenDescriptor,
    TotalAmount,
    SignaDescriptor
} from "./components";
import {useTokenTransactionalData} from "@/hooks/useTokenTransactionalData";
import {useTokenMetadata} from "@/hooks/useTokenMetadata";
import {useTicker} from "@/hooks/useTicker";

interface Props {
    parsed: ParsedTransaction;
}

export const TokenTransferPreview = ({parsed}: Props) => {
    const {t} = useTranslation();
    const {NativeTicker} = useTicker();
    const totalSigna = parsed.fee.clone();
    const recipient = parsed.expenses[0].to; // only one recipient for (multi) token transfer
    return (
        <View className="w-full flex flex-col gap-2">
            <Text size="large" color="muted" className="font-bold">
                {t("recipient")}
            </Text>
            <AccountDescriptor accountId={recipient}/>

            {/* Tokens Being Transferred */}
            {parsed.expenses.map((expense, index) => {
                const {priceNQT} = useTokenTransactionalData(expense.tokenId);
                const {decimals } = useTokenMetadata(expense.tokenId);
                const quantity = expense.quantity || "0";
                if (priceNQT && decimals !== undefined ) {
                    const value = ChainValue.create(decimals).setAtomic(quantity).getCompound()
                    const price = Amount.fromPlanck(priceNQT).multiply(Number(value));
                    totalSigna.add(price)
                }
                if (expense.amount !== undefined) {
                    totalSigna.add(expense.amount)
                }

                return (
                    <View key={index} className="w-min-full flex flex-col gap-1">
                        {expense.amount
                            ? (<SignaDescriptor amount={expense.amount}/>)
                            : (<TokenDescriptor tokenId={expense.tokenId || "0"} quantity={quantity}/>)
                        })

                    </View>
                )
            })}
            <View className="mt-2 relative">
                <TotalAmount fee={parsed.fee} total={totalSigna}/>
                <View className="absolute top-[46px] w-full text-right">
                    <Text size="extraSmall" color="muted">{(t("sign.plusTokens", {ticker: NativeTicker}))}</Text>
                </View>
                <MessageAttachment transaction={parsed.transaction}/>
            </View>

        </View>
    )
}
