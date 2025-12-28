import {View} from "react-native";
import {useTranslation} from "react-i18next";
import {Text} from "@/components/Text";
import {Card} from "@/components/Card";
import type {ParsedTransaction} from "../../utils/parseTransaction";
import {Amount} from "@signumjs/util";
import {useAppTheme} from "@/hooks/useAppTheme";
import {AccountDescriptor} from "@/components/AccountDescriptor";
import {SignaDescriptor} from "@/components/SignaDescriptor";
import {TotalAmount} from "@/components/TotalAmount";

interface Props {
    parsed: ParsedTransaction;
}

export const TldAssignmentPreview = ({ parsed }: Props) => {
    const {t} = useTranslation();
    const {tokens} = useAppTheme();
    const expense = parsed.expenses[0];
    const tld = parsed.transaction.attachment?.tld || "";
    const recipient = parsed.transaction.recipient || "";
    const total = parsed.fee.clone().add(expense?.amount ?? Amount.Zero());

    return (
        <>
            {/* TLD Being Assigned */}
            <View className="w-full flex flex-col gap-1">
                <Text size="large" color="muted" className="font-bold">
                    {t("sign.tld")}
                </Text>

                <Card>
                    <View className="flex flex-row items-center justify-center gap-2 w-full">
                        <View
                            className="w-full rounded-md px-3 py-2"
                            style={{
                                backgroundColor: tokens.primarySoft,
                                borderWidth: 1,
                                borderColor: tokens.primary,
                            }}
                        >
                            <Text color="primary" className="font-bold">.{tld}</Text>
                        </View>
                    </View>
                </Card>
            </View>

            {/* Recipient Account */}
            {recipient && (
                <View className="w-full flex flex-col gap-1">
                    <Text size="large" color="muted" className="font-bold">
                        {t("sign.assignedTo")}
                    </Text>
                    <AccountDescriptor accountId={recipient}/>
                </View>
            )}

            {/* Payment Amount */}
            {expense?.amount && (
                <View className="w-full flex flex-col gap-1">
                    <Text size="large" color="muted" className="font-bold">
                        {t("amount")}
                    </Text>
                    <SignaDescriptor amount={expense.amount}/>
                </View>
            )}

            {/* Explanation */}
            <Card>
                <Text size="small" color="muted">
                    {t("sign.tldExplanation")}
                </Text>
            </Card>

            <TotalAmount fee={parsed.fee} total={total}/>
        </>
    );
}
