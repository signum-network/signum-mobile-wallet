import { View, ScrollView } from "react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";
import { AccountWizardContainer } from "../components/AccountWizardContainer";
import type { AccountCreationAgreement } from "./validation/types";
import { accountCreationAgreementSchema } from "./validation/schemas";
import { Agreement } from "./sections/Agreement";
import { SecretPhraseGeneration } from "./sections/SecretPhraseGeneration";
import { Button } from "@/components/Button";

export enum Steps {
  AccountCreationAgreement,
  SecretPhraseGeneration,
}

export const CreateScreen = () => {
  const { t } = useTranslation();

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

  return (
    <FormProvider {...methods}>
      <View className="flex justify-center items-center flex-1 w-full absolute bottom-0 z-[50] p-4">
        <Button
          type="primary"
          title="Switch"
          fullWidth
          extraClassNames="max-w-sm"
          size="large"
          pressableProps={{
            onPress: () => {
              activeStep === Steps.AccountCreationAgreement
                ? showSecretPhraseGenerationStep()
                : showAccountAgreementStep();
            },
          }}
        />
      </View>

      <ScrollView>
        <AccountWizardContainer>
          {activeStep === Steps.AccountCreationAgreement && (
            <Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
              <Agreement />
            </Animated.View>
          )}

          {activeStep === Steps.SecretPhraseGeneration && (
            <Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
              <SecretPhraseGeneration />
            </Animated.View>
          )}
        </AccountWizardContainer>
      </ScrollView>
    </FormProvider>
  );
};
