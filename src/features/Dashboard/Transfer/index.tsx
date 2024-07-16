import {
  useRef,
  useEffect,
  useCallback,
  useState,
  type RefObject,
} from "react";
import { ScrollView, View } from "react-native";
import { useGlobalSearchParams } from "expo-router";
import { useForm, FormProvider, type SubmitHandler } from "react-hook-form";
import { useFocusEffect } from "expo-router";
import { yupResolver } from "@hookform/resolvers/yup";
import { Amount, ChainValue } from "@signumjs/util";
import { AttachmentMessage, AttachmentEncryptedMessage } from "@signumjs/core";
import { encryptMessage } from "@signumjs/crypto";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatedSlideContainer } from "@/components/AnimatedSlideContainer";
import { useAccount } from "@/hooks/useAccount";
import { useLedgerService } from "@/hooks/useLedgerService";
import { useNodeHostStore } from "@/hooks/useNodeHostStore";
import { WatchOnlyAccountCard } from "@/components/Account/WatchOnlyAccountCard";
import { KeyboardAvoidingView } from "@/components/Form/KeyboardAvoidingView";
import { SigningDialog } from "@/components/SigningDialog";
import { readSecretKey } from "@/utils/sec/handleSecretKeys";
import { asAddress } from "@/utils/account/asAddress";
import { DashboardScreenContainer } from "../components/DashboardScreenContainer";
import { transactionCreationSchema } from "./utils/schemas";
import {
  Steps,
  type TransactionCreation,
  type GlobalSearchParams,
} from "./utils/types";
import { Recipient } from "./sections/Recipient";
import { HoldingsSelection } from "./sections/HoldingsSelection";
import { MemoOptions } from "./sections/MemoOptions";
import { FeeSelection } from "./sections/FeeSelection";
import { Confirmation } from "./sections/Confirmation";
import { FormNavigation } from "./components/FormNavigation";
import { FormStepper } from "./components/FormStepper";

export const TransferScreen = () => {
  const { ledgerService } = useLedgerService();
  const { isWatchOnly, publicKey, accountId } = useAccount();
  const { currentNetwork } = useNodeHostStore();
  const { asset } = useGlobalSearchParams<GlobalSearchParams>();

  const [isSigningTransaction, setIsSigningTransaction] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  const queryClient = useQueryClient();

  const scrollRef: RefObject<ScrollView> = useRef(null);

  const methods = useForm<TransactionCreation>({
    mode: "onChange",
    resolver: yupResolver(transactionCreationSchema),
    defaultValues: {
      activeStep: Steps.Recipient,
      recipient: "",
      asset: asset || "0",
      includeMemo: false,
      memo: "",
      isMemoEncrypted: false,
      isMemoBinary: false,
    },
  });

  const activeStep = methods.watch("activeStep");

  const scrollToTop = () => {
    if (!scrollRef.current) return;

    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  useEffect(() => scrollToTop(), [activeStep]);

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

  const onSubmit: SubmitHandler<TransactionCreation> = async (data) => {
    const {
      amount,
      asset,
      assetDecimals,
      fee,
      recipient,
      includeMemo,
      memo,
      isMemoEncrypted,
      isMemoBinary,
    } = data;

    await readSecretKey(publicKey)
      .then(async (data) => {
        if (!data || !ledgerService) throw new Error("invalid data");

        setIsSigningTransaction(true);

        const { signPrivateKey, agreementPrivateKey } = data;

        const recipientId = asAddress(recipient).getNumericId();

        const feePlanck = Amount.fromPlanck(fee).getPlanck();

        let attachment = undefined;

        if (includeMemo) {
          if (isMemoEncrypted) {
            const encryptedPayload = encryptMessage(
              memo,
              publicKey,
              agreementPrivateKey
            );

            attachment = new AttachmentEncryptedMessage({
              ...encryptedPayload,
              isText: !isMemoBinary,
            });
          } else {
            attachment = new AttachmentMessage({
              messageIsText: !isMemoBinary,
              message: memo,
            });
          }
        }

        let confirmation;

        if (asset === "0") {
          confirmation =
            await ledgerService.ledgerInstance.transaction.sendAmountToSingleRecipient(
              {
                recipientId,
                amountPlanck: Amount.fromSigna(amount).getPlanck(),
                feePlanck,
                senderPrivateKey: signPrivateKey,
                senderPublicKey: publicKey,
                attachment,
              }
            );
        } else {
          confirmation = await ledgerService.ledgerInstance.asset.transferAsset(
            {
              recipientId,
              assetId: asset,
              quantity: ChainValue.create(assetDecimals)
                .setCompound(amount)
                .getAtomic(),
              feePlanck,
              senderPrivateKey: signPrivateKey,
              senderPublicKey: publicKey,
              attachment,
            }
          );
        }

        // @ts-expect-error typing issue between choosing <TransactionId | UnsignedTransaction>
        if (confirmation?.transaction) {
          // @ts-ignore
          setTransactionId(confirmation.transaction);
        }

        scrollToTop();

        setIsComplete(true);
      })
      .catch((e) => console.error(e))
      .finally(() => {
        queryClient.invalidateQueries({
          queryKey: [
            "fetchAccountTransactionsBasicOverview",
            accountId,
            currentNetwork,
          ],
        });

        setIsSigningTransaction(false);
      });
  };

  if (isWatchOnly) return <WatchOnlyAccountCard />;

  return (
    <FormProvider {...methods}>
      <SigningDialog visible={isSigningTransaction} />

      {!isComplete && <FormStepper />}

      <FormNavigation />

      <KeyboardAvoidingView>
        <ScrollView ref={scrollRef}>
          <DashboardScreenContainer>
            <View className="flex flex-col items-start justify-center w-full px-4 mt-4 pb-20 gap-4">
              {activeStep === Steps.Recipient && (
                <AnimatedSlideContainer>
                  <Recipient />
                </AnimatedSlideContainer>
              )}

              {activeStep === Steps.HoldingsSelection && (
                <AnimatedSlideContainer>
                  <HoldingsSelection />
                </AnimatedSlideContainer>
              )}

              {activeStep === Steps.MemoOptions && (
                <AnimatedSlideContainer>
                  <MemoOptions />
                </AnimatedSlideContainer>
              )}

              {activeStep === Steps.FeeSelection && (
                <AnimatedSlideContainer>
                  <FeeSelection />
                </AnimatedSlideContainer>
              )}

              {activeStep === Steps.Confirmation && (
                <AnimatedSlideContainer>
                  <Confirmation
                    onSubmit={methods.handleSubmit(onSubmit)}
                    isComplete={isComplete}
                    transactionId={transactionId}
                    disableOnSubmit={isSigningTransaction || isComplete}
                  />
                </AnimatedSlideContainer>
              )}
            </View>
          </DashboardScreenContainer>
        </ScrollView>
      </KeyboardAvoidingView>
    </FormProvider>
  );
};
