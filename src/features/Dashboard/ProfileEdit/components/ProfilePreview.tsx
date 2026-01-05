import {View} from "react-native";
import {src44} from "@signumjs/standards";
import {GenericAccountCard} from "@/components/Account/GenericAccountCard";
import {Text} from "@/components/Text";
import {useTranslation} from "react-i18next";
import type {ProfileEdit} from "../utils/types";
import {type Account, Address} from "@signumjs/core";
import {useMemo} from "react";
import {useNodeHostStore} from "@/hooks/useNodeHostStore";

interface Props {
    formData: ProfileEdit;
}

export const ProfilePreview = ({formData}: Props) => {
    const {t} = useTranslation();
    const {addressPrefix} = useNodeHostStore()


    // Build descriptor from form data
    const builder = src44.DescriptorDataBuilder.create();
    if (formData.name) builder.setName(formData.name);
    if (formData.description) builder.setDescription(formData.description);
    if (formData.homepage) builder.setHomePage(formData.homepage);
    if (formData.socialMediaLinks.length)
        builder.setSocialMediaLinks(formData.socialMediaLinks);
    if (formData.avatarCid)
        builder.setAvatar(formData.avatarCid, formData.avatarMimeType);
    if (formData.backgroundCid)
        builder.setBackground(formData.backgroundCid, formData.backgroundMimeType);

    const descriptorData = builder.build();
    const descriptorString = descriptorData.stringify();
    const publicKey = formData.publicKey;

    const mockAccount = useMemo(() => {

        if (!publicKey) return {
            account: "",
            accountRS: "",
            name: "",
            description: "",
            accountRSExtended: "",
            isSecured: true,
            isAT: false
        } as Account;

        const address = Address.fromPublicKey(publicKey, addressPrefix);
        return {
            account: address.getNumericId(),
            accountRS: address.getReedSolomonAddress(),
            name: formData.name || "",
            description: descriptorString,
            accountRSExtended: "",
            isSecured: true,
            isAT: false
        } as Account;

    }, [publicKey, descriptorString, addressPrefix]);

    return (
        <View className="w-full flex flex-col gap-2">
            <View className="flex-row items-center justify-between">
                <Text size="large" className="font-bold">
                    {t("profile.cardPreview")}
                </Text>
            </View>

            <GenericAccountCard account={mockAccount} height={140}>
                {({showBackground}) => (
                    <View className="flex flex-col flex-1 justify-center">
                        <Text
                            className="font-medium text-lg"
                            color={showBackground ? "white" : "content"}
                            style={
                                showBackground
                                    ? {
                                        textShadowColor: "rgba(0, 0, 0, 0.75)",
                                        textShadowOffset: {width: 0, height: 1},
                                        textShadowRadius: 3,
                                    }
                                    : {}
                            }
                        >
                            {mockAccount.name || mockAccount.accountRS}
                        </Text>
                        {mockAccount.name && (
                            <Text
                                size="small"
                                color={showBackground ? "white" : "muted"}
                                style={
                                    showBackground
                                        ? {
                                            textShadowColor: "rgba(0, 0, 0, 0.75)",
                                            textShadowOffset: {width: 0, height: 1},
                                            textShadowRadius: 3,
                                        }
                                        : {}
                                }
                            >
                                {mockAccount.name ? mockAccount.accountRS : mockAccount.account}
                            </Text>
                        )}
                    </View>
                )}
            </GenericAccountCard>

            <Text size="small" color="muted" className="text-center">
                {t("profile.previewDescription")}
            </Text>
            <Text size="small" color="muted" className="text-center">
                {t("profile.ipfsWarning")}
            </Text>
        </View>
    );
};
