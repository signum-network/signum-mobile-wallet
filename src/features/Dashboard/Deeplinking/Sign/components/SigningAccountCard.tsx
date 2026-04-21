import {useMemo} from "react";
import {View} from "react-native";
import type {Account} from "@signumjs/core";
import {Address} from "@signumjs/core";
import {GenericAccountCard} from "@/components/Account/GenericAccountCard";
import {Text} from "@/components/Text";
import {useQueryAccount} from "@/hooks/useQueryAccount";
import {t} from "i18next";
import {Card} from "@/components/Card";

interface Props {
    publicKey: string;
}

const backgroundTextStyle = {
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 3,
};

export function SigningAccountCard({publicKey}: Props) {
    const {accountId, accountRS} = useMemo(() => {
        const address = Address.fromPublicKey(publicKey);
        return {
            accountId: address.getNumericId(),
            accountRS: address.getReedSolomonAddress(),
        };
    }, [publicKey]);

    const {data: fetchedAccount} = useQueryAccount(accountId);

    // Render with fetched account when available, else a synthetic fallback
    // so the card doesn't flash in/out while the query is pending.
    const account: Account = fetchedAccount ?? ({
        account: accountId,
        accountRS,
        accountRSExtended: accountRS,
        publicKey,
        name: "",
        description: "",
        balanceNQT: "0",
        unconfirmedBalanceNQT: "0",
        forgedBalanceNQT: "0",
        guaranteedBalanceNQT: "0",
        committedBalanceNQT: "0",
        commitmentNQT: "0",
        assetBalances: [],
        unconfirmedAssetBalances: [],
        isAT: false,
        isSecured: true,
    } as Account);

    return (
        <Card>
            <Text size="large" color="muted" className="font-bold">{t("sign.sender")}</Text>
            <GenericAccountCard account={account} height={72}>
                {({showBackground}) => (
                    <View className="flex flex-col flex-1">
                        <Text
                            className="font-medium"
                            color={showBackground ? "white" : "content"}
                            style={showBackground ? backgroundTextStyle : {}}
                        >
                            {account.accountRS || account.account}
                        </Text>
                        {!!account.name && (
                            <Text
                                size="small"
                                color={showBackground ? "white" : "muted"}
                                style={showBackground ? backgroundTextStyle : {}}
                            >
                                {account.name}
                            </Text>
                        )}
                    </View>
                )}
            </GenericAccountCard>
        </Card>
    );
}
