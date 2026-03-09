import {Pressable, View} from "react-native";
import {useEffect, useState, useCallback} from "react";
import {useTranslation} from "react-i18next";
import {useFormContext} from "react-hook-form";
import {Text} from "@/components/Text";
import {Button} from "@/components/Button";
import {useAppTheme} from "@/hooks/useAppTheme";
import {generateSecretKeys} from "@/utils/sec/handleSecretKeys";
import {downloadSeed} from "@/utils/sec/downloadSeed";
import {buildQrSvg} from "@/utils/sec/qrSvg";
import {Address} from "@signumjs/core";
import type {AccountCreation} from "../../utils/types";
import * as Clipboard from "expo-clipboard";
import Ionicons from "@expo/vector-icons/Ionicons";
import {generateMnemonic, generateSignKeys, Strength} from "@signumjs/crypto";


const StrengthOptions = [
    {label: "12", value: Strength.Bits_128},
    {label: "15", value: Strength.Bits_160},
    {label: "18", value: Strength.Bits_192},
    {label: "24", value: Strength.Bits_256},
] as const;

export const SecretPhraseGeneration = () => {
    const {t} = useTranslation();
    const {iconColor, tokens} = useAppTheme();
    const {watch, setValue} = useFormContext<AccountCreation>();
    const [strength, setStrength] = useState<Strength>(Strength.Bits_192);
    const [addressPreview, setAddressPreview] = useState("")
    const seedPhrase = watch("seedPhrase");

    const generateSeedPhrase = useCallback((s: Strength = strength) => {
        const passphrase = generateMnemonic({strength: s});

        if (!passphrase) return alert("Error: Passphrase Generation");

        const wordCount = passphrase.split(" ").length;
        const randomIndex = Math.floor(Math.random() * wordCount);

        const {publicKey} = generateSignKeys(passphrase)

        setAddressPreview(Address.fromPublicKey(publicKey).getReedSolomonAddress() || "")

        setValue("seedPhrase", passphrase);
        setValue("seedPhraseVerificationIndex", randomIndex);
    }, [strength, setValue]);

    const handleStrengthChange = (s: Strength) => {
        setStrength(s);
        generateSeedPhrase(s);
    };

    const copyToClipboard = async () => {
        if (!seedPhrase) return;
        await Clipboard.setStringAsync(seedPhrase);
        alert(t("accountWizard.createAccount.copiedSeedPhrase"));
    };

    const download = () => {
        if (!seedPhrase) return alert("QR generation error");
        // Build crisp SVG once here (no refs needed)
        const {moduleCount, paths} = buildQrSvg(seedPhrase, "M");
        const {publicKey} = generateSecretKeys(seedPhrase);
        const accountAddress =
            Address.fromPublicKey(publicKey).getReedSolomonAddress() || "";

        downloadSeed({
            seed: seedPhrase,
            accountAddress,
            title: t("accountWizard.createAccount.secondStepTitle"),
            description: t(
                "accountWizard.createAccount.secretPhraseCreationDescription"
            ),
            secondDescription: t(
                "accountWizard.createAccount.secretPhraseCreationSecondDescription"
            ),
            qrCodePaths: paths,
            moduleCount, // <<-- used for pixel-perfect sizing + quiet zone
            quietZoneModules: 4, // <<-- standard
            moduleSizePx: 7, // <<-- print-friendly size (252/294/... px)
        });
    };

    useEffect(() => {
        generateSeedPhrase();
    }, []);

    return (
        <View className="flex justify-center items-center gap-4 pt-4 w-full">
            <Text size="extraLarge" className="font-bold text-center">
                {t("accountWizard.createAccount.secondStepTitle")}
            </Text>

            <Text size="medium" color="muted" className="text-justify">
                {t("accountWizard.createAccount.secondStepDescription")}
            </Text>

            <View className="flex-row items-center justify-center">
                <View
                    style={{
                        transform: [{rotate: "180deg"}],
                        marginRight: 8,
                    }}
                >
                    <Ionicons name="triangle" size={18} color={tokens.primary}/>
                </View>

                <Text size="large" color="content" className="text-center font-bold">
                    {t("accountWizard.createAccount.secondStepSeedPhraseTip")}
                </Text>

                <View
                    style={{
                        transform: [{rotate: "180deg"}],
                        marginLeft: 8,
                    }}
                >
                    <Ionicons name="triangle" size={18} color={tokens.primary}/>
                </View>
            </View>

            <View className="flex-row items-center justify-center gap-2 w-full">
                <Text size="medium" color="muted"
                      className="font-medium">{t("accountWizard.createAccount.wordCount")}:</Text>
                {StrengthOptions.map(({label, value}) => (
                    <Pressable
                        key={value}
                        onPress={() => handleStrengthChange(value)}
                        style={{
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 8,
                            backgroundColor: strength === value ? tokens.primary : tokens.surface,
                            borderWidth: 1,
                            borderColor: strength === value ? tokens.primary : tokens.border,
                        }}
                    >
                        <Text
                            size="medium"
                            className="font-bold"
                            style={{color: strength === value ? tokens.background : tokens.text}}
                        >
                            {label}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <View
                className="p-4 py-6 w-full rounded-md border"
                style={{
                    backgroundColor: tokens.surface,
                    borderColor: tokens.border,
                }}
            >
                <Text size="2large">
                    {seedPhrase ? seedPhrase : t("loading") + "..."}
                </Text>
            </View>
            {addressPreview ? (
                <View className="flex-row justify-center items-center gap-2 w-full px-1">
                    <Text size="small" color="muted">{t("accountWizard.createAccount.addressPreview")}:</Text>
                    <Text size="small" color="muted" className="font-mono">
                        {addressPreview}
                    </Text>
                </View>
            ) : null}
            <View className="flex flex-col justify-center w-full gap-4 items-center px-8 pt-4">
                <Button
                    icon={<Ionicons name="refresh" size={24} color={iconColor.default}/>}
                    type="secondary"
                    title={t("accountWizard.createAccount.regenerate")}
                    size="medium"
                    fullWidth
                    pressableProps={{onPress: () => generateSeedPhrase()}}
                    disabled={!seedPhrase}
                />
                <Button
                    icon={<Ionicons name="copy" size={24} color={iconColor.default}/>}
                    type="secondary"
                    title={t("copyToClipboard")}
                    size="medium"
                    fullWidth
                    pressableProps={{onPress: copyToClipboard}}
                    disabled={!seedPhrase}
                />
                <Text color="muted">{t("or")}</Text>
                <Button
                    icon={<Ionicons name="cloud-download" size={24} color={iconColor.blackout}/>}
                    type="blackout"
                    title={t("download")}
                    size="medium"
                    fullWidth
                    pressableProps={{onPress: download}}
                    disabled={!seedPhrase}
                />
            </View>
            <Text className="text-justify pb-4">
                {t("accountWizard.createAccount.secondStepSeedPhraseSecondTip")}
            </Text>
        </View>
    );
};
