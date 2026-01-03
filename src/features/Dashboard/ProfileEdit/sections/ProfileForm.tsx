import {View, ScrollView, Pressable} from "react-native";
import {useTranslation} from "react-i18next";
import {useFormContext, Controller} from "react-hook-form";
import Ionicons from "@expo/vector-icons/Ionicons";
import {Text} from "@/components/Text";
import {Card} from "@/components/Card";
import {TextInput} from "@/components/TextInput";
import {Button} from "@/components/Button";
import {useAppTheme} from "@/hooks/useAppTheme";
import type {ProfileEdit} from "@/features/Dashboard/ProfileEdit/utils/types";
import {ProfilePreview} from "@/features/Dashboard/ProfileEdit/components/ProfilePreview";
import {IpfsUploadGuide} from "@/features/Dashboard/ProfileEdit/components/IpfsUploadGuide";
import {useEffect, useRef, useState} from "react";
import {useProfileEditDraftStore} from "@/hooks/useProfileEditDraftStore";
import {useNodeHostStore} from "@/hooks/useNodeHostStore";

export const ProfileForm = () => {
    const debounceTimeout = useRef(0);
    const {t} = useTranslation();
    const {iconColor} = useAppTheme();
    const {currentNetwork} = useNodeHostStore();
    const {watch, setValue, control, formState, getValues} = useFormContext<ProfileEdit>();
    const {saveDraft} = useProfileEditDraftStore();
    const [showIpfsGuide, setShowIpfsGuide] = useState(false);

    const name = watch("name");
    const description = watch("description");
    const homepage = watch("homepage");
    const socialMediaLinks = watch("socialMediaLinks");
    const formData = watch();

    useEffect(() => {
        if (formState.isDirty && debounceTimeout.current === 0) {
            debounceTimeout.current = setTimeout(() => {
                const currentFormData = getValues();
                saveDraft(currentFormData.publicKey, currentNetwork, currentFormData as ProfileEdit);
                debounceTimeout.current = 0;
            }, 2_000)
        }
        return () => {
            const currentFormData = getValues();
            saveDraft(currentFormData.publicKey, currentNetwork, currentFormData as ProfileEdit);
            clearTimeout(debounceTimeout.current);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formState.isDirty, currentNetwork]);


    const {errors} = formState;

    const addSocialLink = () => {
        if (socialMediaLinks.length < 3) {
            setValue("socialMediaLinks", [...socialMediaLinks, ""]);
        }
    };

    const removeSocialLink = (index: number) => {
        const newLinks = socialMediaLinks.filter((_, i) => i !== index);
        setValue("socialMediaLinks", newLinks);
    };

    const updateSocialLink = (index: number, value: string) => {
        const newLinks = [...socialMediaLinks];
        newLinks[index] = value;
        setValue("socialMediaLinks", newLinks);
    };

    return (
        <View>
            <ScrollView>
                <View className="gap-4 w-full pb-32">
                    {/* Live Preview */}
                    <Card>
                        <ProfilePreview formData={formData}/>
                    </Card>

                    {/* Name Field */}
                    <Card>
                        <View>
                            <Text size="large" className="font-medium">
                                {t("profile.name")}
                            </Text>
                            <Text size="small" color="muted">
                                {t("profile.nameHelper")}
                            </Text>
                        </View>

                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder={t("profile.namePlaceholder")}
                                    returnKeyType="next"
                                    size="medium"
                                    maxLength={24}
                                    clearButtonEnabled
                                />
                            )}
                            name="name"
                        />

                        <View className="flex-row justify-between items-center">
                            {errors.name && (
                                <Text color="error" size="small">
                                    {errors.name.message}
                                </Text>
                            )}
                            <Text
                                color={name.length > 24 ? "error" : "muted"}
                                className="self-end"
                                size="small"
                            >
                                {`${name.length}/24`}
                            </Text>
                        </View>
                    </Card>

                    {/* Description Field */}
                    <Card>
                        <View>
                            <Text size="large" className="font-medium">
                                {t("profile.description")}
                            </Text>
                            <Text size="small" color="muted">
                                {t("profile.descriptionHelper")}
                            </Text>
                        </View>

                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder={t("profile.descriptionPlaceholder")}
                                    returnKeyType="done"
                                    extraClassNames="min-h-24"
                                    size="medium"
                                    maxLength={384}
                                    multiline
                                    textAlignVertical="top"
                                />
                            )}
                            name="description"
                        />

                        <View className="flex-row justify-between items-center">
                            {errors.description && (
                                <Text color="error" size="small">
                                    {errors.description.message}
                                </Text>
                            )}
                            <Text
                                color={description.length > 384 ? "error" : "muted"}
                                className="self-end"
                                size="small"
                            >
                                {`${description.length}/384`}
                            </Text>
                        </View>
                    </Card>

                    {/* Homepage Field */}
                    <Card>
                        <View>
                            <Text size="large" className="font-medium">
                                {t("profile.homepage")}
                            </Text>
                            <Text size="small" color="muted">
                                {t("profile.homepageHelper")}
                            </Text>
                        </View>

                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder={t("profile.homepagePlaceholder")}
                                    returnKeyType="next"
                                    size="medium"
                                    maxLength={128}
                                    keyboardType="url"
                                    autoCapitalize="none"
                                    clearButtonEnabled
                                />
                            )}
                            name="homepage"
                        />

                        <View className="flex-row justify-between items-center">
                            {errors.homepage && (
                                <Text color="error" size="small">
                                    {errors.homepage.message}
                                </Text>
                            )}
                            <Text color="muted" className="self-end" size="small">
                                {`${homepage.length}/128`}
                            </Text>
                        </View>
                    </Card>

                    {/* Social Media Links */}
                    <Card>
                        <View>
                            <Text size="large" className="font-medium">
                                {t("profile.socialMedia")}
                            </Text>
                            <Text size="small" color="muted">
                                {t("profile.socialMediaHelper")}
                            </Text>
                        </View>

                        {socialMediaLinks.map((link, index) => (
                            <View key={index} className="flex-row gap-2 items-center">
                                <View className="flex-1">
                                    <TextInput
                                        value={link}
                                        onChangeText={(value) => updateSocialLink(index, value)}
                                        placeholder={`${t("profile.socialMediaPlaceholder")} ${
                                            index + 1
                                        }`}
                                        returnKeyType="next"
                                        size="medium"
                                        maxLength={92}
                                        keyboardType="url"
                                        autoCapitalize="none"
                                    />
                                    {errors.socialMediaLinks?.[index] && (
                                        <Text color="error" size="small">
                                            {errors.socialMediaLinks[index]?.message}
                                        </Text>
                                    )}
                                </View>
                                <Pressable onPress={() => removeSocialLink(index)}>
                                    <Ionicons
                                        name="trash-outline"
                                        size={24}
                                        color={iconColor.red}
                                    />
                                </Pressable>
                            </View>
                        ))}

                        {socialMediaLinks.length < 3 && (
                            <Button
                                type="secondary"
                                title={t("profile.addSocialLink")}
                                icon={<Ionicons name="add" size={18} color={iconColor.primary}/>}
                                pressableProps={{
                                    onPress: addSocialLink,
                                }}
                                fullWidth
                            />
                        )}
                    </Card>

                    {/* IPFS Images Section Header */}
                    <View className="flex-row items-center justify-between pt-2">
                        <Text size="extraLarge" className="font-bold">
                            {t("profile.ipfsImagesSection")}
                        </Text>
                        <Pressable onPress={() => setShowIpfsGuide(true)} hitSlop={8}>
                            <Ionicons
                                name="information-circle-outline"
                                size={28}
                                color={iconColor.primary}
                            />
                        </Pressable>
                    </View>

                    {/* Avatar IPFS CID */}
                    <Card>
                        <View>
                            <Text size="large" className="font-medium">
                                {t("profile.avatar")}
                            </Text>
                            <Text size="small" color="muted">
                                {t("profile.avatarHelper")}
                            </Text>
                        </View>

                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder={t("profile.avatarPlaceholder")}
                                    returnKeyType="next"
                                    size="medium"
                                    autoCapitalize="none"
                                    clearButtonEnabled
                                />
                            )}
                            name="avatarCid"
                        />

                        {errors.avatarCid && (
                            <Text color="error" size="small">
                                {errors.avatarCid.message}
                            </Text>
                        )}

                        <Text size="small" color="muted" className="mt-1">
                            {t("profile.ipfsInstructions")}
                        </Text>
                    </Card>

                    {/* Background IPFS CID */}
                    <Card>
                        <View>
                            <Text size="large" className="font-medium">
                                {t("profile.background")}
                            </Text>
                            <Text size="small" color="muted">
                                {t("profile.backgroundHelper")}
                            </Text>
                        </View>

                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder={t("profile.backgroundPlaceholder")}
                                    returnKeyType="done"
                                    size="medium"
                                    autoCapitalize="none"
                                    clearButtonEnabled
                                />
                            )}
                            name="backgroundCid"
                        />

                        {errors.backgroundCid && (
                            <Text color="error" size="small">
                                {errors.backgroundCid.message}
                            </Text>
                        )}

                        <Text size="small" color="muted" className="mt-1">
                            {t("profile.ipfsInstructions")}
                        </Text>
                    </Card>
                </View>
            </ScrollView>

            {/* IPFS Upload Guide Modal */}
            <IpfsUploadGuide
                visible={showIpfsGuide}
                onClose={() => setShowIpfsGuide(false)}
            />
        </View>
    );
};
