import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useFormContext, Controller } from "react-hook-form";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { TextInput } from "@/components/TextInput";
import { AccountImport } from "../../utils/types";

export const AccountIdField = () => {
  const { t } = useTranslation();
  const { control } = useFormContext<AccountImport>();

  return (
    <Card>
      <View>
        <Text size="large" className="font-medium">
          {t("accountWizard.importAccount.importWatchOnlyTitle")}
        </Text>

        <Text size="large" color="muted" className="font-medium">
          {t("accountWizard.importAccount.importWatchOnlySecondHint")}
        </Text>
      </View>

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder={t("example") + " S-5MS6..., 167552..."}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            size="large"
            extraClassNames="font-bold"
          />
        )}
        name="account"
      />
    </Card>
  );
};
