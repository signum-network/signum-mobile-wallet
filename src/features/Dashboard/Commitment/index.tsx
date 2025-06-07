import { useMemo, useState, useCallback } from "react";
import { ScrollView, View } from "react-native";
import { useForm, FormProvider, type SubmitHandler } from "react-hook-form";
import { useFocusEffect } from "expo-router";
import { Amount } from "@signumjs/util";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import { useAccount } from "@/hooks/useAccount";
import { useNodeHostStore } from "@/hooks/useNodeHostStore";
import { useLedgerService } from "@/hooks/useLedgerService";
import { useNetworkFees } from "@/hooks/useNetworkFees";
import { KeyboardAvoidingView } from "@/components/Form/KeyboardAvoidingView";
import { SigningDialog } from "@/components/SigningDialog";
import { readSecretKey } from "@/utils/sec/handleSecretKeys";
import { DashboardScreenContainer } from "../components/DashboardScreenContainer";
import { Balance } from "./sections/Balance";
import { Operation } from "./sections/Operation";
import { CompleteCard } from "./components/CompleteCard";
import { manageCommitmentSchema } from "./utils/schemas";
import { OperationType, type ManageCommitment } from "./utils/types";

export const CommitmentScreen = () => {
  const { ledgerService } = useLedgerService();
  const {
    accountId,
    publicKey,
    accountData: { balance },
  } = useAccount();
  const { cheap } = useNetworkFees({});
  const { currentNetwork } = useNodeHostStore();

  const [isSigningTransaction, setIsSigningTransaction] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  const queryClient = useQueryClient();

  const availableBalance = useMemo(() => {
    return balance?.availableBalance?.getSigna
      ? Number(balance?.availableBalance?.getSigna())
      : 0;
  }, [balance]);

  const committedBalance = useMemo(() => {
    return balance?.committedBalance?.getSigna
      ? Number(balance?.committedBalance?.getSigna())
      : 0;
  }, [balance]);

  const methods = useForm<ManageCommitment>({
    mode: "onChange",
    resolver: yupResolver(manageCommitmentSchema),
    defaultValues: {
      type: OperationType.Add,
    },
  });

  useFocusEffect(
    useCallback(() => {
      return () => {
        methods.reset();
        setIsSigningTransaction(false);
        setIsComplete(false);
        setTransactionId("");
      };
    }, [])
  );

  const onSubmit: SubmitHandler<ManageCommitment> = async (data) => {
    const { type, amount } = data;

    try {
      const secretKeys = await readSecretKey(publicKey);

      if (!ledgerService || !secretKeys) throw new Error("invalid data");

      setIsSigningTransaction(true);

      const { signPrivateKey } = secretKeys;

      const amountPlanck = Amount.fromSigna(amount).getPlanck();
      const feePlanck = cheap.getPlanck();

      let confirmation;

      if (type === OperationType.Add) {
        confirmation = await ledgerService.ledgerInstance.account.addCommitment(
          {
            amountPlanck,
            feePlanck,
            senderPrivateKey: signPrivateKey,
            senderPublicKey: publicKey,
          }
        );
      } else {
        confirmation =
          await ledgerService.ledgerInstance.account.removeCommitment({
            amountPlanck,
            feePlanck,
            senderPrivateKey: signPrivateKey,
            senderPublicKey: publicKey,
          });
      }

      // @ts-expect-error typing issue between choosing <TransactionId | UnsignedTransaction>
      if (confirmation?.transaction) {
        // @ts-ignore
        setTransactionId(confirmation.transaction);
      }

      setIsComplete(true);
    } catch (error) {
      alert("Error: " + JSON.stringify(error));
    } finally {
      queryClient.invalidateQueries({
        queryKey: [
          "fetchAccountTransactionsBasicOverview",
          accountId,
          currentNetwork,
        ],
      });

      setIsSigningTransaction(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <SigningDialog visible={isSigningTransaction} />

      <KeyboardAvoidingView>
        <ScrollView>
          <DashboardScreenContainer>
            <View className="flex flex-col items-start justify-center w-full px-4 pt-4 pb-20 gap-4">
              <Balance
                availableBalance={availableBalance}
                committedBalance={committedBalance}
              />

              {!isComplete ? (
                <Operation
                  availableBalance={availableBalance}
                  committedBalance={committedBalance}
                  onSubmit={methods.handleSubmit(onSubmit)}
                />
              ) : (
                <CompleteCard transactionId={transactionId} />
              )}
            </View>
          </DashboardScreenContainer>
        </ScrollView>
      </KeyboardAvoidingView>
    </FormProvider>
  );
};
