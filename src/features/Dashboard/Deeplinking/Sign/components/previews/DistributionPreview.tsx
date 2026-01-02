import {View} from "react-native";
import {useTranslation} from "react-i18next";
import {Amount, ChainValue} from "@signumjs/util";
import {Text} from "@/components/Text";
import {Card} from "@/components/Card";
import {useTokenMetadata} from "@/hooks/useTokenMetadata";
import {formatNumber} from "@/utils/formatNumber";
import type {ParsedTransaction} from "../../utils/parseTransaction";
import {useQuery} from "@tanstack/react-query";
import {useNodeHostStore} from "@/hooks/useNodeHostStore";
import {useLedgerService} from "@/hooks/useLedgerService";
import {TokenDescriptor} from "@/components/TokenDescriptor";
import {SignaDescriptor} from "@/components/SignaDescriptor";
import {TotalAmount} from "@/components/TotalAmount";

interface Props {
    parsed: ParsedTransaction;
}

export const DistributionPreview = ({parsed}: Props) => {
    const {t} = useTranslation();
    const {currentNetwork} = useNodeHostStore();
    const {ledgerService} = useLedgerService()

    // First expense is the base token (whose holders receive distribution)
    const baseTokenExpense = parsed.expenses[0];
    const baseTokenMetadata = useTokenMetadata(baseTokenExpense.tokenId);

    // Second expense (if exists) is the distribution asset
    const distributionExpense = parsed.expenses[1];

    // Distribution amount (from first expense if SIGNA, or second expense if token)
    const distributionAmount = baseTokenExpense.amount ?? Amount.Zero()

    // Minimum quantity threshold
    const minimumQuantity = ChainValue.create(baseTokenMetadata.decimals)
        .setAtomic(baseTokenExpense.quantity || "0")
        .getCompound();

    const { data: distributionInfo, isLoading } = useQuery({
        queryKey: ["calculateDistributionFee", baseTokenExpense, currentNetwork],
        queryFn: async () => {
            if(!ledgerService) return;
            if(!baseTokenExpense) return ;
            return ledgerService.token.calculateDistributionFee(baseTokenExpense.tokenId ?? "0", baseTokenExpense.quantity ?? "0")
        },
        enabled: Boolean(ledgerService) && Boolean(baseTokenExpense),
    })

    const total = parsed.fee.clone()
        .add(distributionAmount)
        .add(distributionInfo?.fee ?? Amount.Zero())
    return (
        <>
            {/* Base Token (Holders Receiving Distribution) */}
            <View className="w-full flex flex-col gap-1">
                <Text size="large" color="muted" className="font-bold">
                    {t("sign.distributingToHoldersOf")}
                </Text>

                <Card>
                    <TokenDescriptor tokenId={baseTokenMetadata.id}/>
                    <View className="flex flex-row items-center justify-between gap-2 w-full mt-1">

                    <Text size="small" color="muted" className="mt-1">
                        {t("sign.minimumHolding")}: {formatNumber({value: Number(minimumQuantity)})}
                    </Text>
                    <Text size="small" color="muted" className="mt-1">
                        {isLoading
                            ? t("loading")
                            : t("sign.holdersCount", {count: distributionInfo?.numberOfAccounts ?? 0})
                        }
                    </Text>
                    </View>
                </Card>
            </View>

            {/* Distribution Amount/Asset */}
            <View className="w-full flex flex-col gap-1">
                <Text size="large" color="muted" className="font-bold">
                    {t("sign.distributing")}
                </Text>

                {distributionAmount.greater(Amount.Zero()) && (
                    <SignaDescriptor amount={distributionAmount}/>
                )}
                {distributionExpense.tokenId && distributionExpense.tokenId !== "0" && (
                    <TokenDescriptor tokenId={distributionExpense.tokenId} quantity={distributionExpense.quantity}/>
                )}
            </View>

            {/* Explanation */}
            <Card>
                <Text size="small" color="muted">
                    {t("sign.distributionExplanation")}
                </Text>
            </Card>

            {/* Fees */}
            <TotalAmount fee={parsed.fee.add(distributionInfo?.fee ?? Amount.Zero())} total={ total }/>
        </>
    );
};
