import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { generateSecretKeys } from "@/utils/sec/handleSecretKeys";
import { asRSAddress } from "@/utils/account/asRSAddress";
import { Address, composeApi } from "@signumjs/core";
import type { AccountImport } from "../utils/types";
import { AccountType } from "@/types/account";
import { useNodeHostStore } from "@/hooks/useNodeHostStore";

export const ResolvedAccountCard = () => {
  const { t } = useTranslation();
  const { watch, setValue } = useFormContext<AccountImport>();
  const { activeNodeHost } = useNodeHostStore();
  const nodeUrl = activeNodeHost?.url;

  const type = watch("type");
  const account = watch("account");

  // Local state for resolved account info
  const [resolvedAccount, setResolvedAccount] = useState<string | null>(null);
  const [accountName, setAccountName] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Derive RS address from input (account string or mnemonic)
   */
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

  /**
   * Fetch account name from the Signum node and sync it with the form
   */
  useEffect(() => {
    let cancelled = false;

    const fetchName = async () => {
      setAccountName("");
      setResolvedAccount(derivedRsAddress || null);

      // If no valid RS address → reset walletName field (show placeholder)
      if (!derivedRsAddress || !nodeUrl) {
        setValue("walletName", "", {
          shouldValidate: false,
          shouldDirty: false,
        });
        return;
      }

      try {
        setLoading(true);
        const api = composeApi({ nodeHost: nodeUrl });

        // Fetch account info by ID or RS address
        const acc = await api.account.getAccount({ accountId: derivedRsAddress });

        if (cancelled) return;

        const rawName = (acc?.name ?? "").trim();

        if (rawName) {
          // Limit name length to 30 characters and append ellipsis if needed
          const shortName =
            rawName.length > 30 ? `${rawName.slice(0, 30)}…` : rawName;

          setAccountName(shortName);

          // Set the fetched name into the "walletName" form field
          setValue("walletName", shortName, {
            shouldValidate: false,
            shouldDirty: false,
          });
        } else {
          // No name available → reset to show placeholder again
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

    fetchName();

    // Cleanup on unmount or dependency change
    return () => {
      cancelled = true;
    };
  }, [derivedRsAddress, nodeUrl, t, setValue]);

  // If no account resolved → don't render the card
  if (!resolvedAccount) return null;

  return (
    <Card>
      {/* Show resolved address */}
      <Text color="primary">
        {t("accountWizard.importAccount.importAccountResolvedAddress", {
          address: resolvedAccount,
        })}
      </Text>

      {/* Show account name only if it exists */}
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
