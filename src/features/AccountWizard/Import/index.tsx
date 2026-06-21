import { useEffect, useRef } from "react";
import { Animated, Easing, ScrollView, View } from "react-native";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { useForm, FormProvider, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { BarcodeScanningResult } from "expo-camera";
import { accountImportSchema } from "./utils/schemas";
import type { AccountImport } from "./utils/types";
import { AccountWizardContainer } from "../components/AccountWizardContainer";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useAccountStore } from "@/hooks/useAccountStore";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { AccountType } from "@/types/account";
import { HorizontalDivider } from "@/components/HorizontalDivider";
import { CameraDialog } from "@/components/CameraDialog";
import { getAccountPublicKey } from "@/utils/account/getAccountPublicKey";
import { getLedgerService } from "@/utils/getLedgerService";
import { Address } from "@signumjs/core";
import { FormNavigation } from "./components/FormNavigation";
import { WalletNameField } from "./sections/WalletNameField";
import { SeedPhraseField } from "./sections/SeedPhraseField";
import { AccountIdField } from "./sections/AccountIdField";
import {
    generateSecretKeys,
    saveSecretKey,
} from "@/utils/sec/handleSecretKeys";
import Ionicons from "@expo/vector-icons/Ionicons";
import { KeyboardAnimatedContainer } from "@/components/KeyboardAnimatedContainer";
import { AppHeader } from "@/components/AppHeader";
import { PUBLIC_MAX_ACCOUNTS } from "@/types/constants";

