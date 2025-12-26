import {View} from "react-native";
import {useTranslation} from "react-i18next";
import {Text} from "@/components/Text";
import {Card} from "@/components/Card";
import type {ParsedTransaction} from "../../utils/parseTransaction";
import {tryGetJSON} from "../../utils/tryGetJson";
import {JsonView} from "@/components/JsonView";
import {TotalAmount} from "./components";
import {toIpfsUrl} from "@/utils/toIpsUrl";
import {Image} from "expo-image";

interface Props {
    parsed: ParsedTransaction;
}


export const AccountInfoPreview = ({parsed}: Props) => {
    const {t} = useTranslation();
    const accountName = parsed.transaction.attachment?.name || "";
    const accountDescription = parsed.transaction.attachment?.description || "";
    const json = tryGetJSON(accountDescription);

    const avatarCid = Object.keys(json?.av ?? {})
    const backgroundCid = Object.keys(json?.bg ?? {})
    const avatarUrl = avatarCid.length > 0 ? toIpfsUrl(avatarCid[0]) : "";
    const backgroundUrl = backgroundCid.length > 0 ? toIpfsUrl(backgroundCid[0]) : "";
    return (
        <>
            {/* Avatar & Background */}
            {(avatarUrl || backgroundUrl) && (
                <View className="w-full flex flex-col gap-1">
                    <Text size="large" color="muted" className="font-bold">
                        {avatarUrl && backgroundUrl ? t("sign.accountImages") : avatarUrl ? t("sign.accountAvatar") : t("sign.accountBackground")}
                    </Text>

                    <Card>
                        <View className="relative w-full" style={{aspectRatio: backgroundUrl ? 16/9 : 1}}>
                            {/* Background Image */}
                            {backgroundUrl && (
                                <Image
                                    source={backgroundUrl}
                                    contentFit="cover"
                                    cachePolicy="memory-disk"
                                    transition={200}
                                    recyclingKey={backgroundCid[0]}
                                    style={{
                                        position: 'absolute',
                                        width: "100%",
                                        height: "100%",
                                        borderRadius: 8
                                    }}
                                />
                            )}

                            {/* Avatar Image */}
                            {avatarUrl && (
                                <View className="absolute inset-0 flex items-center justify-center">
                                    <View className={backgroundUrl ? "size-24 rounded-full overflow-hidden border-4 border-white bg-gray-500/50 shadow-xl" : "w-full h-full"}>
                                        <Image
                                            source={avatarUrl}
                                            contentFit={backgroundUrl ? "cover" : "contain"}
                                            cachePolicy="memory-disk"
                                            transition={200}
                                            recyclingKey={avatarCid[0]}
                                            style={{ width: "100%", height: "100%" }}
                                        />
                                    </View>
                                </View>
                            )}
                        </View>
                    </Card>
                </View>
            )}

            {/* Account Name */}
            {accountName && (
                <View className="flex-1 min-w-0 flex flex-col gap-1">
                    <Text size="large" color="muted" className="font-bold">
                        {t("sign.accountName")}
                    </Text>
                    <Card>
                        <Text className="font-medium">{accountName}</Text>
                    </Card>
                </View>
            )}

            {/* Account Description */}
            {accountDescription && (
                <View className="flex-1 min-w-0 flex flex-col gap-1">
                    <Text size="large" color="muted" className="font-bold">
                        {t("sign.accountDescription")}
                    </Text>

                    {json ? (
                        <Card>
                            <JsonView json={json}/>
                        </Card>
                    ) : (
                        <Card>
                            <Text>{accountDescription}</Text>
                        </Card>
                    )}
                </View>
            )}

            <Card>
                <Text size="small" color="muted">
                    {t('sign.accountInfoExplainer')}
                </Text>
            </Card>

            {/* Fees */}
            <TotalAmount fee={parsed.fee} total={parsed.fee}/>
        </>
    );
};
