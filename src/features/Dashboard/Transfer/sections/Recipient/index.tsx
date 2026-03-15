import {View} from "react-native";
import {useMemo} from "react";
import {useTranslation} from "react-i18next";
import {useFormContext, Controller} from "react-hook-form";
import type {BarcodeScanningResult} from "expo-camera";
import {Text} from "@/components/Text";
import {Card} from "@/components/Card";
import {TextInput} from "@/components/TextInput";
import {CameraDialog} from "@/components/CameraDialog";
import type {TransactionCreation} from "../../utils/types";
import {ResolvingAccountCard} from "../../components/ResolvingAccountCard";
import {BurnAccountCard} from "../../components/BurnAccountCard";
import {useAccountStore} from "@/hooks/useAccountStore";
import {HorizontalDivider} from "@/components/HorizontalDivider";
import {Address} from "@signumjs/core";
import {useLedgerService} from "@/hooks/useLedgerService";
import {useQuery} from "@tanstack/react-query";
import {PUBLIC_SIGNUM_AVERAGE_BLOCK_TIME_IN_MILLISECONDS} from "@/types/constants";
import {useNodeHostStore} from "@/hooks/useNodeHostStore";
import {asRSAddress} from "@/utils/account/asRSAddress";
import {asAddress} from "@/utils/account/asAddress";
import {SelectableAccountList} from "./SelectableAccountList";


const MAX_RECENT_RECIPIENTS = 10;

export const Recipient = () => {
    const {t} = useTranslation();
    const {control, setValue, watch} = useFormContext<TransactionCreation>();
    const {accounts, activeAccount} = useAccountStore();
    const {currentNetwork} = useNodeHostStore()
    const {ledgerService} = useLedgerService();

    const onCodeScanned = (data: BarcodeScanningResult) => {
        // incoming code is an RS Address
        setValue("recipient", data.data);
    };

    const permanentAccountIdSet = useMemo(() => {
        const result = new Set<string>()
        for (const account of Object.values(accounts)) {
            if (account.publicKey !== activeAccount) {
                try {
                    result.add(Address.fromPublicKey(account.publicKey).getNumericId())
                } catch {
                    // noop
                }
            }
        }
        return result
    }, [accounts, activeAccount])


    const {data: recentRecipientAccountIdSet = new Set<string>()} = useQuery({
        queryKey: ["fetchRecentRecipients", activeAccount, permanentAccountIdSet, currentNetwork],
        queryFn: async () => {
            const uniqueRecipientIds = new Set<string>();
            if (ledgerService) {
                const senderId = Address.fromPublicKey(activeAccount).getNumericId();
                const outgoingTransactions = await ledgerService.ledgerInstance.account.getAccountTransactionsFromSender({
                    senderId,
                    includeIndirect: false,
                })

                const activeAccountId = Address.fromPublicKey(activeAccount).getNumericId();
                for (const outgoingTransaction of outgoingTransactions.transactions) {
                    const recipientId = outgoingTransaction.recipient;
                    if (recipientId && !permanentAccountIdSet.has(recipientId) && activeAccountId !== recipientId) {
                        uniqueRecipientIds.add(recipientId)
                    }
                    if (uniqueRecipientIds.size >= MAX_RECENT_RECIPIENTS) {
                        break;
                    }
                }
            }
            return uniqueRecipientIds
        },
        staleTime: PUBLIC_SIGNUM_AVERAGE_BLOCK_TIME_IN_MILLISECONDS,
        enabled: Boolean(activeAccount) && Boolean(ledgerService),
    });

    const recipient = watch("recipient");

    const handleSelect = (accountId: string) => {
        setValue("recipient", asRSAddress(accountId) ?? "", {shouldValidate: true, shouldDirty: true});
    };

    const handleBurnSelect = () => {
        setValue("recipient", "0", {shouldValidate: true, shouldDirty: true});
    };

    const isBurnAccountSelected = recipient === "0" || recipient?.includes("2222-2222-2222-2222");

    const selectedAccountRS = (watch("recipient") as string) || "";
    const selectedAccountId = useMemo(() => {
        try {
            return selectedAccountRS ? asAddress(selectedAccountRS)?.getNumericId() : "";
        } catch {
            return ""
        }
    }, [selectedAccountRS]);

    return (
        <>
            <View className="flex-1 w-full">
                <View className="grow w-full gap-4 mb-4">
                    <Card>
                        <View>
                            <Text size="large" className="font-medium">
                                {t("recipient")}
                            </Text>

                            <Text size="large" color="muted" className="font-medium">
                                {t("transfer.recipientDescription")}
                            </Text>
                        </View>
                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    placeholder={t("example") + " S-5MS6..., 167552..."}
                                    onBlur={onBlur}
                                    returnKeyType="done"
                                    onChangeText={onChange}
                                    value={value}
                                    size="large"
                                    extraClassNames="font-bold"
                                />
                            )}
                            name="recipient"
                        />
                        <CameraDialog expected="address" onCodeScanned={onCodeScanned}/>
                        <ResolvingAccountCard recipient={recipient}/>
                    </Card>
                    <HorizontalDivider/>
                </View>
                <View>
                    <SelectableAccountList
                        title={t("transfer.yourAccounts")}
                        accountIds={Array.from(permanentAccountIdSet)}
                        selectedAccountId={selectedAccountId}
                        onSelect={handleSelect}
                    />
                    <View className="my-2 border-b h-2"/>
                    <SelectableAccountList
                        title={t("transfer.recentRecipients")}
                        accountIds={Array.from(recentRecipientAccountIdSet)}
                        selectedAccountId={selectedAccountId}
                        onSelect={handleSelect}
                    />

                    <View className="my-2 border-b h-2"/>

                    {/* Burn Account Section - At the bottom */}
                    <View className="mb-4">
                        <Text size="medium" className="font-medium mb-2 px-1">
                            {t("transfer.specialAccounts")}
                        </Text>
                        <BurnAccountCard
                            onSelect={handleBurnSelect}
                            isSelected={isBurnAccountSelected}
                        />
                    </View>

                </View>
            </View>
        </>
    );
};
