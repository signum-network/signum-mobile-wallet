import { useTranslation } from "react-i18next";
import { useToken } from "@/hooks/useToken";
import { Text } from "@/components/Text";

interface Props {
  tokenId: string;
  action: "overview.holders";
}

export const TokenLabel = ({ tokenId, action }: Props) => {
  const { t } = useTranslation();
  const { ticker } = useToken(tokenId);

  const label = tokenId && !ticker ? t("loading") : `${ticker} ${t(action)}`;

  return (
    <Text className="font-bold text-end" size="small" color="muted">
      {label}
    </Text>
  );
};
