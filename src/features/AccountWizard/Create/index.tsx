import { useRef, useState, useEffect, type RefObject } from "react";
import { ScrollView } from "react-native";
import { useForm, FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import { AccountWizardContainer } from "../components/AccountWizardContainer";
import type { AccountCreationAgreement } from "./validation/types";
import { accountCreationAgreementSchema } from "./validation/schemas";
import { Agreement } from "./sections/Agreement";
import { SecretPhraseGeneration } from "./sections/SecretPhraseGeneration";
import { AnimatedSlideContainer } from "@/components/AnimatedSlideContainer";
import { FormNavButton } from "@/components/FormNavButton";

enum Steps {
  AccountCreationAgreement,
  SecretPhraseGeneration,
}

export const CreateScreen = () => {
  const { t } = useTranslation();
  const scrollRef: RefObject<ScrollView> = useRef(null);

  const [activeStep, setActiveStep] = useState(Steps.AccountCreationAgreement);
  const showAccountAgreementStep = () =>
    setActiveStep(Steps.AccountCreationAgreement);
  const showSecretPhraseGenerationStep = () =>
    setActiveStep(Steps.SecretPhraseGeneration);

  const methods = useForm<AccountCreationAgreement>({
    mode: "onChange",
    resolver: yupResolver(accountCreationAgreementSchema),
    defaultValues: {
      firstTerm: false,
      secondTerm: false,
      thirdTerm: false,
    },
  });

  const { watch } = methods;

  const firstTerm = watch("firstTerm");
  const secondTerm = watch("secondTerm");
  const thirdTerm = watch("thirdTerm");

  const canCompleteFirstStep = firstTerm && secondTerm && thirdTerm;

  useEffect(() => {
    if (!scrollRef.current) return;

    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  }, [activeStep]);

  return (
    <FormProvider {...methods}>
      <FormNavButton
        type="primary"
        title={t("continue")}
        disabled={!canCompleteFirstStep}
        pressableProps={{
          onPress: () => {
            activeStep === Steps.AccountCreationAgreement
              ? showSecretPhraseGenerationStep()
              : showAccountAgreementStep();
          },
        }}
      />

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
        </AccountWizardContainer>
      </ScrollView>
    </FormProvider>
  );
};
