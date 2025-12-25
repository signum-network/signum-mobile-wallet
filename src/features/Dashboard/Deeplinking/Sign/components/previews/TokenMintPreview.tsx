import {View} from "react-native";
import {useTranslation} from "react-i18next";
import type {Transaction} from "@signumjs/core";
import {ChainValue} from "@signumjs/util";
import {Text} from "@/components/Text";
import {useTokenMetadata} from "@/hooks/useTokenMetadata";
import {formatNumber} from "@/utils/formatNumber";
import type {ParsedTransaction} from "../../utils/parseTransaction";
import {TokenDescriptor, TotalAmount, AccountDescriptor} from "./components"

interface Props {
    transaction: Transaction;
    parsed: ParsedTransaction;
}

export const TokenMintPreview = ({transaction, parsed}: Props) => {
    const {t} = useTranslation();
    const expense = parsed.expenses[0];
    const tokenMetadata = useTokenMetadata(expense.tokenId);

    // Format token quantity with decimals
    const quantity = expense.quantity || "0";
    const formattedQuantity = ChainValue.create(tokenMetadata.decimals)
        .setAtomic(quantity)
        .getCompound();

    return (
        <>
            {/* Token Being Minted */}
            <TokenDescriptor tokenId={expense.tokenId ?? ""}/>

            {/* Mint Quantity */}
            <View className="w-full flex flex-col gap-1">
                <Text size="large" color="muted" className="font-bold">
                    {t("sign.mintingQuantity") }
                </Text>
                <Text className="font-medium">
                    {formatNumber({value: Number(formattedQuantity)})} {tokenMetadata.ticker ?? ""}
                </Text>
            </View>

            {/* Recipient */}
            <View className="w-full flex flex-col gap-1">
                <Text size="large" color="muted" className="font-bold">
                    {t("issuer")}
                </Text>
                <AccountDescriptor accountId={transaction.sender}/>
            </View>

            <TotalAmount fee={parsed.fee} total={parsed.fee}/>
        </>
    );
};
