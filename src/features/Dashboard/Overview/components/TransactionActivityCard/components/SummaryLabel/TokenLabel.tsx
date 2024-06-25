import { useTranslation } from "react-i18next";
import { useTokenMetadata } from "@/hooks/useTokenMetadata";
import { Text } from "@/components/Text";

interface Props {
  tokenId: string;
  action: "overview.holders";
}

export const TokenLabel = ({ tokenId, action }: Props) => {
  const { t } = useTranslation();
  const { ticker } = useTokenMetadata(tokenId);

  const label = tokenId && !ticker ? t("loading") : `${ticker} ${t(action)}`;

  return (
    <Text className="font-bold text-end" size="small" color="muted">
      {label}
    </Text>
  );
};
