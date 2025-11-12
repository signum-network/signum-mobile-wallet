import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useFormContext, Controller } from "react-hook-form";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { TextInput } from "@/components/TextInput";
import type { AccountImport } from "../../utils/types";
import { ResolvedAccountCard } from "../../components/ResolvedAccountCard";

export const AccountIdField = () => {
  const { t } = useTranslation();
  const { control } = useFormContext<AccountImport>();

  return (
    <View className="gap-4 w-full">
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
                returnKeyType="done"
                value={value}
                size="large"
                textAlign="center"
                maxLength={30}
              />
            )}
            name="account"
          />
    
      </Card>

      <ResolvedAccountCard />
    </View>
  );
};
