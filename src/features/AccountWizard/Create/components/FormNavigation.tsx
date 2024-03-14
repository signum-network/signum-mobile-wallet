import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { FormNavButton } from "@/components/Form/NavButton";
import { type AccountCreation, Steps } from "../utils/types";

interface Props {
  onSubmit: () => void;
}

export const FormNavigation = ({ onSubmit }: Props) => {
  const { t } = useTranslation();
  const { watch, setValue } = useFormContext<AccountCreation>();

  const activeStep = watch("activeStep");
  const firstTerm = watch("firstTerm");
  const secondTerm = watch("secondTerm");
  const thirdTerm = watch("thirdTerm");
  const seedPhrase = watch("seedPhrase");
  const seedPhraseVerificationIndex = watch("seedPhraseVerificationIndex");
  const seedPhraseVerificationWord = watch("seedPhraseVerificationWord");
  const walletName = watch("walletName");

  const canCompleteFirstStep = firstTerm && secondTerm && thirdTerm;
  const canCompleteSecondStep = !!seedPhrase;

  const isCorrectWord =
    seedPhraseVerificationWord ===
    seedPhrase.split(" ").at(seedPhraseVerificationIndex - 1);

  const canCompleteThirdStep = !!walletName.trim() && isCorrectWord;

  const FormNavButtonProps = useMemo(() => {
    switch (activeStep) {
      case Steps.AccountCreationAgreement:
        return {
          disabled: !canCompleteFirstStep,
          pressableProps: {
            onPress: () => {
              setValue("activeStep", Steps.SecretPhraseGeneration);
            },
          },
        };

      case Steps.SecretPhraseGeneration:
        return {
          disabled: !canCompleteSecondStep,
          pressableProps: {
            onPress: () => {
              setValue("activeStep", Steps.SecretPhraseVerification);
            },
          },
        };

      // Steps.SecretPhraseVerification
      default:
        return {
          disabled: !canCompleteThirdStep,
          pressableProps: {
            onPress: () => {
              onSubmit();
            },
          },
        };
    }
  }, [
    activeStep,
    canCompleteFirstStep,
    canCompleteSecondStep,
    canCompleteThirdStep,
  ]);

  return (
    <FormNavButton
      type="primary"
      title={t("continue")}
      {...FormNavButtonProps}
    />
  );
};
