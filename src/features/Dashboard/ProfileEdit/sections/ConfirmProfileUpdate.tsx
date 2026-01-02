import {Alert, View} from "react-native";
import {useTranslation} from "react-i18next";
import {useFormContext} from "react-hook-form";
import {Amount} from "@signumjs/util";
import {src44} from "@signumjs/standards";
import {useAppTheme} from "@/hooks/useAppTheme";
import {Button} from "@/components/Button";
import {Text} from "@/components/Text";
import {Card} from "@/components/Card";
import {openTransactionLink} from "@/utils/explorer/openLink";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Clipboard from "expo-clipboard";
import {ConfirmationCard} from "@/components/ConfirmationCard";
import {TotalAmount} from "@/components/TotalAmount";
import type {ProfileEdit} from "@/features/Dashboard/ProfileEdit/utils/types";
import {calculateDescriptorFee} from "@/features/Dashboard/ProfileEdit/utils/calculateDescriptorFee";
import {useState} from "react";
import {ProfilePreview} from "@/features/Dashboard/ProfileEdit/components/ProfilePreview";
import {readSecretKey} from "@/utils/sec/handleSecretKeys";
import {useLedgerService} from "@/hooks/useLedgerService";
import {useProfileEditDraftStore} from "@/hooks/useProfileEditDraftStore";
import {useNodeHostStore} from "@/hooks/useNodeHostStore";


