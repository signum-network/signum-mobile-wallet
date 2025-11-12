import { useTranslation } from "react-i18next";
import { Card } from "@/components/Card";
import { Text } from "@/components/Text";
import { FormCheckbox } from "@/components/Form/Checkbox";
import { useAppStore } from "@/hooks/useAppStore";

export const Miner = () => {
  const { t } = useTranslation();
  const { minerMode, setMinerMode } = useAppStore();

  const toggleMinerMode = () => setMinerMode(!minerMode);

  return (
    <Card>
      <Text color="muted" className="font-bold">
        💽 {t("settings.features.minerMode")}
      </Text>

      {minerMode && (
        <Text color="muted">{t("settings.features.minerModeActive")}</Text>
      )}

      <FormCheckbox
        value={minerMode}
        onPress={toggleMinerMode}
        title={t("settings.features.minerModeDescription")}
        fullWidth
        bordered
      />
    </Card>
  );
};
