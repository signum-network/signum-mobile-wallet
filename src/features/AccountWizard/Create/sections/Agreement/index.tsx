import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import type { AccountCreationAgreement } from "../../utils/types";
import { Text } from "@/components/Text";
import { FormCheckbox } from "@/components/FormCheckbox";

export const Agreement = () => {
  const { t } = useTranslation();
  const { watch, setValue } = useFormContext<AccountCreationAgreement>();

  const firstTerm = watch("firstTerm");
  const secondTerm = watch("secondTerm");
  const thirdTerm = watch("thirdTerm");

  const toggleTerm = (key: keyof AccountCreationAgreement, value: boolean) =>
    setValue(key, !value);

  return (
    <View className="flex justify-center items-center gap-4">
      <Text className="text-8xl pt-4">🔒</Text>

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
