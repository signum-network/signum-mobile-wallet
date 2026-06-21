import { useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useFormContext, Controller } from "react-hook-form";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { FormCheckbox } from "@/components/Form/Checkbox";
import type { AccountImport } from "../../utils/types";
import { ResolvedAccountCard } from "../../components/ResolvedAccountCard";
import { ToggleSwitch } from "@/components/ToggleSwitch";
import * as bip39 from "bip39";
import { PassphraseTextInput } from "../../components/PassphraseTextInput";

type Props = {
  onFocus?: () => void;
  onBlur?: () => void;
};

export const SeedPhraseField = ({ onFocus }: Props) => {
  const { t } = useTranslation();
  const { control, watch, setValue } = useFormContext<AccountImport>();

  const mnemonicAccountAgreement = watch("mnemonicAccountAgreement");
  const [allowCustomPassphrase, setAllowCustomPassphrase] = useState(false);
  
  const toggleAgreement = () =>
    setValue("mnemonicAccountAgreement", !mnemonicAccountAgreement);

  const toggleAllowCustomPassphrase = () =>
    setAllowCustomPassphrase((value) => !value);

  const wordlist = bip39.wordlists.english;
  const wordlistSet = new Set(wordlist);

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
            <PassphraseTextInput
              onBlur={onBlur}
              onFocus={onFocus}
              onChangeText={(text) => {
                if (allowCustomPassphrase) {
                  onChange(text);
                } else {
                  // remove special chars, keep only letters and spaces
                  const sanitized = text.toLowerCase().replace(/[^a-z\s]/g, ""); // only a-z + space

                  onChange(sanitized);
                }
              }}
              value={value}
              wordlist={wordlistSet}
              validateWords={!allowCustomPassphrase}
              showSuggestions={!allowCustomPassphrase}
              maxSuggestions={4}
            />
          )}
          name="account"
        />
        <View className="flex flex-row items-center justify-between">
          <ToggleSwitch
            value={allowCustomPassphrase}
            onPress={toggleAllowCustomPassphrase}
            label={t(
              "accountWizard.importAccount.importAccountUseCustomPassphrase",
            )}
          />
        </View>
        <Text size="small" color="muted">
          {t("accountWizard.importAccount.importAccountCustomPassphraseHint")}
        </Text>
      </Card>

      <ResolvedAccountCard />

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
