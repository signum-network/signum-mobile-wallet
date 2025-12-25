import {View} from "react-native";
import {Text} from "@/components/Text";
import {Card} from "@/components/Card";
import {useMemo} from "react";
import {src44} from "@signumjs/standards";
import {AccountAvatar} from "@/components/Account/Avatar";
import {useQuery} from "@tanstack/react-query";
import {useLedgerService} from "@/hooks/useLedgerService";
import {useNodeHostStore} from "@/hooks/useNodeHostStore";
import {Address} from "@signumjs/core";

interface Props {
    accountId: string
}

export function AccountDescriptor({accountId}: Props) {
    const {ledgerService} = useLedgerService();
    const {currentNetwork, addressPrefix} = useNodeHostStore()

    const {isLoading, data: account} = useQuery({
        queryKey: ["fetchAccount", accountId, currentNetwork],
        queryFn: async () => {
            if (!ledgerService) return;
            return await ledgerService.account.fetchAccount(accountId, true)
        },
    });

    const address = useMemo(() => {
        try {
            return Address.fromNumericId(accountId, addressPrefix).getReedSolomonAddress(true);
        } catch {
            return ""
        }
    }, [accountId, addressPrefix]);

    const description = useMemo(() => {
        try {
            const d = src44.DescriptorData.parse(account?.description ?? "")
            return d.description ?? ""
        } catch {
            return account?.description ?? ""
        }
    }, [account]);


    return (
            <Card>
                <View className="flex flex-row items-center justify-start gap-2 min-w-full" >
                    <AccountAvatar accountId={accountId} loading={isLoading} description={account?.description || ""}/>
                    <Text className="font-medium">
                        {account?.name || address || accountId}
                    </Text>
                    <View className="flex flex-row gap-x-1 items-center">
                        {account?.isAT && <Text size="small" color="muted">🤖</Text>}
                        {account?.isSecured && <Text size="small" color="muted">🔒</Text>}
                    </View>
                </View>
                {description && (
                    <Text size="small" color="muted" >
                        {description}
                    </Text>
                )}
            </Card>
    )

}
