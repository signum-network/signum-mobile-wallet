import {View} from "react-native";
import {useTranslation} from "react-i18next";
import {Text} from "@/components/Text";
import type {ParsedTransaction} from "../../utils/parseTransaction";
import {
    AccountDescriptor,
    MessageAttachment,
    TotalAmount
} from "./components";

interface Props {
    parsed: ParsedTransaction;
}

export const MessagePreview = ({parsed}: Props) => {
    const {t} = useTranslation();
    const expense = parsed.expenses[0];

    return (
        <>
            {/* Recipient */}
            <View className="w-full flex flex-col gap-1">
                <Text size="large" color="muted" className="font-bold">
                    {t("recipient")}
                </Text>
                <AccountDescriptor accountId={expense.to}/>
            </View>
            <MessageAttachment transaction={parsed.transaction}/>

            <TotalAmount fee={parsed.fee} total={parsed.fee}/>

        </>
    );
};
