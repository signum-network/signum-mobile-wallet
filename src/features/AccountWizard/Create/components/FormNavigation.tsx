import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { FormNavButton } from "@/components/FormNavButton";
import { type AccountCreationAgreement, Steps } from "../utils/types";

interface Props {
  onSubmit: () => void;
}

export const FormNavigation = ({ onSubmit }: Props) => {
  const { t } = useTranslation();
  const { watch, setValue } = useFormContext<AccountCreationAgreement>();

  const activeStep = watch("activeStep");
  const firstTerm = watch("firstTerm");
  const secondTerm = watch("secondTerm");
  const thirdTerm = watch("thirdTerm");
  const seedPhrase = watch("seedPhrase");

  const canCompleteFirstStep = firstTerm && secondTerm && thirdTerm;

  const FormNavButtonProps = useMemo(() => {
    switch (activeStep) {
      // Steps.AccountCreationAgreement
      case Steps.AccountCreationAgreement:
        return {
          disabled: !canCompleteFirstStep,
          pressableProps: {
            onPress: () => setValue("activeStep", Steps.SecretPhraseGeneration),
          },
        };

      // Steps.SecretPhraseGeneration
      default:
        return {
          pressableProps: {
            disabled: !seedPhrase,
            onPress: () => {
              onSubmit();
            },
          },
        };
    }
  }, [activeStep, canCompleteFirstStep]);

  return (
    <FormNavButton
      type="primary"
      title={t("continue")}
      {...FormNavButtonProps}
    />
  );
};
