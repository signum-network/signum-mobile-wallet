import {Fragment, useState} from "react";
import {View} from "react-native";
import {useTranslation} from "react-i18next";
import {Button} from "@/components/Button";
import {Text} from "@/components/Text";
import {Dialog} from "@/components/Dialog";
import {useAppTheme} from "@/hooks/useAppTheme";
import {useResetApp} from "@/hooks/useResetApp";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Props {
    variant: "accent" | "ghost"
}

export const ResetWalletDialog = ({variant}: Props) => {
    const {t} = useTranslation();
    const {iconColor} = useAppTheme();

    const [visible, setVisible] = useState(false);
    const [isResetting, setIsResetting] = useState(false);

    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);

    const {resetApp} = useResetApp({
        onError: (error) => {
            console.error("Error resetting wallet:", error);
            alert(t("settings.reset.error"));
            setIsResetting(false);
            hideDialog();
        },
    });

    const handleResetWallet = async () => {
        setIsResetting(true);
        await resetApp();
    };

    return (
        <Fragment>
            <Dialog variant="full" visible={visible} onClose={hideDialog}>
                <View className="flex flex-col items-center justify-center gap-6 w-full">
                    <View className="flex items-center justify-center mb-2">
                        <Ionicons
                            name="warning"
                            size={64}
                            color={iconColor.red}
                        />
                    </View>

                    <Text size="large" className="font-bold text-center">
                        {t("settings.reset.confirmTitle")}
                    </Text>

                    <Text size="medium" className="text-center" color="muted">
                        {t("settings.reset.confirmDescription")}
                    </Text>

                    <View
                        className="w-full bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border-2 border-yellow-400 dark:border-yellow-600">
                        <Text size="small" className="font-semibold text-center">
                            {t("settings.reset.warningBox")}
                        </Text>
                    </View>
                </View>

                <View className="w-full flex flex-col items-center justify-center gap-2 mt-4">
                    <Button
                        icon={<Ionicons name="close" size={24}/>}
                        title={t("cancel")}
                        type="secondary"
                        pressableProps={{onPress: hideDialog}}
                        disabled={isResetting}
                        fullWidth
                    />

                    <Button
                        icon={<Ionicons name="trash" size={24} color="white"/>}
                        title={t("settings.reset.confirm")}
                        type="error"
                        pressableProps={{onPress: handleResetWallet}}
                        disabled={isResetting}
                        fullWidth
                    />
                </View>
            </Dialog>

            {variant === "accent" && (
                <Button
                    icon={
                        <Ionicons
                            name="trash-outline"
                            size={24}
                            color={"#fff"}
                        />
                    }
                    type="error"
                    title={t("settings.reset.button")}
                    fullWidth
                    pressableProps={{onPress: showDialog}}
                />
            )}

            {variant === "ghost" && (
                <Button
                    icon={
                        <Ionicons
                            name="trash-outline"
                            size={18}
                            color={iconColor.muted}
                        />
                    }
                    type="secondary"
                    title={t("settings.reset.button")}
                    fullWidth
                    pressableProps={{onPress: showDialog}}
                />
            )}

        </Fragment>
    );
};
