import { appStore } from "@/states/appStore";
import { marketStore } from "@/states/marketStore";
import { defaultCurrency, AllowedTickersDecimals } from "@/types/currencies";

interface Args {
  value?: string | number;
  disableDecimal?: boolean;
  isFiat?: boolean;
  maximumFractionDigits?: number;
}

export const defaultMaximumFractionDigits = 8;

export const formatNumber = ({
  value,
  disableDecimal = false,
  isFiat = false,
  maximumFractionDigits = defaultMaximumFractionDigits,
}: Args) => {
  if (value === 0 || value === "0" || !value) return "0";

  if (typeof value === "string") value = parseFloat(value);

  const language = appStore.getState().language || "en";
  const activeCurrency =
    marketStore.getState().activeCurrency || defaultCurrency;

  if (disableDecimal) maximumFractionDigits = 0;

  if (isFiat) {
    if (value > 499999) {
      maximumFractionDigits = 0;
    } else {
      // @ts-expect-error There is fallback value set
      maximumFractionDigits = AllowedTickersDecimals.get(activeCurrency);
    }
  }

  return value.toLocaleString(language, {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  });
};
