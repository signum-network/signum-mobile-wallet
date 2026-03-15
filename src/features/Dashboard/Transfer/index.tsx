import {
    useRef,
    useEffect,
    useCallback,
    useState,
    type RefObject,
} from "react";
import {useTranslation} from "react-i18next";
import {ScrollView} from "react-native";
import {useGlobalSearchParams, useFocusEffect} from "expo-router";
import {useForm, FormProvider, type SubmitHandler} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {Amount, ChainValue} from "@signumjs/util";
import {AttachmentMessage, AttachmentEncryptedMessage} from "@signumjs/core";
import {encryptMessage} from "@signumjs/crypto";
import {useQueryClient} from "@tanstack/react-query";
import {useWalletAccount} from "@/hooks/useWalletAccount";
import {useLedgerService} from "@/hooks/useLedgerService";
import {useNodeHostStore} from "@/hooks/useNodeHostStore";
import {WatchOnlyAccountCard} from "@/components/Account/WatchOnlyAccountCard";
import {SigningDialog} from "@/components/SigningDialog";
import {readSecretKey} from "@/utils/sec/handleSecretKeys";
import {asAddress} from "@/utils/account/asAddress";
import {getAccountPublicKey} from "@/utils/account/getAccountPublicKey";
import {transactionCreationSchema} from "./utils/schemas";
import {
    Steps,
    type TransactionCreation,
    type GlobalSearchParams,
} from "./utils/types";
import {Recipient} from "./sections/Recipient";
import {HoldingsSelection} from "./sections/HoldingsSelection";
import {MemoOptions} from "./sections/MemoOptions";
import {FeeSelection} from "./sections/FeeSelection";
import {Confirmation} from "./sections/Confirmation";
import {FormNavigation} from "./components/FormNavigation";
import {FormStepper} from "./components/FormStepper";
import {pendingDeepLinkStore} from "@/states/pendingDeepLinkStore";

type TransferDeeplinkParams = {
    amountPlanck: string,
    recipient: string,
    message?: string,
    messageIsText?: boolean,
    encrypt?: boolean
}


export const TransferScreen = () => {
    const {t} = useTranslation();
    const {ledgerService} = useLedgerService();
    const {isWatchOnly, publicKey, accountId} = useWalletAccount();
    const {currentNetwork} = useNodeHostStore();
    const {asset: routeAsset} = useGlobalSearchParams<GlobalSearchParams>();

    const [isSigningTransaction, setIsSigningTransaction] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [transactionId, setTransactionId] = useState("");

    const queryClient = useQueryClient();

    const scrollRef: RefObject<ScrollView> = useRef(null!);

    const methods = useForm<TransactionCreation>({
        mode: "onChange",
        resolver: yupResolver(transactionCreationSchema),
        defaultValues: {
            activeStep: Steps.Recipient,
            recipient: "",
            asset: routeAsset || "0",
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

    // Reset form on focus, applying pending deep link values if available
    useFocusEffect(
        useCallback(() => {
            const initialAsset = routeAsset || "0";
            const {pendingDeepLink, clearPendingDeepLink} = pendingDeepLinkStore.getState();

            const defaults: Partial<TransactionCreation> = {
                activeStep: Steps.Recipient,
                recipient: "",
                asset: initialAsset,
                includeMemo: false,
                memo: "",
                isMemoEncrypted: false,
                isMemoBinary: false,
            };

            if (pendingDeepLink) {
                const {
                    recipient,
                    amountPlanck,
                    encrypt,
                    messageIsText,
                    message
                } = pendingDeepLink.params as TransferDeeplinkParams;
                if (recipient) {
                    defaults.recipient = recipient;
                }
                if (amountPlanck) {
                    try {
                        defaults.amount = parseFloat(Amount.fromPlanck(amountPlanck).getSigna());
                        defaults.asset = "0";
                    } catch {
                    }
                }
                if (encrypt) {
                    defaults.isMemoEncrypted = true;
                }
                if (messageIsText === false) {
                    defaults.isMemoBinary = true;
                }
                if (message) {
                    defaults.memo = message;
                    defaults.includeMemo = true;
                }
                clearPendingDeepLink();
            }

            methods.reset(defaults);
            setIsSigningTransaction(false);
            setIsComplete(false);
            setTransactionId("");
            return () => {
            };
        }, [routeAsset, methods])
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

        try {
            const secretKeys = await readSecretKey(publicKey);

            if (!ledgerService || !secretKeys) throw new Error("invalid data");

            setIsSigningTransaction(true);

            const {signPrivateKey, agreementPrivateKey} = secretKeys;

            const recipientId = asAddress(recipient).getNumericId();

            let recipientPublicKey = undefined;
            if (recipientId !== "0") {
                recipientPublicKey = await getAccountPublicKey(recipientId);
                if (!recipientPublicKey) return alert(t("accountDoesNotExists"));
            }

            const feePlanck = Amount.fromPlanck(fee).getPlanck();
            let attachment = undefined;

            if (includeMemo) {
                if (isMemoEncrypted && recipientPublicKey) {
                    // can only encrypt with
                    const encryptedPayload = await encryptMessage(
                        memo,
                        recipientPublicKey,
                        agreementPrivateKey
                    );

                    attachment = new AttachmentEncryptedMessage(encryptedPayload);
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
                            recipientPublicKey,
                        }
                    );
            } else {
                confirmation = await ledgerService.ledgerInstance.asset.transferAsset({
                    recipientId,
                    assetId: asset,
                    quantity: ChainValue.create(assetDecimals)
                        .setCompound(amount)
                        .getAtomic(),
                    feePlanck,
                    senderPrivateKey: signPrivateKey,
                    senderPublicKey: publicKey,
                    attachment,
                    recipientPublicKey,
                });
            }

            // @ts-expect-error typing issue between choosing <TransactionId | UnsignedTransaction>
            if (confirmation?.transaction) {
                // @ts-ignore
                setTransactionId(confirmation.transaction);
            }

            scrollToTop();

            setIsComplete(true);
            queryClient.invalidateQueries({
                queryKey: [
                    "fetchAccountTransactionsBasicOverview",
                    accountId,
                    currentNetwork,
                ],
            });
        } catch (error) {
            alert("Error: " + JSON.stringify(error));
        } finally {

            setIsSigningTransaction(false);
        }
    };

    if (isWatchOnly) return <WatchOnlyAccountCard/>;

    return (
        <FormProvider {...methods}>
            <SigningDialog visible={isSigningTransaction}/>
            {!isComplete && <FormStepper/>}
            <ScrollView
                ref={scrollRef}
                className="flex-1"
                contentContainerClassName="items-start w-full px-4 py-4 gap-4"
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="handled"
            >
                {activeStep === Steps.Recipient && <Recipient/>}
                {activeStep === Steps.HoldingsSelection && <HoldingsSelection/>}
                {activeStep === Steps.MemoOptions && <MemoOptions/>}
                {activeStep === Steps.FeeSelection && <FeeSelection/>}
                {activeStep === Steps.Confirmation && (
                    <Confirmation
                        onSubmit={methods.handleSubmit(onSubmit)}
                        isComplete={isComplete}
                        transactionId={transactionId}
                        disableOnSubmit={isSigningTransaction || isComplete}
                    />
                )}

            </ScrollView>
            <FormNavigation/>
        </FormProvider>
    );
};
