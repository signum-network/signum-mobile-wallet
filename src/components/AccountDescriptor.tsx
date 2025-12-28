import { View } from "react-native";
import { Text } from "@/components/Text";
import { useMemo } from "react";
import { src44 } from "@signumjs/standards";
import { useQueryAccount } from "@/hooks/useQueryAccount";
import { GenericAccountCard } from "@/components/Account/GenericAccountCard";

interface Props {
    accountId: string;
}

export function AccountDescriptor({ accountId }: Props) {
    const { isLoading, data: account } = useQueryAccount(accountId);

    const description = useMemo(() => {
        try {
            const d = src44.DescriptorData.parse(account?.description ?? "", false);
            return d.description ?? "";
        } catch {
            return account?.description ?? "";
        }
    }, [account]);

    if (isLoading || !account) return null;

    const backgroundStyle =  {
        textShadowColor: "rgba(0, 0, 0, 0.75)",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    }

    return (
        <View className="w-full">
            <GenericAccountCard account={account} height={80}>
                {({ showBackground }) => (
                    <View className="flex flex-col flex-1">
                        <Text
                            className="font-medium"
                            color={showBackground ? "white" : "content"}
                            style={
                                showBackground ? backgroundStyle : {}
                            }
                        >
                            {account.accountRS || account.account}
                        </Text>
                        {account.name && (
                            <Text
                                size="small"
                                color={showBackground ? "white" : "muted"}
                                style={
                                    showBackground ? backgroundStyle : {}
                                }

                            >
                                {account.name}
                            </Text>
                        )}

                        {description && (
                            <Text
                                size="small"
                                color={showBackground ? "white" : "muted"}
                                className="mt-1"
                                style={
                                    showBackground ? backgroundStyle : {}
                                }

                            >
                                {description}
                            </Text>
                        )}
                    </View>
                )}
            </GenericAccountCard>

        </View>
    );
}
