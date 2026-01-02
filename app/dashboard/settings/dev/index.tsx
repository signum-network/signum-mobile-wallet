import { Fragment } from "react";
import {SettingsCard} from "@/features/Dashboard/Settings/Home/components/SettingsCard";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useAppTheme} from "@/hooks/useAppTheme";
import {DashboardScreenContainer} from "@/features/Dashboard/components/DashboardScreenContainer";
import {View} from "react-native";

export default function Screen() {
    const {iconColor} = useAppTheme()
  return (
    <Fragment>
        <DashboardScreenContainer>
            <View className="flex flex-col w-full p-4 gap-4">
                <SettingsCard
                    icon={<Ionicons name="link-outline" size={24} color={iconColor.default}/>}
                    title="Deeplink Signing Screen Tester"
                    description="Check how the deeplink signing screen will look like"
                    href="/dashboard/settings/dev/sign-preview"
                />
            </View>
        </DashboardScreenContainer>
    </Fragment>
  );
}
