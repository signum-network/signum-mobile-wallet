import {View} from "react-native";
import {useTranslation} from "react-i18next";
import {Text} from "@/components/Text";
import {Card} from "@/components/Card";
import type {ParsedTransaction} from "../../utils/parseTransaction";
import {TokenDescriptor} from "@/components/TokenDescriptor";
import {AccountDescriptor} from "@/components/AccountDescriptor";
import {TotalAmount} from "@/components/TotalAmount";
import {useQueryResolveTokenRef} from "@/hooks/useQueryResolveTokenRef";

interface Props {
    parsed: ParsedTransaction;
}

export const TreasuryPreview = ({parsed}: Props) => {
    const {t} = useTranslation();
    const { token } = useQueryResolveTokenRef(parsed.transaction?.referencedTransactionFullHash ?? "")
    // Token ID from attachment
    const expense = parsed.expenses[0]!;

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
