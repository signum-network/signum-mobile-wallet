import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useFormContext, Controller } from "react-hook-form";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { TextInput } from "@/components/TextInput";
import { AccountImport } from "../../utils/types";

export const SeedPhraseField = () => {
  const { t } = useTranslation();
  const { control } = useFormContext<AccountImport>();

  return (
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
  );
};
