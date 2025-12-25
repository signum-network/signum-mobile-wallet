import type {Transaction} from "@signumjs/core";
import {View} from "react-native";
import {Text} from "@/components/Text";
import {useTranslation} from "react-i18next";

type Props = {
    transaction: Transaction
}

export function MessageAttachment({transaction}: Props) {
    const {t} = useTranslation()

    return <>
        {transaction.attachment?.message && (
            <View className="w-full flex flex-col gap-1">
                <Text size="large" color="muted" className="font-bold">
                    {t("textOrMemo")}
                </Text>

                {transaction.attachment["version.EncryptedMessage"] ? (
                    <Text fullWidth color="success" size="small">
                        🔐 {t("transfer.memoIsEncrypted")}
                    </Text>
                ) : (
                    <Text fullWidth color="muted" size="small">
                        {transaction.attachment.messageIsText
                            ? transaction.attachment.message
                            : "🤖 " + t("transfer.memoIsBinary")}
                    </Text>
                )}
            </View>
        )}</>

}
