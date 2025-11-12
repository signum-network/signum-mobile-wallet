import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { generateSecretKeys } from "@/utils/sec/handleSecretKeys";
import { asRSAddress } from "@/utils/account/asRSAddress";
import { Address } from "@signumjs/core";
import type { AccountImport } from "../utils/types";
import { AccountType } from "@/types/account";
import { useLedgerService } from "@/hooks/useLedgerService";

export const ResolvedAccountCard = () => {
  const { t } = useTranslation();
  const { watch, setValue } = useFormContext<AccountImport>();
  const { ledgerService } = useLedgerService();

  const type = watch("type");
  const account = watch("account");

  const [resolvedAccount, setResolvedAccount] = useState<string | null>(null);
  const [accountName, setAccountName] = useState("");
  const [loading, setLoading] = useState(false);

  // Derive RS address from input or mnemonic
  const derivedRsAddress = useMemo(() => {
    if (!account?.trim()) return "";
    try {
      let input = account.trim();
      if (type === AccountType.mnemonic) {
        const { publicKey } = generateSecretKeys(input);
        input = Address.fromPublicKey(publicKey).getNumericId();
      }
      return asRSAddress(input);
    } catch {
      return "";
    }
  }, [account, type]);

  useEffect(() => {
    let cancelled = false;

    const fetchName = async () => {
      setAccountName("");
      setResolvedAccount(derivedRsAddress || null);

      // If no valid RS address or no LedgerService → clear field / show placeholder
      if (!derivedRsAddress || !ledgerService) {
        setValue("walletName", "", {
          shouldValidate: false,
          shouldDirty: false,
        });
        return;
      }

      try {
        setLoading(true);

        const acc = await ledgerService.ledgerInstance.account.getAccount({
          accountId: derivedRsAddress,
        });

        if (cancelled) return;

        const rawName = (acc?.name ?? "").trim();

        if (rawName) {
          const shortName =
            rawName.length > 30 ? `${rawName.slice(0, 30)}…` : rawName;

          setAccountName(shortName);
          setValue("walletName", shortName, {
            shouldValidate: false,
            shouldDirty: false,
          });
        } else {
          setValue("walletName", "", {
            shouldValidate: false,
            shouldDirty: false,
          });
        }
      } catch {
        if (!cancelled) {
          setValue("walletName", "", {
            shouldValidate: false,
            shouldDirty: false,
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetchName();
    return () => {
      cancelled = true;
    };
  }, [derivedRsAddress, ledgerService, setValue]);

  if (!resolvedAccount) return null;

  return (
    <Card>
      <Text color="primary">
        {t("accountWizard.importAccount.importAccountResolvedAddress", {
          address: resolvedAccount,
        })}
      </Text>

      {!loading && accountName && (
        <Text color="primary">
          {t("accountWizard.importAccount.importAccountResolvedName", {
            name: accountName,
          })}
        </Text>
      )}
      <Text color="muted">
        {t("accountWizard.importAccount.importAccountResolvedAddressHint")} 😁
      </Text>
      
    </Card>
  );
};
