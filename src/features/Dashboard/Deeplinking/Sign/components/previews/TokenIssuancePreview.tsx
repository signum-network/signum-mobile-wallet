import {View} from "react-native";
import {useTranslation} from "react-i18next";
import {Text} from "@/components/Text";
import {Card} from "@/components/Card";
import type {ParsedTransaction} from "../../utils/parseTransaction";
import {useMemo} from "react";
import {src44} from "@signumjs/standards";
import clsx from "clsx";
import {Image} from "expo-image";
import HashIconAvatarNativeSVG from "@/components/Account/Avatar/HashIconNativeSVG";
import {toIpfsUrl} from "@/utils/toIpsUrl";
import {TotalAmount} from "@/components/TotalAmount";

interface Props {
    parsed: ParsedTransaction;
}

export const TokenIssuancePreview = ({parsed}: Props) => {
    const {t} = useTranslation();
    const expense = parsed.expenses[0];
    // as token is being created now, we have to check if the description is SRC44 compliant
    const descriptor = useMemo(() => {
        try {
            return src44.DescriptorData.parse(parsed.transaction?.attachment?.description || "");
        } catch {
        }
    }, [parsed.transaction]);

    const tokenId = expense.tokenId ?? "";
    const ipfsImage = toIpfsUrl(descriptor?.avatar?.ipfsCid ?? null);
    const description = descriptor?.description ?? parsed.transaction?.attachment?.description ?? "";

    return (
        <>
            {/* Token Name */}
            <View className="w-full flex flex-col gap-1">
                <Text size="large" color="muted" className="font-bold">
                    {t("sign.tokenName")}
                </Text>
                <View className="flex flex-row items-center gap-2 w-full">
                    <View
                        className={clsx([
                            "size-11 overflow-hidden rounded",
                            !ipfsImage && "pr-1",
                        ])}
                    >
                        {ipfsImage ? (
                            <Image
                                source={ipfsImage}
                                contentFit="cover"
                                style={{width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.05)"}}
                            />
                        ) : (
                            <View className="relative">
                                <HashIconAvatarNativeSVG seed={tokenId}/>
                                <View
                                    className="absolute left-[3px] flex justify-center items-center w-full h-full text-white">
                                    <Text size="medium"
                                          className="font-bold let">{expense.tokenName?.slice(0, 3).toUpperCase()}</Text>
                                </View>
                            </View>
                        )}
                    </View>
                    <View className="flex-1 flex items-start flex-col gap-1">
                        <Text size="large" className="font-bold">{expense.tokenName || "Unnamed Token"}</Text>
                    </View>
                </View>
            </View>

            <Card>
                <View className="mb-2">
                    <Text size="small" color="muted">
                        {t("sign.tokenDescription")}
                    </Text>
                    <Text className="font-medium">{description}</Text>
                </View>

            </Card>

            {/* Token Details */}
            <View className="w-full flex flex-col gap-1">
                <Text size="large" color="muted" className="font-bold">
                    {t("sign.tokenDetails")}
                </Text>

                <Card>
                    <View className="flex flex-row items-center justify-between gap-2 w-full">
                        <View className="mb-2">
                            <Text size="small" color="muted">
                                {t("sign.decimals")}
                            </Text>
                            <Text className="font-medium">{expense.tokenDecimals || "0"}</Text>
                        </View>

                        <View className="mb-2">
                        <Text size="small" color="muted">
                            {t("sign.totalSupply")}
                        </Text>
                        <Text className="font-medium">{expense.quantity || "0"}</Text>
                    </View>

                    </View>
                </Card>

            </View>

            {/* Fees */}
            <TotalAmount fee={parsed.fee} total={parsed.fee}/>
        </>
    );
};
