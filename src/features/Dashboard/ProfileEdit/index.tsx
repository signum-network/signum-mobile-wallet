import {useRef, type RefObject, useEffect} from "react";
import {View, ScrollView, ActivityIndicator} from "react-native";
import {useForm, FormProvider} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {profileEditSchema} from "./utils/schemas";
import {Steps, type ProfileEdit} from "./utils/types";
import {ProfileForm} from "./sections/ProfileForm";
import {ConfirmationProfileUpdate} from "./sections/ConfirmProfileUpdate";
import {DraftDialog} from "./sections/DraftDialog";
import {FormNavigation} from "./components/FormNavigation";
import {FormStepper} from "./components/FormStepper";
import {KeyboardDismissView} from "@/components/KeyboardDismissView";
import {useQueryAccount} from "@/hooks/useQueryAccount";
import {useAccountStore} from "@/hooks/useAccountStore";
import {useRouter} from "expo-router";
import {Card} from "@/components/Card";
import {useProfileEditDraftStore} from "@/hooks/useProfileEditDraftStore";
import {useNodeHostStore} from "@/hooks/useNodeHostStore";
import {src44} from "@signumjs/standards";
import {Text} from "@/components/Text";
import {useAppTheme} from "@/hooks/useAppTheme";
import {useTranslation} from "react-i18next";

interface Props {
    accountId: string
}

export const ProfileEditScreen = ({accountId}: Props) => {
    const {t} = useTranslation();
    const {tokens} = useAppTheme();
    const scrollRef: RefObject<ScrollView> = useRef(null!);
    const draftDetectionRef = useRef(false);
    const formIsInitialized = useRef(false);
    const {data: account} = useQueryAccount(accountId);
    const {currentNetwork} = useNodeHostStore();
    const {getDraft} = useProfileEditDraftStore();
    const methods = useForm<ProfileEdit>({
        mode: "onChange",
        // @ts-ignore
        resolver: yupResolver(profileEditSchema),
        defaultValues: {
            activeStep: Steps.Initializing,
            publicKey: "",
            name: "",
            description: "",
            homepage: "",
            socialMediaLinks: [],
            avatarCid: "",
            backgroundCid: "",
            avatarMimeType: "image/jpeg",
            backgroundMimeType: "image/jpeg",
        },
    });
    const {accounts} = useAccountStore();
    const router = useRouter()
    const activeStep = methods.watch("activeStep")

    useEffect(() => {
            if (account && accounts && !draftDetectionRef.current) {
                // verify if this is also an registered account.
                if (!accounts[account.publicKey]) {
                    router.push("/dashboard")
                    alert("profile.notRegistered")
                }
                methods.setValue("publicKey", account.publicKey)
                // check for draft
                methods.setValue("activeStep", getDraft(accountId, currentNetwork) ? Steps.DraftDialog:  Steps.ProfileForm)
                draftDetectionRef.current = true
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [account, accounts, accountId, currentNetwork]
    )

    useEffect(() => {
        if (account && activeStep === Steps.ProfileForm && !formIsInitialized.current) {
            const draft = getDraft(accountId, currentNetwork)

            const {setValue} = methods

            try {
                const descriptor = src44.DescriptorData.parse(account.description, false)
                setValue("name", descriptor.name || draft?.name || "")
                setValue("description", descriptor.description || draft?.description || "")
                setValue("avatarCid", descriptor.avatar.ipfsCid || draft?.avatarCid || "")
                setValue("avatarMimeType", descriptor.avatar.mimeType || draft?.avatarMimeType || "")
                setValue("backgroundCid", descriptor.background.ipfsCid || draft?.backgroundCid || "")
                setValue("backgroundMimeType", descriptor.background.mimeType || draft?.backgroundMimeType || "")
                setValue("socialMediaLinks", descriptor.socialMediaLinks || draft?.socialMediaLinks || [])
            } catch (e) {
                setValue("name", account.name || draft?.name || "")
                setValue("description", account.description || draft?.description || "")
                setValue("avatarCid", draft?.avatarCid || "")
                setValue("avatarMimeType", draft?.avatarMimeType || "")
                setValue("backgroundCid", draft?.backgroundCid || "")
                setValue("backgroundMimeType", draft?.backgroundMimeType || "")
                setValue("socialMediaLinks", draft?.socialMediaLinks || [])
            }

            formIsInitialized.current = true
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeStep, account, accountId, currentNetwork]);


    const scrollToTop = () => {
        scrollRef.current?.scrollTo({y: 0, animated: true});
    };

    return (
        <KeyboardDismissView>
            <FormProvider {...methods}>
                <View className="flex-1">
                    {activeStep > Steps.DraftDialog && <FormStepper/>}

                    <ScrollView
                        ref={scrollRef}
                        keyboardDismissMode="on-drag"
                        keyboardShouldPersistTaps="handled"
                    >
                        <View className="px-4 pt-4">
                            {activeStep === Steps.Initializing && (
                                <Card>
                                    <View className="items-center justify-center py-16 gap-4">
                                        <ActivityIndicator size="large" color={tokens.primary}/>
                                        <Text size="large" color="muted" className="text-center">
                                            {t("profile.loading")}
                                        </Text>
                                    </View>
                                </Card>
                            )}

                            {activeStep === Steps.DraftDialog && (
                                <DraftDialog
                                    accountId={accountId}
                                    onContinue={() => {
                                        methods.setValue("activeStep", Steps.ProfileForm);
                                        scrollToTop();
                                    }}
                                />
                            )}
                            {activeStep === Steps.ProfileForm && (
                                <ProfileForm/>
                            )}
                            {activeStep === Steps.Confirmation && (
                                <ConfirmationProfileUpdate/>
                            )}

                            {activeStep !== Steps.DraftDialog && <FormNavigation/>}
                        </View>
                    </ScrollView>
                </View>
            </FormProvider>
        </KeyboardDismissView>
    );
};
