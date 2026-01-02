import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useNodeHostStore } from "@/hooks/useNodeHostStore";
import { useProfileEditDraftStore } from "@/hooks/useProfileEditDraftStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import type {ProfileEdit} from "@/features/Dashboard/ProfileEdit/utils/types";

interface Props {
    accountId: string;
    onContinue: () => void;
}

export const DraftDialog = ({ accountId, onContinue }: Props) => {
    const { t } = useTranslation();
    const { iconColor } = useAppTheme();
    const { currentNetwork } = useNodeHostStore();
    const { getDraft, clearDraft } = useProfileEditDraftStore();
    const { reset } = useFormContext<ProfileEdit>();

    const handleContinueDraft = () => {
        const draft = getDraft(accountId, currentNetwork);
        if (draft) {
            reset(draft);
        }
        onContinue();
    };

    const handleStartFresh = () => {
        clearDraft(accountId, currentNetwork);
        onContinue();
    };

    return (
        <View className="gap-4 w-full pt-[25%]">
            <Card>
                <View className="gap-4 items-center py-4">
                    <Ionicons name="document-text" size={64} color={iconColor.primary} />
                    <Text size="2large" className="font-bold text-center">
                        {t("profile.draftFound")}
                    </Text>
                    <Text className="text-center" color="muted">
                        {t("profile.draftFoundDescription")}
                    </Text>
                </View>
                <View className="gap-2 w-full mt-4">
                    <Button
                        type="primary"
                        title={t("profile.continueDraft")}
                        pressableProps={{onPress: handleContinueDraft}}
                        fullWidth
                        icon={<Ionicons name="play" size={18} color="white"/>}
                    />
                    <Button
                        type="secondary"
                        title={t("profile.startFresh")}
                        pressableProps={{onPress: handleStartFresh}}
                        fullWidth
                        icon={<Ionicons name="refresh" size={18} color={iconColor.primary}/>}
                    />
                </View>
            </Card>
        </View>
    );
};
