import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useFormContext, Controller } from "react-hook-form";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { TextInput } from "@/components/TextInput";
import { AccountImport } from "../../utils/types";

export const WalletNameField = () => {
  const { t } = useTranslation();
  const { control } = useFormContext<AccountImport>();

  return (
    <View className="gap-4 w-full pb-24">
      <Text size="extraLarge" className="font-bold text-center">
        {t("accountWizard.createAccount.walletName")}
      </Text>

      <Card>
        <Text size="large" color="muted" className="font-medium text-center">
          {t("accountWizard.createAccount.walletNameHint")}
        </Text>

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder={t(
                "accountWizard.createAccount.walletNamePlaceholder"
              )}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              size="large"
              extraClassNames="font-bold"
              maxLength={30}
            />
          )}
          name="walletName"
        />
      </Card>
    </View>
  );
};
