import {ScrollView, View} from "react-native";
import {useTranslation} from "react-i18next";
import {useAppTheme} from "@/hooks/useAppTheme";
import {DashboardScreenContainer} from "../../components/DashboardScreenContainer";
import Ionicons from "@expo/vector-icons/Ionicons";
import {SettingsCard} from "./components/SettingsCard";
import {Button} from "@/components/Button";
import {useAppStore} from "@/hooks/useAppStore";

export const SettingsScreen = () => {
    const {t} = useTranslation();
    const {iconColor} = useAppTheme();
    const {setIsUnlocked} = useAppStore()

    return (
        <ScrollView>
            <DashboardScreenContainer>
                <View className="flex flex-col w-full p-4 gap-4">
                    <SettingsCard
                        icon={<Ionicons name="language" size={24} color={iconColor.default}/>}
                        title={t("settings.language.title")}
                        description={t("settings.language.description")}
                        href="/dashboard/settings/language"
                    />
                    <SettingsCard
                        icon={<Ionicons name="color-palette" size={24} color={iconColor.default}/>}
                        title={t("settings.design.title")}
                        description={t("settings.design.description")}
                        href="/dashboard/settings/design"
                    />
                    <SettingsCard
                        icon={<Ionicons name="cash" size={24} color={iconColor.default}/>}
                        title={t("settings.currency.title")}
                        description={t("settings.currency.description")}
                        href="/dashboard/settings/currency"
                    />
                    <SettingsCard
                        icon={<Ionicons name="server" size={24} color={iconColor.default}/>}
                        title={t("settings.node.title")}
                        description={t("settings.node.description")}
                        href="/dashboard/settings/nodes"
                    />
                    <SettingsCard
                        icon={<Ionicons name="information-circle-sharp" size={24} color={iconColor.default}/>}
                        title={t("settings.about.title")}
                        description={t("settings.about.description")}
                        href="/dashboard/settings/about"
                    />
                    <Button
                        icon={<Ionicons name="lock-closed" color={iconColor.blackout} size={24}/>}
                        title={t("settings.lock")}
                        type="blackout"
                        pressableProps={{onPress: () => setIsUnlocked(false) }}
                        fullWidth
                    />
                </View>
            </DashboardScreenContainer>
        </ScrollView>
    );
};
