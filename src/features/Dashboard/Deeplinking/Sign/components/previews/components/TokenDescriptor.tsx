import {View} from "react-native";
import {Text} from "@/components/Text";
import {Card} from "@/components/Card";
import {TokenAvatar} from "@/components/Token/Avatar";
import {useMemo} from "react";
import {src44} from "@signumjs/standards";
import {useTokenMetadata} from "@/hooks/useTokenMetadata";
import {useTranslation} from "react-i18next";

interface Props {
    tokenId: string
}

export function TokenDescriptor({tokenId} : Props) {
    const {t} = useTranslation();
    const tokenMetadata = useTokenMetadata(tokenId);
    const tokenDescription = useMemo(() => {
        try {
            const descriptor = src44.DescriptorData.parse(tokenMetadata.description ?? "")
            return descriptor.description ?? ""
        } catch {
            return tokenMetadata.description ?? ""
        }

    }, [tokenMetadata.description]);

    return <>
        <View className="w-min-full flex flex-col gap-1">
            <Text size="large" color="muted" className="font-bold">
                {t("token")}
            </Text>

            <Card>
                <View className="flex flex-row items-center justify-start gap-2 w-full">
                    <TokenAvatar tokenId={tokenId ?? ""}/>
                    <Text className="font-medium">
                        {tokenMetadata.ticker || tokenId}
                    </Text>
                </View>
                {tokenDescription && (
                    <Text size="small" color="muted">
                        {tokenDescription}
                    </Text>
                )}
            </Card>
        </View>
    </>

}
