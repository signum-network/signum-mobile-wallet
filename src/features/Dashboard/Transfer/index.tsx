import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type RefObject,
} from "react";
import { ScrollView, View, ActivityIndicator } from "react-native";
import { useForm, FormProvider, type SubmitHandler } from "react-hook-form";
import { useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import { AnimatedSlideContainer } from "@/components/AnimatedSlideContainer";
import { useAccount } from "@/hooks/useAccount";
import { WatchOnlyAccountCard } from "@/components/Account/WatchOnlyAccountCard";
import { KeyboardAvoidingView } from "@/components/Form/KeyboardAvoidingView";
import { DashboardScreenContainer } from "../components/DashboardScreenContainer";
import { transactionCreationSchema } from "./utils/schemas";
import { Steps, type TransactionCreation } from "./utils/types";
import { Recipient } from "./sections/Recipient";
import { HoldingsSelection } from "./sections/HoldingsSelection";
import { FormNavigation } from "./components/FormNavigation";
import { FormStepper } from "./components/FormStepper";

export const TransferScreen = () => {
  const { t } = useTranslation();
  const { isWatchOnly } = useAccount();

  const scrollRef: RefObject<ScrollView> = useRef(null);

  const methods = useForm<TransactionCreation>({
    mode: "onChange",
    resolver: yupResolver(transactionCreationSchema),
    defaultValues: {
      activeStep: Steps.Recipient,
      recipient: "",
      amount: 0,
      asset: "",
      assetDecimals: 0,
      includeMemo: false,
      memo: "",
      isMemoEncrypted: false,
      isMemoBinary: false,
      fee: "",
    },
  });

  const activeStep = methods.watch("activeStep");

  useEffect(() => {
    if (!scrollRef.current) return;

    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  }, [activeStep]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        methods.reset();
      };
    }, [])
  );

  const onSubmit: SubmitHandler<TransactionCreation> = async (data) => {
    console.log(data);
  };

  if (isWatchOnly) return <WatchOnlyAccountCard />;

  return (
    <FormProvider {...methods}>
      <FormStepper />
      <FormNavigation onSubmit={methods.handleSubmit(onSubmit)} />

      <KeyboardAvoidingView>
        <ScrollView ref={scrollRef}>
          <DashboardScreenContainer>
            <View className="flex flex-col items-start justify-center w-full px-4 mt-8 pb-20 gap-4">
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
            </View>
          </DashboardScreenContainer>
        </ScrollView>
      </KeyboardAvoidingView>
    </FormProvider>
  );
};
