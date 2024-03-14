import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useFormContext, Controller } from "react-hook-form";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { TextInput } from "@/components/TextInput";
import { FormCheckbox } from "@/components/Form/Checkbox";
import { AccountImport } from "../../utils/types";

export const SeedPhraseField = () => {
  const { t } = useTranslation();
  const { control, watch, setValue } = useFormContext<AccountImport>();

  const mnemonicAccountAgreement = watch("mnemonicAccountAgreement");
  const toggleAgreement = () =>
    setValue("mnemonicAccountAgreement", !mnemonicAccountAgreement);

  return (
    <View className="gap-4 w-full">
      <Card>
        <View>
          <Text size="large" className="font-medium">
            {t("accountWizard.importAccount.importMnemonicTitle")}
          </Text>
        </View>

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              extraClassNames="font-medium w-full min-h-40"
              size="large"
              multiline
              textAlignVertical="top"
            />
          )}
          name="account"
        />
      </Card>

      <FormCheckbox
        value={mnemonicAccountAgreement}
        onPress={toggleAgreement}
        title={t("accountWizard.createAccount.firstStepPrimaryTermTitle")}
        fullWidth
        bordered
      />
    </View>
  );
};
