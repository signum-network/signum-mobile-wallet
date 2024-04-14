import { appStore } from "@/states/appStore";

interface Args {
  value?: string | number;
  disableDecimal?: boolean;
  maximumFractionDigits?: number;
}

export const formatNumber = ({
  value,
  disableDecimal = false,
  maximumFractionDigits = 8,
}: Args) => {
  if (value === 0 || value === "0" || !value) return "0";

  if (typeof value === "string") value = parseFloat(value);

  const language = appStore.getState().language || "en";

  if (disableDecimal) maximumFractionDigits = 0;

  return value.toLocaleString(language, {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  });
};
