import {Fragment, useEffect, useMemo} from "react";
import {View} from "react-native";
import {useTranslation} from "react-i18next";
import {useQuery} from "@tanstack/react-query";
import {useFormContext} from "react-hook-form";
import {NumericFormat} from "react-number-format";
import {useWalletAccount} from "@/hooks/useWalletAccount";
import {useTicker} from "@/hooks/useTicker";
import {useNetworkFees} from "@/hooks/useNetworkFees";
import {useLedgerService} from "@/hooks/useLedgerService";
import {useNodeHostStore} from "@/hooks/useNodeHostStore";
import {useNumberSeparator} from "@/hooks/useNumberSeparator";
import {WatchOnlyAccountCard} from "@/components/Account/WatchOnlyAccountCard";
import {Text} from "@/components/Text";
import {Card} from "@/components/Card";
import {Button} from "@/components/Button";
import {TextInput} from "@/components/TextInput";
import {
    PUBLIC_SIGNUM_AVERAGE_BLOCK_TIME_IN_MILLISECONDS,
    PUBLIC_SIGNUM_COMMITMMENT_HEIGHT_DEADLINE,
} from "@/types/constants";
import {OperationType, type ManageCommitment} from "../../utils/types";
import {ButtonTabs} from "./components/ButtonTabs";
import {NoCommitment} from "./components/NoCommitment";
import {CommitmentStatusTracker} from "./components/CommitmentStatusTracker";
import type {CommitmentStatus} from "./types";

import Ionicons from "@expo/vector-icons/Ionicons";

interface Props {
    availableBalance: number;
    committedBalance: number;
    onSubmit: () => void;
}

