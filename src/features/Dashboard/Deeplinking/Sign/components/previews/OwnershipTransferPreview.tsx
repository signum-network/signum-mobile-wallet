import {View} from "react-native";
import {useTranslation} from "react-i18next";
import {Text} from "@/components/Text";
import {Card} from "@/components/Card";
import type {ParsedTransaction} from "../../utils/parseTransaction";
import {
    useQueryResolveTokenRef
} from "./lib/useQueryResolveTokenRef";
import {
    AccountDescriptor,
    TokenDescriptor,
    TotalAmount
} from "./components";

interface Props {
    parsed: ParsedTransaction;
}

export const OwnershipTransferPreview = ({parsed}: Props) => {
    const {t} = useTranslation();
    const {token} = useQueryResolveTokenRef(parsed.transaction?.referencedTransactionFullHash ?? "")
    const expense = parsed.expenses[0];// New owner address


    return (
        <>
            {/* Token */}
            <TokenDescriptor tokenId={token?.asset ?? ""}/>

            {/* Treasury Account */}
            <View className="w-full flex flex-col gap-1">
                <Text size="large" color="muted" className="font-bold">
                    {t("sign.newOwner")}
                </Text>
                <AccountDescriptor accountId={expense.to}/>
            </View>

            {/* Warning */}
            <Card>
                <Text size="small" color="error">
                    ⚠️ {t("sign.ownershipTransferWarningTitle")}
                </Text>
                <Text size="small" color="muted" className="mt-1">
                    {t("sign.ownershipTransferWarning")}
                </Text>
            </Card>

            <TotalAmount fee={parsed.fee} total={parsed.fee}/>
        </>
    );
};
