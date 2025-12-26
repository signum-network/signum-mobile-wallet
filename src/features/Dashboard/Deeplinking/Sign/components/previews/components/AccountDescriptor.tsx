import {View} from "react-native";
import {Text} from "@/components/Text";
import {Card} from "@/components/Card";
import {useMemo} from "react";
import {src44} from "@signumjs/standards";
import {AccountAvatar} from "@/components/Account/Avatar";
import {useNodeHostStore} from "@/hooks/useNodeHostStore";
import {Address} from "@signumjs/core";
import {useQueryAccount} from "../lib/useQueryAccount";

interface Props {
    accountId: string
}

export function AccountDescriptor({accountId}: Props) {
    const {addressPrefix} = useNodeHostStore()
    const {isLoading, data: account} = useQueryAccount(accountId);

    const address = useMemo(() => {
        try {
            return Address.fromNumericId(accountId, addressPrefix).getReedSolomonAddress(true);
        } catch {
            return ""
        }
    }, [accountId, addressPrefix]);

    const description = useMemo(() => {
        try {
            const d = src44.DescriptorData.parse(account?.description ?? "", false)
            return d.description ?? ""
        } catch {
            return account?.description ?? ""
        }
    }, [account]);

    return (<>
        <Card>
            <View className="flex flex-row items-center justify-start gap-2 min-w-full">
                <AccountAvatar accountId={accountId} loading={isLoading} description={account?.description || ""}/>
                <View className="flex flex-col items-start">
                    <View className="flex flex-row items-center justify-start gap-2 w-full">

                        <Text className="font-medium">
                            {address || accountId}
                        </Text>
                        <View className="flex flex-row gap-x-1 items-center">
                            {account?.isAT && <Text size="small" color="muted">🤖</Text>}
                            {account?.isSecured && <Text size="small" color="muted">🔒</Text>}
                        </View>
                    </View>
                    {account?.name && (
                        <Text size="extraSmall" color="muted">{account.name}</Text>
                    )}
                </View>
            </View>
            {description && (
                <Text size="small" color="muted">
                    {description}
                </Text>
            )}
        </Card>

    </>
    )

}
