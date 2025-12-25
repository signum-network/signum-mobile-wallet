import {View} from "react-native";
import {useTranslation} from "react-i18next";
import {Text} from "@/components/Text";
import {Card} from "@/components/Card";
import type {ParsedTransaction} from "../../utils/parseTransaction";
import {
    AccountDescriptor, MessageAttachment,
    SignaDescriptor, TokenDescriptor,
    TotalAmount
} from "./components";
import {useMemo} from "react";

interface Props {
    parsed: ParsedTransaction;
}

const MAX_VISIBLE_EXPENSES = 10;

export const GenericPreview = ({parsed}: Props) => {
    const {t} = useTranslation();
    const expenses = useMemo(() => {
        const uniqueRecipients = new Set()
        const total = parsed.fee.clone();
        for (let i = 0; i < parsed.expenses.length; i++) {
            const expense = parsed.expenses[i];
            if (expense.to) {
                uniqueRecipients.add(expense.to);
            }
            if (expense.amount) {
                total.add(expense.amount);
            }
        }

        return {
            total,
            hasManyRecipients: uniqueRecipients.size > 1
        }
    }, [parsed]);

    const hasALotExpenses = parsed.expenses.length > MAX_VISIBLE_EXPENSES;
    const cappedExpenses = hasALotExpenses ? parsed.expenses.slice(0, MAX_VISIBLE_EXPENSES) : parsed.expenses;

    return (
        <>
            <View className="w-min-full flex flex-col gap-2">
                {cappedExpenses.map((expense, index) => (
                    <View key={index} className="w-full flex flex-col gap-2">
                        {expenses.hasManyRecipients
                            ? (expense.to && (
                                <View>
                                    <Text size="large" className="font-bold" color="muted">{t("recipient")}</Text>
                                    <AccountDescriptor accountId={expense.to}/>
                                </View>))
                            : (index === 0 && <View>
                                    <Text size="large" className="font-bold" color="muted">{t("recipient")}</Text>
                                    <AccountDescriptor accountId={expense.to}/>
                                </View>
                            )}

                        {expense.amount && (
                            <SignaDescriptor amount={expense.amount}/>
                        )}

                        {expense.tokenId && !expense.amount && (
                            <TokenDescriptor tokenId={expense.tokenId} quantity={expense.quantity}/>
                        )}

                        {expense.aliasName && (
                            <View className="mb-2">
                                <Text size="small" color="muted">Alias</Text>
                                <Text className="font-medium">{expense.aliasName}</Text>
                            </View>
                        )}
                    </View>
                ))}
            </View>

            {hasALotExpenses && (
                <View className="w-full flex flex-row justify-center gap-1">
                    <Text color="muted">
                        {t("sign.andMoreRecipients", {count: parsed.expenses.length - MAX_VISIBLE_EXPENSES})}
                    </Text>
                </View>
            )}

            <TotalAmount fee={parsed.fee} total={expenses.total}/>
            <MessageAttachment transaction={parsed.transaction}/>

            <Card>
                <Text size="small" color="muted" className="text-start">
                    ℹ️ {t("sign.genericTransactionHint")}
                </Text>
                <Text size="small" color="muted" className="text-center mt-1">
                    {t("sign.switchToJsonHint")}
                </Text>
            </Card>
        </>
    );
};
