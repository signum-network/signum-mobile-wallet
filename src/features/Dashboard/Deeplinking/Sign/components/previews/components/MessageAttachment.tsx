import type {Transaction} from "@signumjs/core";
import {ScrollView, View} from "react-native";
import {Text} from "@/components/Text";
import {Card} from "@/components/Card";
import {useTranslation} from "react-i18next";
import {tryGetJSON} from "@/features/Dashboard/Deeplinking/Sign/utils/tryGetJson";
import {JsonView} from "@/components/JsonView";

const formatBinaryMessage = (msg: string) => {
    // Check if the message is valid hex (only 0-9, a-f, A-F)
    const hexRegex = /^[0-9a-fA-F]+$/;
    const isValidHex = hexRegex.test(msg) && msg.length % 2 === 0;

    if (!isValidHex) {
        return {isValidHex: false, formatted: msg};
    }

    // Split into pairs of 2 characters
    const pairs = msg.match(/.{1,2}/g) || [];
    return {isValidHex: true, formatted: pairs.join(' ')};
};

type Props = {
    transaction: Transaction
}

export function MessageAttachment({transaction}: Props) {
    const {t} = useTranslation()

    const isEncrypted = transaction.attachment?.["version.EncryptedMessage"];
    const isText = transaction.attachment?.messageIsText;
    const message = transaction.attachment?.message;

    const json = isText && Boolean(message) ? tryGetJSON(message) : null;

    // Validate and format binary message as hex
    const binaryMessage = !isText && message ? formatBinaryMessage(message) : null;

    return <>
        {transaction.attachment?.message && (
            <View className="w-full flex flex-col gap-1">
                <Text size="large" color="muted" className="font-bold">
                    {t("textOrMemo")}&nbsp;
                    {isText
                        ? (<Text size="extraSmall" color="muted">{message.length} chars</Text>)
                        : (<Text size="extraSmall" color="muted">{message.length / 2} bytes</Text>)
                    }
                </Text>

                <View className="flex flex-row items-center gap-2 w-full">

                    {isEncrypted ? (
                        <Card>
                            <View className="flex flex-row items-center gap-2">
                                <Text size="large">🔐</Text>
                                <Text color="success" size="small" className="font-medium">
                                    {t("transfer.memoIsEncrypted")}
                                </Text>
                            </View>
                        </Card>
                    ) : isText ? (
                        json ? (
                            <Card>
                                <JsonView json={json} className="w-full flex-grow flex w-min-full"/>
                            </Card>
                        ) : (
                            <Card>
                                <ScrollView style={{maxHeight: 200}}>
                                    <Text color="muted" size="small">
                                        {message}
                                    </Text>
                                </ScrollView>
                            </Card>
                        )
                    ) : (
                        <Card>
                            <View className="flex flex-row items-center gap-2">
                                <Text size="large">🤖</Text>
                                <Text color="muted" size="small">
                                    {t("transfer.memoIsBinary")}
                                    {binaryMessage && !binaryMessage.isValidHex && (
                                        <Text color="error" size="extraSmall">{t("sign.invalidHexFormat")}</Text>
                                    )}
                                </Text>
                            </View>
                            <ScrollView style={{maxHeight: 200}}>
                                <Text size="small" style={{fontFamily: "SpaceMono_400Regular"}}>
                                    {binaryMessage?.formatted || message}
                                </Text>
                            </ScrollView>
                        </Card>
                    )}
                </View>
            </View>
        )}</>

}
