import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { generateSecretKeys } from "@/utils/sec/handleSecretKeys";
import { asRSAddress } from "@/utils/account/asRSAddress";
import { Address } from "@signumjs/core";
import type { AccountImport } from "../utils/types";
import { AccountType } from "@/types/account";

export const ResolvedAccountCard = () => {
  const { t } = useTranslation();
  const { watch } = useFormContext<AccountImport>();

  const type = watch("type");
  const account = watch("account");

  const resolvedAccount = useMemo(() => {
    if (!account.trim()) return "";

    try {
      let accountId = account;

      if (type === AccountType.mnemonic) {
        const { publicKey } = generateSecretKeys(account);
        accountId = Address.fromPublicKey(publicKey).getNumericId();
      }

      return asRSAddress(accountId);
    } catch (error) {
      return "";
    }
  }, [account, type]);

  return resolvedAccount ? (
    <Card>
      <Text fullWidth color="primary">
        {t("accountWizard.importAccount.importAccountResolvedAddress", {
          address: resolvedAccount,
        })}
      </Text>

      <Text fullWidth color="muted">
        {t("accountWizard.importAccount.importAccountResolvedAddressHint")} 😁
      </Text>
    </Card>
  ) : null;
};
