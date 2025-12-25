import {View} from "react-native";
import {useTranslation} from "react-i18next";
import {Text} from "@/components/Text";
import {Card} from "@/components/Card";
import type {ParsedTransaction} from "../../utils/parseTransaction";
import {SignaDescriptor, TotalAmount} from "./components";

interface Props {
    parsed: ParsedTransaction;
}

export const CommitmentPreview = ({parsed}: Props) => {
    const {t} = useTranslation();

    const expense = parsed.expenses[0];
    const commitmentAmount = expense.amount ? Number(expense.amount.getSigna()) : 0;

    const isAdding = parsed.type.i18nKey === "addCommitment";

    return (
        <>
            {/* Commitment Amount */}
            <View className="w-min-full flex flex-col gap-1">
                    <SignaDescriptor amount={expense.amount}/>
            </View>

            {/* Explanation */}
            <Card>
                <Text size="small" color="muted">
                    {isAdding
                        ? t("sign.addCommitmentExplanation", {amount: commitmentAmount})
                        : t("sign.removeCommitmentExplanation", {amount: commitmentAmount})}
                </Text>
            </Card>

            <TotalAmount fee={parsed.fee} total={parsed.fee}/>
        </>
    );
};
