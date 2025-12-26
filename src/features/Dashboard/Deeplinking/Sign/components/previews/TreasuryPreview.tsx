import {View} from "react-native";
import {useTranslation} from "react-i18next";
import {Text} from "@/components/Text";
import {Card} from "@/components/Card";
import type {ParsedTransaction} from "../../utils/parseTransaction";
import {
    AccountDescriptor,
    TokenDescriptor,
    TotalAmount
} from "./components";
import {useQuery} from "@tanstack/react-query";
import {useNodeHostStore} from "@/hooks/useNodeHostStore";
import {useLedgerService} from "@/hooks/useLedgerService";

interface Props {
    parsed: ParsedTransaction;
}

export const TreasuryPreview = ({parsed}: Props) => {
    const {t} = useTranslation();
    const {ledgerService} = useLedgerService();
    const {currentNetwork} = useNodeHostStore();

    // Token ID from attachment
    const expense = parsed.expenses[0]!;

    const {data: token} = useQuery({
        queryKey: ["resolveTokenReferenceHash", parsed.transaction.referencedTransactionFullHash, currentNetwork],
        queryFn: async () => {
            if (!ledgerService) return;
            if (!parsed.transaction.referencedTransactionFullHash) return;
            return ledgerService.token.fetchTokenByRef(parsed.transaction.referencedTransactionFullHash)
        },
        staleTime: Infinity,
        enabled: Boolean(ledgerService)
    })

    return (
        <>
            {/* Token */}
            <TokenDescriptor tokenId={token?.asset ?? ""}/>

            {/* Treasury Account */}
            <View className="w-full flex flex-col gap-1">
                <Text size="large" color="muted" className="font-bold">
                    {t("sign.treasuryAccount")}
                </Text>
                <AccountDescriptor accountId={expense.to}/>
            </View>

            {/* Explanation */}
            <Card>
                <Text size="small" color="muted">
                    {t('sign.addTreasuryAccountExplanation')}
                </Text>
            </Card>

            {/* Fees */}
            <TotalAmount fee={parsed.fee} total={parsed.fee}/>
        </>
    )
}
