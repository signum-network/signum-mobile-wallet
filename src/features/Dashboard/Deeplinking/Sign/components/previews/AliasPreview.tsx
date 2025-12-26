import {View} from "react-native";
import {useTranslation} from "react-i18next";
import {Text} from "@/components/Text";
import {Card} from "@/components/Card";
import type {ParsedTransaction} from "../../utils/parseTransaction";
import {tryGetJSON} from "../../utils/tryGetJson";
import {JsonView} from "@/components/JsonView";
import {AccountDescriptor, SignaDescriptor, TotalAmount} from "./components";
import {useQuery} from "@tanstack/react-query";
import {useNodeHostStore} from "@/hooks/useNodeHostStore";
import {useLedgerService} from "@/hooks/useLedgerService";
import {PUBLIC_SIGNUM_AVERAGE_BLOCK_TIME_IN_MILLISECONDS} from "@/types/constants";
import {Amount} from "@signumjs/util";

interface Props {
    parsed: ParsedTransaction;
}

function toTld(tld?: string) {
    return tld === "0" ? "signum" : tld;
}

export const AliasPreview = ({parsed}: Props) => {
    const {t} = useTranslation();
    const {ledgerService} = useLedgerService()
    const {currentNetwork} = useNodeHostStore()

    const expense = parsed.expenses[0];
    const operationType = parsed.type.i18nKey;

    const isCreation = operationType === "aliasClaim";
    const isBuy = operationType === "aliasBuy";
    const isSell = operationType === "aliasSell";
    const aliasId = parsed.transaction.attachment?.alias || "";

    const { data: loadedAlias } = useQuery({
        queryKey: ["fetchAlias", aliasId, currentNetwork],
        queryFn: async () => {
            if(!ledgerService) return;
            return ledgerService.ledgerInstance.alias.getAliasById(aliasId)
        },
        refetchInterval: PUBLIC_SIGNUM_AVERAGE_BLOCK_TIME_IN_MILLISECONDS,
        staleTime: PUBLIC_SIGNUM_AVERAGE_BLOCK_TIME_IN_MILLISECONDS,
        enabled: Boolean(aliasId) && Boolean(ledgerService),
    });

    const aliasName = parsed.transaction.attachment?.aliasName || loadedAlias?.aliasName || "";
    const tld = toTld(parsed.transaction.attachment?.tld || loadedAlias?.tld || "");
    const aliasContent = parsed.transaction.attachment?.uri || loadedAlias?.aliasURI || "";
    const json = tryGetJSON(aliasContent);
    const total = isBuy ? parsed.fee.clone().add(expense.amount ?? Amount.Zero()) : parsed.fee;
    return (
        <>
            {/* Alias Name */}
            <View className="w-full flex flex-col gap-1">
                <Text size="large" color="muted" className="font-bold">
                    {t("sign.aliasName")}
                </Text>

                <Card>
                    <View className="flex flex-row items-center justify-between gap-2 w-full">
                        <View className="flex-1 min-w-0">
                            <Text className="font-medium text-ellipsis whitespace-nowrap overflow-hidden">
                                {aliasName || expense.aliasName || "Unknown"}
                            </Text>
                        </View>
                        {tld && (
                            <View className="ml-1 bg-gray-50 border border-gray-50 rounded-md px-1 flex-shrink-0">
                                <Text color="muted">{tld}</Text>
                            </View>
                        )}
                    </View>
                </Card>
            </View>

            {/* Alias Content (for creation) */}
            {isCreation && aliasContent && (
                <View className="w-full flex flex-col gap-1">
                    <Text size="large" color="muted" className="font-bold">
                        {json ? t("sign.aliasData") : t("sign.aliasContent")}
                    </Text>
                    <Card>
                        {json ? <JsonView json={json}/> : <Text className="font-medium">{aliasContent}</Text>}
                    </Card>
                </View>
            )}

            {/* Price (for Buy/Sell) */}
            {(isBuy || isSell) && (
                <View className="w-full flex flex-col gap-1">
                    <Text size="large" color="muted" className="font-bold">
                        {t("sign.price")}
                    </Text>
                    <SignaDescriptor amount={expense.amount}/>
                </View>
            )}

            {/* Recipient/Party (for Buy/Sell) */}
            {(isBuy || isSell) && expense.to && (
                <View className="w-full flex flex-col gap-1">
                    <Text size="large" color="muted" className="font-bold">
                        {isBuy ? t("sign.seller") : t("sign.buyer")}
                    </Text>
                    <AccountDescriptor accountId={expense.to}/>
                </View>
            )}

            {/* Explanation for Creation */}
            {isCreation && (
                <Card>
                    <Text size="small" color="muted">
                        {t("sign.aliasCreationExplanation")}
                    </Text>
                </Card>
            )}

            <TotalAmount fee={parsed.fee} total={total}/>

        </>
    );
};
