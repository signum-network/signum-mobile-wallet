import {View} from "react-native";
import {useTranslation} from "react-i18next";
import {useFormContext, Controller} from "react-hook-form";
import Ionicons from "@expo/vector-icons/Ionicons";
import {HorizontalDivider} from "@/components/HorizontalDivider";
import {Text} from "@/components/Text";
import {Card} from "@/components/Card";
import {TextInput} from "@/components/TextInput";
import {useAppTheme} from "@/hooks/useAppTheme";
import {useAccountStore} from "@/hooks/useAccountStore";
import type {AccountCreation} from "../../utils/types";

export const SecretPhraseVerification = () => {
    const {t} = useTranslation();
    const {iconColor} = useAppTheme();
    const {accountWalletNames} = useAccountStore();
    const {watch, control} = useFormContext<AccountCreation>();

    const seedPhrase = watch("seedPhrase");
    const seedPhraseVerificationIndex = watch("seedPhraseVerificationIndex");
    const seedPhraseVerificationWord = watch("seedPhraseVerificationWord");
    const walletName = watch("walletName");

    const isCorrectWord =
        seedPhraseVerificationWord ===
        seedPhrase.split(" ").at(seedPhraseVerificationIndex);

    const isWalletNameTaken =
        !!walletName.trim() &&
        accountWalletNames.includes(walletName.trim().toLowerCase());

    return (
        <View className="flex justify-center items-center gap-8 pt-4 pb-4 w-full">
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
                        word: seedPhraseVerificationIndex + 1,
                    })}
                </Text>

                <Controller
                    control={control}
                    render={({field: {onChange, onBlur, value}}) => (
                        <View className="relative w-full">
                            <TextInput
                                placeholder={t(
                                    "accountWizard.createAccount.verificationPlaceholder",
                                    {
                                        word: seedPhraseVerificationIndex + 1,
                                    }
                                )}
                                onBlur={onBlur}
                                onChangeText={(text) => onChange(text.toLowerCase())}
                                value={value}
                                returnKeyType="done"
                                size="large"
                                textAlign="center"
                                extraClassNames="font-medium"
                            />
                            {isCorrectWord && (
                                <View
                                    className="absolute right-3 items-center justify-center"
                                    style={{top: "50%", transform: [{translateY: -12}]}}
                                >
                                    <Ionicons
                                        name="checkmark-circle"
                                        size={24}
                                        color={iconColor.green}
                                    />
                                </View>
                            )}
                        </View>
                    )}
                    name="seedPhraseVerificationWord"
                />
            </Card>

            <HorizontalDivider/>

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
                        render={({field: {onChange, onBlur, value}}) => (
                            <TextInput
                                placeholder={t(
                                    "accountWizard.createAccount.walletNamePlaceholder"
                                )}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                returnKeyType="done"
                                size="large"
                                textAlign="center"
                                maxLength={30}
                            />
                        )}
                        name="walletName"
                    />

                    {isWalletNameTaken && (
                        <Text size="small" color="error" className="text-center">
                            {t("accountWizard.walletNameAlreadyUsed")}
                        </Text>
                    )}
                </Card>
            </View>
        </View>
    );
};
