import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {View, Keyboard, ScrollView} from "react-native";
import {router} from "expo-router";
import {useAppStore} from "@/hooks/useAppStore";
import {PinAuthenticator} from "@/features/Auth/components/PinAuthenticator";
import {PUBLIC_PIN_MAX_ATTEMPTS, PUBLIC_PIN_LENGTH} from "@/types/constants";
import {generateHash, isLegacyHash, verifyLegacyHash} from "@/utils/sec/generateHash";
import {readPin, savePin} from "@/utils/sec/handlePin";
import {readAuthAttempts, saveAuthAttempts, deleteAuthAttempts} from "@/utils/sec/handleAuthAttempts";
import {useAccountStore} from "@/hooks/useAccountStore";
import {useAppTheme} from "@/hooks/useAppTheme";
import {useResetApp} from "@/hooks/useResetApp";
import * as LocalAuthentication from "expo-local-authentication";
import {ResetWalletDialog} from "@/components/ResetWalletDialog";

const initialValues = [...new Array(PUBLIC_PIN_LENGTH)];

export const LoginAuthScreen = () => {
    const {t} = useTranslation();
    const {isAccountEnrolled} = useAccountStore();
    const {
        authMethod,
        failedAuthAttempts,
        setFailedAuthAttempts,
        setIsUnlocked,
    } = useAppStore();

    const {tokens} = useAppTheme();

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [value, setValues] = useState<string[]>(initialValues);
    const [attemptsLoaded, setAttemptsLoaded] = useState(false);

    const {resetApp} = useResetApp({
        onSuccess: () => {
            alert(t("resetApp"));
        },
    });

    const resetValues = () => setValues(initialValues);

    const goToEnrollScreen = () => router.replace("/auth/enroll");

    const handleOnChangeValues = async (values: string[], submit: boolean) => {
        setValues(values);
        setError(false);

        if (submit) {
            setLoading(true);
            const formatedValues = values.join("");
            const storedPinData = await readPin();

            if (!storedPinData) return goToEnrollScreen();

            const {key, salt} = storedPinData;

            let isValidPin = false;

            if (isLegacyHash(key)) {
                console.log("Legacy hash detected, performing migration");
                // SHA-1 hash from react-native-quick-crypto <1.1.0 (no digest = silent SHA-1 default)
                isValidPin = verifyLegacyHash(formatedValues, salt, key);
                if (isValidPin) {
                    // Silent migration: re-hash with SHA-512 on successful login
                    const migrated = await generateHash(formatedValues);
                    await savePin(migrated.key, migrated.salt);
                    console.log("Migration completed successfully");
                }
                console.log("PIN Not Valid");
            } else {
                const tryHash = await generateHash(formatedValues, salt);
                isValidPin = key === tryHash.key;
            }

            if (isValidPin) {
                setSuccess(true);
            } else {
                setLoading(false);
                setError(true);
                const next = failedAuthAttempts + 1;
                setFailedAuthAttempts(next);
                await saveAuthAttempts(next);
            }
        }
    };

    const requestHardwareAuth = () => {
        LocalAuthentication.authenticateAsync({
            cancelLabel: t("cancel"),
            disableDeviceFallback: true,
            promptMessage: t("auth.verifyItsYou"),
        }).then(({success}) => {
            setSuccess(success);
            Keyboard.dismiss();
        });
    };

    const onSuccess = () => {
        setFailedAuthAttempts(0);
        void deleteAuthAttempts();
        setTimeout(() => {
            // Set unlocked - AuthGuard will:
            // 1. Reveal Stack
            // 2. Auto-navigate to pending deep link (if any)
            setIsUnlocked(true);

            // If no accounts, navigate to wizard
            if (!isAccountEnrolled) {
                setTimeout(() => router.replace("/account-wizard"), 100);
            }
        }, 1000);
    };

    const handleResetApp = async () => {
        setIsUnlocked(false);
        Keyboard.dismiss();
        await resetApp();
    };

    useEffect(() => {
        readAuthAttempts().then((count) => {
            setFailedAuthAttempts(count);
            setAttemptsLoaded(true);
        });
    }, []);

    useEffect(() => {
        if (success && !error) onSuccess();
    }, [success, error]);

    useEffect(() => {
        if (authMethod === "BIOMETRIC") requestHardwareAuth();
    }, [authMethod]);

    useEffect(() => {
        if (failedAuthAttempts === PUBLIC_PIN_MAX_ATTEMPTS) {
            handleResetApp();
        } else if (failedAuthAttempts >= PUBLIC_PIN_MAX_ATTEMPTS - 2) {
            alert(
                t("auth.loginPassCodeTooManyAttempts", {
                    count: PUBLIC_PIN_MAX_ATTEMPTS - failedAuthAttempts,
                })
            );
        }
    }, [failedAuthAttempts]);

    return (
        <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
            <View
                className="flex-1 items-center justify-start"
                style={{
                    backgroundColor: tokens.background,
                }}
            >
                {/* Top slot: show reset button only after first failed attempt */}
                <View className="w-full mb-2 justify-center h-14 mt-4 px-4">
                    {failedAuthAttempts >= 1 ? (
                        <ResetWalletDialog variant="ghost" />
                    ) : (
                        <View className="opacity-0" pointerEvents="none">
                            {/* Placeholder to keep layout height consistent */}
                            <ResetWalletDialog variant="ghost" />
                        </View>
                    )}
                </View>
                <PinAuthenticator
                    label={t("auth.loginPassCodeTitle")}
                    complementaryLabel={t("auth.loginPassCodeDescription")}
                    errorLabel={t("auth.verifyIncorrectPassCode")}
                    successLabel={`${t("auth.loginCorrectPassCode")} 😊`}
                    error={error}
                    success={success}
                    length={PUBLIC_PIN_LENGTH}
                    value={value}
                    onChange={handleOnChangeValues}
                    onReset={resetValues}
                    disabled={loading || !attemptsLoaded}
                />
            </View>
        </ScrollView>
    );
};
