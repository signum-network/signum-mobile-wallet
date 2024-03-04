import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useFormContext, Controller } from "react-hook-form";
import { HorizontalDivider } from "@/components/HorizontalDivider";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { TextInput } from "@/components/TextInput";
import type { AccountCreationAgreement } from "../../utils/types";

export const SecretPhraseVerification = () => {
  const { t } = useTranslation();
  const { watch, control } = useFormContext<AccountCreationAgreement>();

  const seedPhraseVerificationIndex = watch("seedPhraseVerificationIndex");

  return (
    <View className="flex justify-center items-center gap-8 pt-8">
      <View className="gap-4">
        <Text size="extraLarge" className="font-bold text-center">
          {t("accountWizard.createAccount.verification")}
        </Text>

        <Text size="large" color="muted" className="text-center">
          {t("accountWizard.createAccount.enterSeedPhraseVerification")}
        </Text>
      </View>

      <Card>
        <Text
          size="large"
          color="muted"
          className="font-medium text-center"
          fullWidth
        >
          {t("accountWizard.createAccount.verificationHint", {
            word: seedPhraseVerificationIndex,
          })}
        </Text>

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder={t(
                "accountWizard.createAccount.verificationPlaceholder",
                {
                  word: seedPhraseVerificationIndex,
                }
              )}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              size="large"
              extraClassNames="!p-4 font-medium text-center"
            />
          )}
          name="seedPhraseVerificationWord"
        />
      </Card>

      <HorizontalDivider />

      <View className="gap-4 w-full">
        <Text size="extraLarge" className="font-bold text-center">
          {t("accountWizard.createAccount.walletName")}
        </Text>

        <Card>
          <Text size="large" color="muted" className="font-medium text-center">
            {t("accountWizard.createAccount.walletNameHint")}
          </Text>

          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder={t(
                  "accountWizard.createAccount.walletNamePlaceholder"
                )}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                extraClassNames="!p-4 font-medium text-center"
                maxLength={20}
              />
            )}
            name="walletName"
          />
        </Card>
      </View>
    </View>
  );
};
