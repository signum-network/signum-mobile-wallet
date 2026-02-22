import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { FormNavButton } from "@/components/Form/NavButton";
import { type ProfileEdit, Steps } from "../utils/types";

export const FormNavigation = () => {
  const { t } = useTranslation();
  const { watch, setValue, formState } = useFormContext<ProfileEdit>();

  const activeStep = watch("activeStep");
  const { isValid } = formState;

  const FormNavButtonProps = useMemo(() => {
    switch (activeStep) {
      case Steps.ProfileForm:
        return {
          disabled: !isValid,
          pressableProps: {
            onPress: () => setValue("activeStep", Steps.Confirmation),
          },
        };

      // Steps.Confirmation
      default:
        return {
          disabled: true,
        };
    }
  }, [activeStep, isValid, setValue]);

  return (
    <FormNavButton
      inline
      type="primary"
      title={t("continue")}
      hidden={activeStep === Steps.Confirmation}
      {...FormNavButtonProps}
    />
  );
};
