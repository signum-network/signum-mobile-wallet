import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/Card";
import { Text } from "@/components/Text";
import { FormCheckbox } from "@/components/Form/Checkbox";
import { useAppStore } from "@/hooks/useAppStore";
import { getHardwareAuth } from "@/utils/sec/getHardwareAuth";

export const Fingerprint = () => {
  const { t } = useTranslation();
  const { authMethod, setAuthMethod } = useAppStore();

  const [isHardwareAuthAvailable, setIsHardwareAuthAvailable] = useState(false);

  const isAuthMethodBiometric = authMethod === "BIOMETRIC";

  const toggleHardwareAuth = () =>
    setAuthMethod(isAuthMethodBiometric ? "PIN" : "BIOMETRIC");

  useEffect(() => {
    (async () => {
      const { canUseHardwareAuth } = await getHardwareAuth();
      setIsHardwareAuthAvailable(canUseHardwareAuth);
    })();
  }, []);

  return (
    <Card>
      <Text color="muted" className="font-bold">
        🔒 {t("settings.features.deviceAuth")}
      </Text>

      {isHardwareAuthAvailable ? (
        <FormCheckbox
          value={isAuthMethodBiometric}
          onPress={toggleHardwareAuth}
          title={t("settings.features.deviceAuthDescription")}
          fullWidth
          bordered
        />
      ) : (
        <Text color="muted">
          {t("settings.features.deviceAuthUnsupported")}
        </Text>
      )}
    </Card>
  );
};
