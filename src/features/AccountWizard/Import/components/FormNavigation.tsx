import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { FormNavButton } from "@/components/Form/NavButton";
import type { AccountImport } from "../utils/types";
import { AccountType } from "@/types/account";
import { useAccountStore } from "@/hooks/useAccountStore";

interface Props {
  onSubmit: () => void;
}

export const FormNavigation = ({ onSubmit }: Props) => {
  const { t } = useTranslation();
  const { watch } = useFormContext<AccountImport>();
  const { isAccountEnrolled } = useAccountStore();

  const type = watch("type");
  const account = watch("account");
  const isAccountValid = watch("isAccountValid");
  const walletName = watch("walletName");
  const mnemonicAccountAgreement = watch("mnemonicAccountAgreement");

  const canImportAccount = account.trim() && walletName;

  const FormNavButtonProps = useMemo(() => {
    switch (type) {
      case AccountType.mnemonic:
        return {
          disabled: !(canImportAccount && mnemonicAccountAgreement),
        };

      // AccountType.watchOnly
      default:
        return {
          disabled: !(canImportAccount && !isAccountValid),
        };
    }
  }, [canImportAccount, mnemonicAccountAgreement, isAccountValid]);

  return (
    <FormNavButton
      bottomOffset={isAccountEnrolled ? 0 : undefined}
      type="primary"
      title={t("continue")}
      pressableProps={{ onPress: () => onSubmit() }}
      {...FormNavButtonProps}
    />
  );
};
