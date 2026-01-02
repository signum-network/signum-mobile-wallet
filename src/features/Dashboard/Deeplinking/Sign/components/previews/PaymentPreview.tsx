import {View} from "react-native";
import {useTranslation} from "react-i18next";
import {Text} from "@/components/Text";
import type {ParsedTransaction} from "../../utils/parseTransaction";
import {Amount} from "@signumjs/util";
import type {Account, Transaction} from "@signumjs/core";
import {AccountDescriptor} from "@/components/AccountDescriptor";
import {SignaDescriptor} from "@/components/SignaDescriptor";
import {TotalAmount} from "@/components/TotalAmount";
import {MessageAttachment} from "@/components/MessageAttachment";
import {NftDescriptor} from "@/components/NftDescriptor";
import {useQueryAccount} from "@/hooks/useQueryAccount";


interface Props {
    parsed: ParsedTransaction;
}

const MAX_VISIBLE_EXPENSES = 10;

export const PaymentPreview = ({parsed}: Props) => {
    const {t} = useTranslation();
    const total = parsed.expenses.reduce((acc, expense) => acc.add(expense.amount ?? Amount.Zero()), parsed.fee.clone());
    const hasALotRecipients = parsed.expenses.length > MAX_VISIBLE_EXPENSES;
    const cappedExpenses = hasALotRecipients ? parsed.expenses.slice(0, MAX_VISIBLE_EXPENSES) : parsed.expenses;

    return (
        <>
            {cappedExpenses.map((expense, index) => {
                const {data: account} = useQueryAccount(expense.to)

                return (
                    <View key={index} className="w-full flex flex-col gap-1">
                        <Text color="muted" className="font-bold">
                            {t("recipient")} {parsed.expenses.length > 1 && `#${index + 1}`}
                        </Text>
                        {account?.name === "NFTSRC40" ? (
                            <NftInteractionPreview transaction={parsed.transaction} nft={account}/>
                        ) : (<AccountDescriptor accountId={expense.to}/>)}
                        <SignaDescriptor amount={expense.amount}/>
                    </View>
                );
            })}

            {hasALotRecipients && (
                <View className="w-full flex flex-row justify-center gap-1">
                    <Text color="muted">
                        {t("sign.andMoreRecipients", {count: parsed.expenses.length - MAX_VISIBLE_EXPENSES})}
                    </Text>
                </View>
            )}

            <TotalAmount fee={parsed.fee} total={total}/>
            <MessageAttachment transaction={parsed.transaction}/>

        </>
    );
};

const MethodCodes: Record<string, string> = {
    "707d900b3ccb4b1b": "nft.makeOffer",
    "f73399e063539a73": "nft.acceptOffer",
    "c3b307ab635f8689": "nft.cancelOffer",
    "c8aea1c25fe7bffe": "nft.like",
    "698ede1f1575c5eb": "nft.putForAuction",
    "eb961e4db130b406": "nft.putForSale",
    "6f31852e3487b4eb": "nft.putNotForSale",
    "8de4fb9913399063": "nft.transferRoyalties",
    "17f898a0f498d090": "nft.transferOwnership"
}

const getOperationName = (transaction: Transaction) => {
    const methodHash = transaction.attachment?.message?.slice(0, 16);
    if (!methodHash) return "nft.pay"
    return MethodCodes[methodHash] ?? "nft.unknown"
}

interface NftInteractionPreviewProps {
    transaction: Transaction;
    nft: Account;
}

const NftInteractionPreview = ({transaction, nft}: NftInteractionPreviewProps) => {
    const {t} = useTranslation()
    const operationName = getOperationName(transaction);
    return <NftDescriptor account={nft} label={t(operationName)}/>
}
