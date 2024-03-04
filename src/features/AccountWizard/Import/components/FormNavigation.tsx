import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { FormNavButton } from "@/components/FormNavButton";
import type { AccountImport } from "../utils/types";

interface Props {
  onSubmit: () => void;
}

export const FormNavigation = ({ onSubmit }: Props) => {
  const { t } = useTranslation();
  const { watch, setValue } = useFormContext<AccountImport>();

  const type = watch("type");
  const account = watch("account");
  const walletName = watch("walletName");

  const FormNavButtonProps = useMemo(() => {
    switch (type) {
      // Steps.SecretPhraseVerification
      default:
        return {
          disabled: true,
          pressableProps: {
            onPress: () => {
              onSubmit();
            },
          },
        };
    }
  }, []);

  return (
    <FormNavButton
      type="primary"
      title={t("continue")}
      {...FormNavButtonProps}
    />
  );
};
