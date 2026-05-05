import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { generateSecretKeys } from "@/utils/sec/handleSecretKeys";
import { Address } from "@signumjs/core";
import type { AccountImport } from "../utils/types";
import { AccountType } from "@/types/account";
import { useQueryAccountResolver } from "@/hooks/useQueryAccountResolver";

export const ResolvedAccountCard = () => {
  const { t } = useTranslation();
  const { watch, setValue, formState } = useFormContext<AccountImport>();

  const type = watch("type");
  const account = watch("account");

  // For mnemonic: derive a numeric ID from the seed phrase
  // For watchOnly: pass the raw input (address, numeric ID, or alias)

  // Track if user already edited wallet name
  const isWalletNameDirty = formState.dirtyFields.walletName;

  // Build query input depending on account type
  const queryInput = useMemo(() => {
    if (!account?.trim()) return "";
    const input = account.trim();
    if (type === AccountType.mnemonic) {
      try {
        const { publicKey } = generateSecretKeys(input);
        return Address.fromPublicKey(publicKey).getNumericId();
      } catch {
        return "";
      }
    }
    return input;
  }, [account, type]);

  const { account: resolvedAccount, isLoading } =
    useQueryAccountResolver(queryInput);

  useEffect(() => {
    if (isLoading) return;

    // Do not overwrite if user already typed something
    if (isWalletNameDirty) return;

    // Do not reset wallet name if nothing resolved
    if (!resolvedAccount) return;

    const rawName = (
      resolvedAccount.aliasName ||
      resolvedAccount?.name ||
      ""
    ).trim();

    if (!rawName) return;

    const shortName =
      rawName.length > 30 ? `${rawName.slice(0, 30)}…` : rawName;
    setValue("walletName", shortName, {
      shouldValidate: false,
      shouldDirty: false,
    });
  }, [resolvedAccount, isLoading, isWalletNameDirty, setValue]);

  if (!resolvedAccount) return null;

  return (
    <Card>
      <Text color="primary">
        {t("accountWizard.importAccount.importAccountResolvedAddress", {
          address: resolvedAccount.accountRS,
        })}
      </Text>

      {!isLoading && resolvedAccount.name && (
        <Text color="primary">
          {t("accountWizard.importAccount.importAccountResolvedName", {
            name: resolvedAccount.name,
          })}
        </Text>
      )}
      <Text color="muted">
        {t("accountWizard.importAccount.importAccountResolvedAddressHint")} 😁
      </Text>

    </Card>
  );
};
