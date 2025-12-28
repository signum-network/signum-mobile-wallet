import {View, ScrollView} from "react-native";
import {useMemo} from "react";
import {useTranslation} from "react-i18next";
import {useFormContext, Controller} from "react-hook-form";
import type {BarcodeScanningResult} from "expo-camera";
import {Text} from "@/components/Text";
import {Card} from "@/components/Card";
import {TextInput} from "@/components/TextInput";
import {CameraDialog} from "@/components/CameraDialog";
import type {TransactionCreation} from "../../utils/types";
import {ResolvedAccountCard} from "../../components/ResolvedAccountCard";
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

    // const recipientList = recipients.filter((r) => !accountsSet.has(r.publicKey));
    //
    // useEffect(() => {
    //     let cancelled = false;
    //     const loadProfiles = async () => {
    //         if (!ledgerService || recipientList.length === 0) return;
    //
    //         const entries = await Promise.all(
    //             recipientList.map(async (r) => {
    //                 try {
    //                     const accountId = Address.fromPublicKey(r.publicKey).getNumericId();
    //                     const acc = await ledgerService.ledgerInstance.account.getAccount({
    //                         accountId,
    //                     });
    //
    //                     const rawName = (acc?.name ?? "").trim();
    //                     const shortName =
    //                         rawName.length > 30 ? `${rawName.slice(0, 30)}…` : rawName;
    //                     return [
    //                         r.publicKey,
    //                         {
    //                             name: shortName || undefined,
    //                             description: acc?.description ?? "",
    //                         },
    //                     ] as const;
    //                 } catch {
    //                     return [r.publicKey, {name: undefined, description: ""}] as const;
    //                 }
    //             })
    //         );
    //
    //         if (!cancelled) {
    //             setRecipientProfiles(Object.fromEntries(entries));
    //         }
    //     };
    //
    //
    //
    //     loadProfiles();
    //     return () => {
    //         cancelled = true;
    //     };
    // }, [ledgerService, recipientList]);

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

                for (const outgoingTransaction of outgoingTransactions.transactions) {
                    const recipientId = outgoingTransaction.recipient;
                    if (recipientId && !permanentAccountIdSet.has(recipientId)) {
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

    const handleSelect = (accountId: string) => {
        setValue("recipient", asRSAddress(accountId) ?? "", {shouldValidate: true, shouldDirty: true});
    };

    // const uniqueRecentRecipientIds = useMemo(() => {
    //
    //     if (!recentRecipientAccountIdSet || recentRecipientAccountIdSet.length === 0) return []
    //
    //     // we filter out accounts that are already in the list of permanently added accounts
    //     const permanentAccounts = permanentAccountIdSet
    //         .map(acc => {
    //             try {
    //                 return Address.fromPublicKey(acc.publicKey).getNumericId()
    //             } catch {
    //                 return ""
    //             }
    //         }).filter(acc => acc !== "")
    //     const unique = new Set(permanentAccounts)
    //     recentRecipientAccountIdSet.forEach(accountId => unique.add(accountId))
    //     return Array.from(unique);
    // }, [accounts, recentRecipientAccountIdSet]);


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
                        <ResolvedAccountCard simple/>
                    </Card>
                    <HorizontalDivider/>
                </View>
                <ScrollView contentContainerStyle={{paddingBottom: 96}}>
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
                    <View className="h-24"/>
                </ScrollView>
            </View>
        </>
    );
};