export const ImportScreen = () => {
    const { t } = useTranslation();
    const { iconColor, tokens } = useAppTheme();
    const {
        accountWalletNames,
        accountPublicKeys,
        isAccountEnrolled,
        addAccount,
        setActiveAccount,
    } = useAccountStore();

    useEffect(() => {
        if (accountPublicKeys.length >= PUBLIC_MAX_ACCOUNTS) {
            alert(t("accountWizard.maxAccountsReached", { max: PUBLIC_MAX_ACCOUNTS }));
            router.back();
        }
    }, []);

    const methods = useForm<AccountImport>({
        mode: "onChange",
        resolver: yupResolver(accountImportSchema),
        defaultValues: {
            type: AccountType.mnemonic,
            account: "",
            isAccountValid: false,
            walletName: "",
            mnemonicAccountAgreement: false,
        },
    });

    const { watch, setValue, resetField, handleSubmit } = methods;

    const type = watch("type");
    const isAccountTypeMnemonic = type === AccountType.mnemonic;
    const isAccountTypeWatchOnly = type === AccountType.watchOnly;

    const setMnemonicMode = () => setValue("type", AccountType.mnemonic);
    const setWatchOnlyMode = () => setValue("type", AccountType.watchOnly);

    useEffect(() => {
        resetField("account");
        resetField("isAccountValid");
        setValue("mnemonicAccountAgreement", false);
    }, [type]);

    const onCodeScanned = (code: BarcodeScanningResult) => {
        setValue("account", code.data);
    };

    const onSubmit: SubmitHandler<AccountImport> = async (data) => {
        const { walletName, account } = data;

        if (accountWalletNames.includes(walletName.toLowerCase())) {
            return alert(t("accountWizard.walletNameAlreadyUsed"));
        }

        switch (data.type) {
            case AccountType.mnemonic:
                const { publicKey, signPrivateKey, agreementPrivateKey } =
                    generateSecretKeys(account);

                if (accountPublicKeys.includes(publicKey)) {
                    return alert(
                        t("accountWizard.importAccount.importAccountAlreadyExists")
                    );
                }

                saveSecretKey(publicKey, signPrivateKey, agreementPrivateKey).then(
                    () => {
                        addAccount({
                            publicKey,
                            type: AccountType.mnemonic,
                            walletName,
                        });

                        setActiveAccount(publicKey);

                        //Delay navigation to next frame to avoid Fabric mount/unmount race
                        requestAnimationFrame(() => {
                            router.replace("/dashboard/overview");
                        });
                    }
                );
                break;

            // AccountType.watchOnly
            // Get account request to active node
            default:
                try {
                    // Resolve account string: could be RS address, numeric ID, or alias
                    let resolvedAccountId: string;
                    try {
                        resolvedAccountId = Address.create(account).getNumericId();
                    } catch {
                        // Not a valid address — try alias resolution
                        const { ledgerService } = getLedgerService();
                        resolvedAccountId = await ledgerService.alias.resolveAliasToAccountId(account);
                    }

                    const watchAccountPublicKey = await getAccountPublicKey(resolvedAccountId);

                    if (!watchAccountPublicKey) {
                        return alert(t("accountDoesNotExists"));
                    }

                    if (accountPublicKeys.includes(watchAccountPublicKey)) {
                        return alert(
                            t("accountWizard.importAccount.importAccountAlreadyExists")
                        );
                    }

                    addAccount({
                        publicKey: watchAccountPublicKey,
                        type: AccountType.watchOnly,
                        walletName,
                    });

                    setActiveAccount(watchAccountPublicKey);

                    //Delay navigation to next frame to avoid Fabric mount/unmount race
                    requestAnimationFrame(() => {
                        router.replace("/dashboard/overview");
                    });
                } catch (error: any) {
                    return alert(t("accountDoesNotExists"));
                }

                break;
        }
    };

    const goBackwards = () => {
        if (!isAccountEnrolled) {
            router.replace("/account-wizard");
            return;
        } else {
            router.replace("/dashboard/account");
        }
    };

    // Ensures BIP39 word suggestions below the input is visible
    const scrollRef = useRef<ScrollView>(null);
    const scrollY = useRef(0);
    const seedPhraseY = useRef(0);
    const scrollAnimation = useRef(new Animated.Value(0)).current;
    const smoothScrollTo = (targetY: number) => {
    scrollAnimation.stopAnimation();
    scrollAnimation.setValue(scrollY.current);
    const listenerId = scrollAnimation.addListener(({ value }) => {
        scrollRef.current?.scrollTo({
        y: value,
        animated: false,
        });
    });
      // Animate scroll
    Animated.timing(scrollAnimation, {
        toValue: targetY,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
    }).start(() => {
        scrollAnimation.removeListener(listenerId);
    });
    };
    const scrollToSeedPhrase = () => {
    setTimeout(() => {
        smoothScrollTo(Math.max(0, seedPhraseY.current + 190)); // 190 offset to position the seed phrase suggestions above the keyboard.
    }, 200); // small delay to allow keyboard + layout to settle
    };

    return (
        <FormProvider {...methods}>
            <AppHeader
                title={t("accountWizard.quickStart.importCta")}
                onBack={goBackwards}
            />
            <KeyboardAnimatedContainer noTabBar={!isAccountEnrolled}>
                <ScrollView
                ref={scrollRef}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="handled"
                scrollEventThrottle={16}
                onScroll={(event) => {
                    scrollY.current = event.nativeEvent.contentOffset.y;
                }}
                >
                    <AccountWizardContainer>
                        <View className="flex flex-col items-center justify-center w-full gap-4">
                            <Text size="extraLarge" className="font-bold text-center mt-8">
                                {t("accountWizard.importAccount.importTitle")}
                            </Text>

                            <Text size="large" color="muted" className="text-center">
                                {t("accountWizard.importAccount.importDescription")}
                            </Text>
                            <View
                                className="flex flex-row items-stretch gap-2 rounded-full max-w-md w-full p-1 overflow-hidden border"
                                style={{
                                    backgroundColor: tokens.surface,
                                    borderColor: tokens.border,
                                }}
                            >
                                <Button
                                    icon={
                                        <Ionicons
                                            name="bag-check"
                                            size={24}
                                            color={isAccountTypeMnemonic ? "white" : iconColor.muted}
                                        />
                                    }
                                    type={isAccountTypeMnemonic ? "primary" : undefined}
                                    title={t("fullAccount")}
                                    extraClassNames="flex-1 px-4"
                                    size="medium"
                                    titleClassName="font-medium"
                                    pressableProps={{ onPress: setMnemonicMode }}
                                />

                                <Button
                                    icon={
                                        <Ionicons
                                            name="eye"
                                            size={24}
                                            color={isAccountTypeWatchOnly ? "white" : iconColor.muted}
                                        />
                                    }
                                    type={isAccountTypeWatchOnly ? "primary" : undefined}
                                    title={t("watchOnly")}
                                    extraClassNames="flex-1 px-4"
                                    size="medium"
                                    titleClassName="font-medium"
                                    pressableProps={{ onPress: setWatchOnlyMode }}
                                />
                            </View>
                            {type === AccountType.mnemonic && (
                                <View className="gap-4 w-full">
                                    <Text className="text-center">
                                        {t("accountWizard.importAccount.importMnemonicHint")}
                                    </Text>
                                    <CameraDialog
                                        expected="seed"
                                        onCodeScanned={onCodeScanned}
                                    />
                                    <View
                                        onLayout={(event) => {
                                        seedPhraseY.current = event.nativeEvent.layout.y;
                                        }}
                                    >
                                        <SeedPhraseField onFocus={scrollToSeedPhrase} />
                                    </View>
                                </View>
                            )}
                            {type === AccountType.watchOnly && (
                                <View className="gap-4 w-full">
                                    <Text className="text-center">
                                        {t("accountWizard.importAccount.importWatchOnlyHint")}
                                    </Text>
                                    <CameraDialog
                                        expected="address"
                                        onCodeScanned={onCodeScanned}
                                    />
                                    <AccountIdField />
                                </View>
                            )}
                        </View>

                        <HorizontalDivider />

                        <WalletNameField />
                    </AccountWizardContainer>
                </ScrollView>
            </KeyboardAnimatedContainer>
            <FormNavigation onSubmit={handleSubmit(onSubmit)} />
        </FormProvider>
    );
};
