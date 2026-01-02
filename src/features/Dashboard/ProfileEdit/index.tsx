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


interface Props {
    accountId: string
}

export const ProfileEditScreen = ({accountId}: Props) => {
    const scrollRef: RefObject<ScrollView> = useRef(null!);
    const formIsInitialized = useRef(false);
    const {data: account} = useQueryAccount(accountId);
    const {currentNetwork}  = useNodeHostStore();
    const { getDraft } = useProfileEditDraftStore();
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
            if (account && accounts) {
                // verify if this is also an registered account.
                if (!accounts[account.publicKey]) {
                    router.push("/dashboard")
                    alert("profile.notRegistered")
                }
                methods.setValue("publicKey", account.publicKey)
                // check for draft
                if (getDraft(accountId, currentNetwork)) {
                    methods.setValue("activeStep", Steps.DraftDialog)
                }else{
                    methods.setValue("activeStep", Steps.ProfileForm)
                }
            }
        },
        [account, accounts, router, getDraft, currentNetwork, methods.setValue]
    )

    useEffect(() => {
        if(account && activeStep === Steps.ProfileForm && !formIsInitialized.current){
            const draft = getDraft(accountId, currentNetwork)

            const {setValue} = methods

            try{
                const descriptor = src44.DescriptorData.parse(account.description, false)
                setValue("name", descriptor.name || draft?.name || "")
                setValue("description", descriptor.description || draft?.description || "")
                setValue("avatarCid", descriptor.avatar.ipfsCid || draft?.avatarCid || "")
                setValue("avatarMimeType", descriptor.avatar.mimeType || draft?.avatarMimeType || "")
                setValue("backgroundCid", descriptor.background.ipfsCid || draft?.backgroundCid || "")
                setValue("backgroundMimeType", descriptor.background.mimeType || draft?.backgroundMimeType || "")
                setValue("socialMediaLinks", descriptor.socialMediaLinks || draft?.socialMediaLinks || [])
            }catch(e){
                setValue("name", account.name || draft?.name || "")
                setValue("description", account.description || draft?.description || "")
                setValue("avatarCid", draft?.avatarCid || "")
                setValue("avatarMimeType", draft?.avatarMimeType || "")
                setValue("backgroundCid", draft?.backgroundCid || "")
                setValue("backgroundMimeType", draft?.backgroundMimeType || "")
                setValue("socialMediaLinks",  draft?.socialMediaLinks || [])
            }

            formIsInitialized.current = true
        }
    }, [activeStep, account, methods.setValue, getDraft, currentNetwork]);


    const scrollToTop = () => {
        scrollRef.current?.scrollTo({y: 0, animated: true});
    };

    return (
        <KeyboardDismissView>
            <FormProvider {...methods}>
                <View className="flex-1">
                    {activeStep !== Steps.DraftDialog && <FormStepper/>}

                    <ScrollView ref={scrollRef}>
                        <View className="px-4 pt-4">
                            {activeStep === Steps.Initializing && (
                                <Card>
                                    <ActivityIndicator size={"large"} color={"#0000ff"} style={{marginTop: 100, marginBottom: 100}}/>
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
                                <ConfirmationProfileUpdate />
                            )}
                        </View>
                    </ScrollView>

                    {activeStep !== Steps.DraftDialog && <FormNavigation/>}
                </View>
            </FormProvider>
        </KeyboardDismissView>
    );
};
