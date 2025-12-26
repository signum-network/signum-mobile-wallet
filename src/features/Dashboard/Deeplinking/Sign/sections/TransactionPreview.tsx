import {useState} from "react";
import {ScrollView, View} from "react-native";
import type {Transaction} from "@signumjs/core";
import {TransactionType} from "@signumjs/core";
import Ionicons from "@expo/vector-icons/Ionicons";
import {Card} from "@/components/Card";
import {Text} from "@/components/Text";
import {ViewModeToggle, type ViewMode} from "../components/ViewModeToggle";
import {JsonPreview} from "../components/JsonPreview";
import {useAppTheme} from "@/hooks/useAppTheme";
import {parseSignumTransaction} from "../utils/parseTransaction";
import {PaymentPreview} from "../components/previews/PaymentPreview";
import {GenericPreview} from "../components/previews/GenericPreview";
import {TokenTransferPreview} from "../components/previews/TokenTransferPreview";
import {TokenIssuancePreview} from "../components/previews/TokenIssuancePreview";
import {TokenMintPreview} from "../components/previews/TokenMintPreview";
import {OrderPreview} from "../components/previews/OrderPreview";
import {DistributionPreview} from "../components/previews/DistributionPreview";
import {TreasuryPreview} from "../components/previews/TreasuryPreview";
import {OwnershipPreview} from "../components/previews/OwnershipPreview";
import {MessagePreview} from "../components/previews/MessagePreview";
import {AccountInfoPreview} from "../components/previews/AccountInfoPreview";
import {AliasPreview} from "../components/previews/AliasPreview";
import {CommitmentPreview} from "../components/previews/CommitmentPreview";
import {PoolPreview} from "../components/previews/PoolPreview";
import {ContractCreationPreview} from "../components/previews/ContractCreationPreview";
import {SubscriptionPreview} from "../components/previews/SubscriptionPreview";
import {TldAssignmentPreview} from "../components/previews/TldAssignmentPreview";
import {useTranslation} from "react-i18next";

interface Props {
    transaction: Transaction;
}

export const TransactionPreview = ({transaction}: Props) => {
    const [viewMode, setViewMode] = useState<ViewMode>("parsed");
    const {iconColor} = useAppTheme();
    const {t} = useTranslation()

    const parsed = parseSignumTransaction(transaction);
    const {type} = parsed;

    const renderParsedView = () => {
        // Route to specific preview based on i18nKey
        switch (type.i18nKey) {
            case "transferTo":
            case "burn":
                return transaction.type === TransactionType.Payment
                    ? <PaymentPreview parsed={parsed}/>
                    : <TokenTransferPreview parsed={parsed}/>;
            case "tokenIssuance":
                return <TokenIssuancePreview parsed={parsed}/>;
            case "tokenMint":
                return <TokenMintPreview parsed={parsed}/>;
            case "createSaleOrder":
            case "createBuyOrder":
            case "cancelSaleOrder":
            case "cancelBuyOrder":
                return <OrderPreview parsed={parsed}/>;
            case "distribution":
                return <DistributionPreview parsed={parsed}/>;
            case "addTreasuryAccount":
                return <TreasuryPreview parsed={parsed}/>;
            case "transferOwnership":
                return <OwnershipPreview transaction={transaction} parsed={parsed}/>;
            case "messageTo":
                return <MessagePreview transaction={transaction} parsed={parsed}/>;
            case "updateAccountInfo":
                return <AccountInfoPreview parsed={parsed}/>;
            case "aliasClaim":
            case "aliasBuy":
            case "aliasSell":
                return <AliasPreview parsed={parsed}/>
            case "tldAssignment":
                return <TldAssignmentPreview parsed={parsed}/>
            case "addCommitment":
            case "removeCommitment":
                return <CommitmentPreview parsed={parsed}/>;
            case "joinPool":
                return <PoolPreview transaction={transaction} parsed={parsed}/>;
            case "contractCreation":
                return <ContractCreationPreview parsed={parsed}/>;
            case "subscriptionCreation":
            case "subscriptionCancellation":
                return <SubscriptionPreview transaction={transaction} parsed={parsed}/>;

            // Fallback for unknown types
            default:
                return <GenericPreview parsed={parsed}/>;
        }
    };

    return (
        <ScrollView className="max-h-screen-safe-or-10">
            <ViewModeToggle mode={viewMode} onModeChange={setViewMode}/>
            <Card>
                <View className="gap-4">
                    <View className="flex flex-row justify-center items-center gap-1">
                        <Ionicons
                            name={type.iconName as any}
                            size={32}
                            color={iconColor.primary}
                        />
                        <Text size="large" className="font-bold" color="primary">
                            {t(`sign.txTypes.${type.i18nKey}`)}
                        </Text>
                    </View>
                    {
                        viewMode === "json"
                            ? <JsonPreview transaction={transaction}/>
                            : renderParsedView()
                    }
                </View>
            </Card>
        </ScrollView>
    );
};