export const Operation = ({
                              availableBalance,
                              committedBalance,
                              onSubmit,
                          }: Props) => {
    const {t} = useTranslation();
    const {NativeTicker} = useTicker();
    const {isWatchOnly, publicKey, accountId} = useWalletAccount();
    const {cheap} = useNetworkFees({});
    const {ledgerService} = useLedgerService();
    const {isActiveNodeSynced, currentNetwork, activeNodeNumberOfBlocks} =
        useNodeHostStore();
    const {watch, setValue, resetField} = useFormContext<ManageCommitment>();
    const numberSeparator = useNumberSeparator();

    const amount = watch("amount");

    const type = watch("type");
    const isOperationTypeAdd = type === OperationType.Add;
    const isOperationTypeRemove = type === OperationType.Remove;

    const setAddMode = () => setValue("type", OperationType.Add);
    const setRemoveMode = () => setValue("type", OperationType.Remove);

    useEffect(() => resetField("amount"), [type]);

    const signaFees = Number(cheap.getSigna());

    const maxAvailableBalance = isOperationTypeAdd
        ? availableBalance - signaFees
        : committedBalance - signaFees;

    const setMaxAvailableBalance = () => setValue("amount", maxAvailableBalance);

    const {data} = useQuery({
        queryKey: ["fetchAccountCommitmentStatus", publicKey, currentNetwork],
        queryFn: async () => {
            let lastForgedBlockHeight = 0;
            let lastAddCommitmentTransactionBlockHeight = 0;

            try {
                if (!ledgerService) throw new Error();

                const block = await ledgerService.account
                    .with(accountId)
                    .fetchLastBlockFound();

                const transaction = await ledgerService.account
                    .with(accountId)
                    .fetchLastAddCommitmentTransaction();

                if (block) lastForgedBlockHeight = block.height;
                if (transaction)
                    lastAddCommitmentTransactionBlockHeight = transaction.height;
            } catch (error) {
                lastForgedBlockHeight = 0;
                lastAddCommitmentTransactionBlockHeight = 0;
            } finally {
                return {
                    lastForgedBlockHeight,
                    lastAddCommitmentTransactionBlockHeight,
                };
            }
        },
        refetchInterval: PUBLIC_SIGNUM_AVERAGE_BLOCK_TIME_IN_MILLISECONDS,
        staleTime: PUBLIC_SIGNUM_AVERAGE_BLOCK_TIME_IN_MILLISECONDS,
        enabled: isActiveNodeSynced && !!ledgerService,
    });

    const commitmentStatus = useMemo<CommitmentStatus>(() => {
        let forgedBlockRecently = false;
        let forgedBlockTimeFrame = 0;

        let isCommitmentBalanceUpdating = false;
        let commitmentBalanceUpdateTimeFrame = 0;

        if (!data || !activeNodeNumberOfBlocks) {
            return {
                forgedBlockRecently,
                forgedBlockTimeFrame,
                isCommitmentBalanceUpdating,
                commitmentBalanceUpdateTimeFrame,
            };
        }

        const {lastForgedBlockHeight, lastAddCommitmentTransactionBlockHeight} =
            data;

        const forgedBlockDeadline =
            lastForgedBlockHeight + PUBLIC_SIGNUM_COMMITMMENT_HEIGHT_DEADLINE;

        forgedBlockRecently = activeNodeNumberOfBlocks < forgedBlockDeadline;
        forgedBlockTimeFrame = forgedBlockDeadline - activeNodeNumberOfBlocks;

        const addCommitmmentDeadline =
            lastAddCommitmentTransactionBlockHeight +
            PUBLIC_SIGNUM_COMMITMMENT_HEIGHT_DEADLINE;

        isCommitmentBalanceUpdating =
            activeNodeNumberOfBlocks < addCommitmmentDeadline;

        commitmentBalanceUpdateTimeFrame =
            addCommitmmentDeadline - activeNodeNumberOfBlocks;

        return {
            forgedBlockRecently,
            forgedBlockTimeFrame,
            isCommitmentBalanceUpdating,
            commitmentBalanceUpdateTimeFrame,
        };
    }, [data, activeNodeNumberOfBlocks]);

    if (isWatchOnly) {
        return (
            <Card>
                <WatchOnlyAccountCard/>

                <CommitmentStatusTracker
                    isOperationTypeAdd={isOperationTypeAdd}
                    isOperationTypeRemove={isOperationTypeRemove}
                    committedBalance={committedBalance}
                    {...commitmentStatus}
                />
            </Card>
        );
    }


    const accountHasNoCommittedFunds = isOperationTypeRemove && !committedBalance;

    const canRemoveCommitment =
        isOperationTypeRemove &&
        !accountHasNoCommittedFunds &&
        !commitmentStatus.forgedBlockRecently &&
        !commitmentStatus.isCommitmentBalanceUpdating;

    const canManageCommitment = isOperationTypeAdd || canRemoveCommitment;

    const notEnoughFunds =
        (isOperationTypeAdd && maxAvailableBalance < amount) || (isOperationTypeRemove && maxAvailableBalance < amount);

    const belowMinAddAmount =
        isOperationTypeAdd &&
        !!amount &&
        Number(amount) < 0.2;

    const insufficientFeeFunds = availableBalance < 0.2;
    const canSubmit = !!amount && !notEnoughFunds && !belowMinAddAmount

    return (
        <Fragment>
            <ButtonTabs
                isOperationTypeAdd={isOperationTypeAdd}
                isOperationTypeRemove={isOperationTypeRemove}
                setAddMode={setAddMode}
                setRemoveMode={setRemoveMode}
            />

            <CommitmentStatusTracker
                isOperationTypeAdd={isOperationTypeAdd}
                isOperationTypeRemove={isOperationTypeRemove}
                committedBalance={committedBalance}
                {...commitmentStatus}
            />

            {accountHasNoCommittedFunds ? (
                <NoCommitment/>
            ) : canManageCommitment ? (
                <Fragment>
                    <Card>
                        <View className="w-full flex flex-col items-center justify-center gap-2">
                            <Text fullWidth className="text-center font-medium">
                                {t(
                                    isOperationTypeAdd
                                        ? "commitment.howMuchToCommit"
                                        : "commitment.howMuchToUnCommit",
                                    {ticker: NativeTicker}
                                )}
                            </Text>

                            <NumericFormat
                                value={amount}
                                displayType="text"
                                valueIsNumericString
                                allowLeadingZeros
                                allowNegative={false}
                                thousandSeparator={numberSeparator.thousand || ","}
                                decimalSeparator={numberSeparator.decimal || "."}
                                decimalScale={8}
                                onChange={undefined}
                                onValueChange={(values) => {
                                    // @ts-expect-error allow the user to enter a decimal separator
                                    setValue("amount", values.value);
                                }}
                                renderText={(value) => (
                                    <TextInput
                                        value={value ?? ""}
                                        onChangeText={(data) => {
                                            // @ts-expect-error allow the user to enter a decimal separator
                                            setValue("amount", data);
                                        }}
                                        keyboardType="numeric"
                                        placeholder={t("transfer.enterAmount")}
                                        textAlign="center"
                                        size="large"
                                        extraClassNames="font-medium"
                                    />
                                )}
                            />

                            <Button
                                type="blackout"
                                title={t(
                                    isOperationTypeAdd
                                        ? "maxButton"
                                        : "commitment.useAllCommittedBalance"
                                )}
                                size="medium"
                                extraClassNames="mt-2"
                                wide
                                pressableProps={{onPress: setMaxAvailableBalance}}
                            />

                            {insufficientFeeFunds && (
                                <Text color="error" size="small" className="text-center m-2">
                                    {t("notEnoughForFee")}
                                </Text>
                            )}

                            {(!!amount && notEnoughFunds && !insufficientFeeFunds) && (
                                <Text color="error" className="font-medium my-2">
                                    {t("notEnoguhFunds")}
                                </Text>
                            )}
                        </View>
                    </Card>

                    <Card>
                        <Text color="muted" className="text-center" fullWidth>
                            {t("transfer.pressTheButtonLonger")}
                        </Text>

                        <Button
                            icon={<Ionicons name="send" size={24} color="white"/>}
                            type="primary"
                            size="large"
                            title={t("transfer.confirmTransaction")}
                            pressableProps={{
                                delayLongPress: 2000,
                                onLongPress: onSubmit,
                                disabled: !canSubmit,
                            }}
                            fullWidth
                        />
                    </Card>

                </Fragment>
            ) : null}
        </Fragment>
    );
};
