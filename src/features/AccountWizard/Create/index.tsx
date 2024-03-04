import { useRef, useEffect, type RefObject } from "react";
import { ScrollView } from "react-native";
import { useForm, FormProvider, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AnimatedSlideContainer } from "@/components/AnimatedSlideContainer";
import { AccountWizardContainer } from "../components/AccountWizardContainer";
import { accountCreationAgreementSchema } from "./utils/schemas";
import { Agreement } from "./sections/Agreement";
import { SecretPhraseGeneration } from "./sections/SecretPhraseGeneration";
import { SecretPhraseVerification } from "./sections/SecretPhraseVerification";
import { type AccountCreationAgreement, Steps } from "./utils/types";
import { FormNavigation } from "./components/FormNavigation";

export const CreateScreen = () => {
  const scrollRef: RefObject<ScrollView> = useRef(null);

  const methods = useForm<AccountCreationAgreement>({
    mode: "onChange",
    resolver: yupResolver(accountCreationAgreementSchema),
    defaultValues: {
      activeStep: Steps.AccountCreationAgreement,
      firstTerm: false,
      secondTerm: false,
      thirdTerm: false,
      seedPhrase: "",
      seedPhraseVerificationIndex: 0,
      seedPhraseVerificationWord: "",
      walletName: "",
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

  const onSubmit: SubmitHandler<AccountCreationAgreement> = (data) => {
    console.log(data);
  };

  return (
    <FormProvider {...methods}>
      <FormNavigation onSubmit={methods.handleSubmit(onSubmit)} />

      <ScrollView ref={scrollRef}>
        <AccountWizardContainer>
          {activeStep === Steps.AccountCreationAgreement && (
            <AnimatedSlideContainer>
              <Agreement />
            </AnimatedSlideContainer>
          )}

          {activeStep === Steps.SecretPhraseGeneration && (
            <AnimatedSlideContainer>
              <SecretPhraseGeneration />
            </AnimatedSlideContainer>
          )}

          {activeStep === Steps.SecretPhraseVerification && (
            <AnimatedSlideContainer>
              <SecretPhraseVerification />
            </AnimatedSlideContainer>
          )}
        </AccountWizardContainer>
      </ScrollView>
    </FormProvider>
  );
};
