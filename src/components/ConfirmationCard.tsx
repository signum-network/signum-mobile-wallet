import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { useAppTheme } from "@/hooks/useAppTheme";

interface Props {
  onConfirm: () => void;
  isDisabled: boolean;
}

export const ConfirmationCard = ({ onConfirm, isDisabled }: Props) => {
  const { t } = useTranslation();
  const { iconColor } = useAppTheme();

  return (
    <Card>
      <Text color="muted" className="text-center" fullWidth>
        {t("transfer.pressTheButtonLonger")}
      </Text>

      <Button
        icon={<Ionicons name="send" size={24} color={iconColor.default} />}
        type="primary"
        size="large"
        title={t("transfer.confirmTransaction")}
        pressableProps={{
          delayLongPress: 2000,
          onLongPress: onConfirm,
          disabled: isDisabled,
        }}
        fullWidth
      />
    </Card>
  );
};