export const ConfirmationProfileUpdate = () => {
    const {t} = useTranslation();
    const {iconColor} = useAppTheme();
    const {watch} = useFormContext<ProfileEdit>();
    const {ledgerService} = useLedgerService();
    const {currentNetwork} = useNodeHostStore()
    const [transactionId, setTransactionId] = useState("");
    const {clearDraft} = useProfileEditDraftStore()

    const publicKey = watch("publicKey");
    const name = watch("name");
    const description = watch("description");
    const homepage = watch("homepage");
    const socialMediaLinks = watch("socialMediaLinks");
    const avatarCid = watch("avatarCid");
    const backgroundCid = watch("backgroundCid");

    const formData = watch();

    const builder = src44.DescriptorDataBuilder.create();
    if (name) builder.setName(name);
    if (description) builder.setDescription(description);
    if (homepage) builder.setHomePage(homepage);
    if (socialMediaLinks.length) builder.setSocialMediaLinks(socialMediaLinks);
    if (avatarCid) builder.setAvatar(avatarCid, formData.avatarMimeType);
    if (backgroundCid) builder.setBackground(backgroundCid, formData.backgroundMimeType);
    const descriptorData = builder.build();

    const descriptorString = descriptorData.stringify();
    const descriptorLength = descriptorString.length;
    const feePlanck = calculateDescriptorFee(descriptorData);
    const feeAmount = Amount.fromPlanck(feePlanck);

    const copyTransactionId = async () => {
        await Clipboard.setStringAsync(transactionId);
        alert(t("overview.copiedTransactionId"));
    };

    const openTransactionInExplorer = () => openTransactionLink(transactionId);


    const handleSubmit = async () => {

        try {
            if (!publicKey) {
                console.warn("No public key");
                return;
            }

            const secretKeys = await readSecretKey(publicKey);
            if (!ledgerService || !secretKeys) throw new Error("invalid data");
            const {signPrivateKey} = secretKeys;

            const transaction = await ledgerService.account.setAccountDescriptor({
                senderPublicKey: publicKey,
                senderPrivateKey: signPrivateKey,
                descriptor: descriptorData,
                feePlanck
            })

            clearDraft(publicKey, currentNetwork);
            setTransactionId(transaction.id);

        } catch (error: any) {
            console.error("Update failed", error.message);
            Alert.alert(t("profile.updateFailed"))
        }
    };


    return (
        <View className="gap-4 w-full pb-32">
            {transactionId ? (
                <Card>
                    <View className="w-full flex flex-col items-center gap-1">
                        <Ionicons name="checkmark-circle" size={65} color={iconColor.green}/>

                        <Text
                            fullWidth
                            className="text-center"
                            color="success"
                            size="large"
                        >
                            {t("profile.updateSuccess")}
                        </Text>

                        <Text fullWidth className="text-center" color="muted">
                            {t("profile.updateSuccessDescription")}
                        </Text>
                    </View>

                    {transactionId && (
                        <View className="w-full flex flex-col items-center justify-center gap-4 px-4">
                            <Button
                                type="blackout"
                                title={t("overview.copyTransactionId")}
                                pressableProps={{onPress: copyTransactionId}}
                                fullWidth
                                size="small"
                                icon={
                                    <Ionicons name="copy" size={18} color={iconColor.blackout}/>
                                }
                                wide
                            />

                            <Button
                                type="primary"
                                title={t("overview.viewInExplorer")}
                                pressableProps={{onPress: openTransactionInExplorer}}
                                fullWidth
                                size="small"
                                icon={<Ionicons name="link" size={18} color="white"/>}
                                wide
                            />
                        </View>
                    )}
                </Card>
            ) : (
                <>
                    <Card>
                        <View className="w-full flex flex-col gap-4">
                            <Text size="2large" className="font-bold">
                                {t("profile.profilePreview")}
                            </Text>

                            {/* Name */}
                            {name && (
                                <View className="w-full flex flex-col gap-1">
                                    <Text size="large" color="muted" className="font-bold">
                                        {t("profile.name")}
                                    </Text>
                                    <Text>{name}</Text>
                                </View>
                            )}

                            {/* Description */}
                            {description && (
                                <View className="w-full flex flex-col gap-1">
                                    <Text size="large" color="muted" className="font-bold">
                                        {t("profile.description")}
                                    </Text>
                                    <Text>{description}</Text>
                                </View>
                            )}

                            {/* Homepage */}
                            {homepage && (
                                <View className="w-full flex flex-col gap-1">
                                    <Text size="large" color="muted" className="font-bold">
                                        {t("profile.homepage")}
                                    </Text>
                                    <Text>{homepage}</Text>
                                </View>
                            )}

                            {/* Social Media */}
                            {socialMediaLinks.length > 0 && (
                                <View className="w-full flex flex-col gap-1">
                                    <Text size="large" color="muted" className="font-bold">
                                        {t("profile.socialMedia")}
                                    </Text>
                                    {socialMediaLinks.map((link, index) => (
                                        <Text key={index}>• {link}</Text>
                                    ))}
                                </View>
                            )}

                            {/* Avatar CID */}
                            {avatarCid && (
                                <View className="w-full flex flex-col gap-1">
                                    <Text size="large" color="muted" className="font-bold">
                                        {t("profile.avatar")}
                                    </Text>
                                    <Text size="small" className="font-mono">
                                        {avatarCid}
                                    </Text>
                                </View>
                            )}

                            {/* Background CID */}
                            {backgroundCid && (
                                <View className="w-full flex flex-col gap-1">
                                    <Text size="large" color="muted" className="font-bold">
                                        {t("profile.background")}
                                    </Text>
                                    <Text size="small" className="font-mono">
                                        {backgroundCid}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </Card>

                    {/* Live Preview Card */}
                    <Card>
                        <ProfilePreview formData={formData}/>
                    </Card>

                    <Card>
                        <View className="w-full flex flex-col gap-4">

                            {/* Descriptor Length */}
                            <View className="w-full flex flex-col gap-1">
                                <Text size="large" color="muted" className="font-bold">
                                    {t("profile.descriptorLength")}
                                </Text>
                                <Text>
                                    {descriptorLength} / 1000 {t("profile.characters")}
                                </Text>
                            </View>

                            <TotalAmount fee={feeAmount} total={feeAmount}/>
                        </View>
                    </Card>

                    <ConfirmationCard onConfirm={handleSubmit} isDisabled={transactionId !== ""}/>
                </>
            )}
        </View>
    );
};
