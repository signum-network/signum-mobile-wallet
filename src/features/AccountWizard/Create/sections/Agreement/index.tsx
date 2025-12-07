import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import type { AccountCreation } from "../../utils/types";
import { Text } from "@/components/Text";
import { FormCheckbox } from "@/components/Form/Checkbox";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppTheme } from "@/hooks/useAppTheme";

export const Agreement = () => {
  const { t } = useTranslation();
  const { watch, setValue } = useFormContext<AccountCreation>();
  const { iconColor } = useAppTheme();

  const firstTerm = watch("firstTerm");
  const secondTerm = watch("secondTerm");
  const thirdTerm = watch("thirdTerm");

  const toggleTerm = (key: keyof AccountCreation, value: boolean) =>
    setValue(key, !value);

  return (
    <View className="flex justify-center items-center gap-4 pb-20 w-full">
      <Ionicons name="lock-closed" size={80} color={iconColor.primary} />

      <Text size="extraLarge" className="font-bold text-center">
        {t("accountWizard.createAccount.firstStepTitle")}
      </Text>

      <Text size="large" color="muted" className="text-center mb-4">
        {t("accountWizard.createAccount.firstStepDescription")}
      </Text>

      <FormCheckbox
        value={firstTerm}
        onPress={() => toggleTerm("firstTerm", firstTerm)}
        title={t("accountWizard.createAccount.firstStepPrimaryTermTitle")}
        fullWidth
        bordered
      />

      <FormCheckbox
        value={secondTerm}
        onPress={() => toggleTerm("secondTerm", secondTerm)}
        title={t("accountWizard.createAccount.firstStepSecondaryTermTitle")}
        fullWidth
        bordered
      />

      <FormCheckbox
        value={thirdTerm}
        onPress={() => toggleTerm("thirdTerm", thirdTerm)}
        title={t("accountWizard.createAccount.firstStepThirdTermTitle")}
        fullWidth
        bordered
      />
    </View>
  );
};
