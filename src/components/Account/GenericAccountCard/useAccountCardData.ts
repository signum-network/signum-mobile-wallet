import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { Account } from "@signumjs/core";
import { parseAccountImages } from "./utils";
import { isAccountSrc40Nft } from "@/utils/account/isAccountSrc40Nft";
import type { StatusIndicator, AccountImages } from "./types";

interface UseAccountCardDataProps {
  account: Account;
  watchOnly: boolean;
  providedImages?: AccountImages | null;
  providedStatusIndicators?: StatusIndicator[];
}

/**
 * Hook to automatically generate images and status indicators from account
 */
export const useAccountCardData = ({
  account,
  watchOnly,
  providedImages,
  providedStatusIndicators,
}: UseAccountCardDataProps) => {
  const { t } = useTranslation();

  // Parse images from account description if not provided
  const images = useMemo(() => {
    return providedImages ?? parseAccountImages(account.description);
  }, [providedImages, account.description]);

  // Auto-generate status indicators if not provided
  const statusIndicators = useMemo<StatusIndicator[]>(() => {
    if (providedStatusIndicators) {
      return providedStatusIndicators;
    }

    const indicators: StatusIndicator[] = [];

    if (isAccountSrc40Nft(account)) {
      indicators.push({
        type: "nft",
        label: t("nft"),
      });
    } else if (account.isAT) {
      indicators.push({
        type: "contract",
        label: t("contract"),
      });
    }

    if (watchOnly) {
      indicators.push({
        type: "watchOnly",
        label: t("watchOnly"),
      });
    }

    if (!account.isSecured) {
      indicators.push({
        type: "unsecured",
        label: t("unsecured"),
      });
    }

    return indicators;
  }, [providedStatusIndicators, account, watchOnly, t]);

  return { images, statusIndicators };
};
