import {View, Modal, Pressable, ScrollView, Linking} from "react-native";
import {useTranslation} from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";
import {Image} from "expo-image";
import {Text} from "@/components/Text";
import {Card} from "@/components/Card";
import {useAppTheme} from "@/hooks/useAppTheme";

interface Props {
    visible: boolean;
    onClose: () => void;
}

const IPFS_PLATFORMS = [
    {
        name: "Storacha",
        url: "https://storacha.network",
        logo: require("../../../../../assets/storacha-bug.png"),
    },
    {
        name: "Pinata",
        url: "https://pinata.cloud",
        logo: require("../../../../../assets/pinata.png"),
    },
    {
        name: "NFT.Storage",
        url: "https://nft.storage",
        logo: require("../../../../../assets/nftStorage.png"),
    },
];

export const IpfsUploadGuide = ({visible, onClose}: Props) => {
    const {t} = useTranslation();
    const {tokens, iconColor} = useAppTheme();

    const openPlatform = async (url: string) => {
        try {
            await Linking.openURL(url);
        } catch (error) {
            console.error("Failed to open URL:", error);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-end" style={{backgroundColor: "rgba(0, 0, 0, 0.5)"}}>
                <View
                    className="rounded-t-3xl px-4 pt-4 pb-8"
                    style={{
                        backgroundColor: tokens.background,
                        maxHeight: "90%",
                    }}
                >
                    {/* Header */}
                    <View className="flex-row items-center justify-between mb-4">
                        <Text size="2large" className="font-bold">
                            {t("profile.ipfsGuide.title")}
                        </Text>
                        <Pressable onPress={onClose} hitSlop={8}>
                            <Ionicons name="close" size={28} color={iconColor.muted}/>
                        </Pressable>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View className="gap-4 pb-4">
                            {/* Step 1: Choose Platform */}
                            <View className="gap-3">
                                <View className="flex-row items-center gap-2">
                                    <View
                                        className="w-6 h-6 rounded-full items-center justify-center"
                                        style={{backgroundColor: tokens.primary}}
                                    >
                                        <Text color="white" size="small" className="font-bold">
                                            1
                                        </Text>
                                    </View>
                                    <Text size="large" className="font-bold">
                                        {t("profile.ipfsGuide.step1Title")}
                                    </Text>
                                </View>

                                <Text color="muted">
                                    {t("profile.ipfsGuide.step1Description")}
                                </Text>

                                {/* Platform Cards - Vertical Layout */}
                                <View className="gap-4">
                                    {IPFS_PLATFORMS.map((platform) => (
                                        <Pressable
                                            key={platform.name}
                                            onPress={() => openPlatform(platform.url)}
                                            style={({pressed}) => ({
                                                transform: [{scale: pressed ? 0.98 : 1}],
                                            })}
                                        >
                                            <View
                                                className="flex-row flex justify-between w-full items-center p-5 rounded-3xl"
                                                style={{
                                                    backgroundColor: tokens.surface,
                                                    shadowColor: "#000",
                                                    shadowOffset: {width: 0, height: 4},
                                                    shadowOpacity: 0.15,
                                                    shadowRadius: 12,
                                                    elevation: 8,
                                                }}
                                            >
                                                <View
                                                    className="items-center justify-center rounded-2xl mr-4"
                                                    style={{
                                                        width: 80,
                                                        height: 80,
                                                        backgroundColor: tokens.background,
                                                    }}
                                                >
                                                    <Image
                                                        source={platform.logo}
                                                        style={{width: 60, height: 60}}
                                                        contentFit="contain"
                                                    />
                                                </View>
                                                <View className="">
                                                    <Text
                                                        size="large"
                                                        className="font-bold"
                                                    >
                                                        {platform.name}
                                                    </Text>
                                                    <View className="flex-row items-center gap-1 mt-1">
                                                        <Text size="small" color="muted">
                                                            Open platform
                                                        </Text>
                                                        <Ionicons
                                                            name="arrow-forward"
                                                            size={14}
                                                            color={iconColor.primary}
                                                        />
                                                    </View>
                                                </View>
                                            </View>
                                        </Pressable>
                                    ))}
                                </View>
                            </View>

                            {/* Step 2: Upload Image */}
                            <View className="gap-2">
                                <View className="flex-row items-center gap-2">
                                    <View
                                        className="w-6 h-6 rounded-full items-center justify-center"
                                        style={{backgroundColor: tokens.primary}}
                                    >
                                        <Text color="white" size="small" className="font-bold">
                                            2
                                        </Text>
                                    </View>
                                    <Text size="large" className="font-bold">
                                        {t("profile.ipfsGuide.step2Title")}
                                    </Text>
                                </View>

                                <View className="pl-8 gap-1">
                                    <Text color="muted">
                                        • {t("profile.ipfsGuide.step2Bullet1")}
                                    </Text>
                                    <Text color="muted">
                                        • {t("profile.ipfsGuide.step2Bullet2")}
                                    </Text>
                                    <Text color="muted">
                                        • {t("profile.ipfsGuide.step2Bullet3")}
                                    </Text>
                                </View>
                            </View>

                            {/* Step 3: Copy CID */}
                            <View className="gap-2">
                                <View className="flex-row items-center gap-2">
                                    <View
                                        className="w-6 h-6 rounded-full items-center justify-center"
                                        style={{backgroundColor: tokens.primary}}
                                    >
                                        <Text color="white" size="small" className="font-bold">
                                            3
                                        </Text>
                                    </View>
                                    <Text size="large" className="font-bold">
                                        {t("profile.ipfsGuide.step3Title")}
                                    </Text>
                                </View>

                                <View className="pl-8 gap-1">
                                    <Text color="muted">
                                        {t("profile.ipfsGuide.step3Description")}
                                    </Text>
                                    <Text
                                        size="small"
                                        color="muted"
                                        className="font-mono mt-1"
                                    >
                                        {t("profile.ipfsGuide.cidExample")}
                                    </Text>
                                </View>
                            </View>

                            {/* Step 4: Paste in Form */}
                            <View className="gap-2">
                                <View className="flex-row items-center gap-2">
                                    <View
                                        className="w-6 h-6 rounded-full items-center justify-center"
                                        style={{backgroundColor: tokens.primary}}
                                    >
                                        <Text color="white" size="small" className="font-bold">
                                            4
                                        </Text>
                                    </View>
                                    <Text size="large" className="font-bold">
                                        {t("profile.ipfsGuide.step4Title")}
                                    </Text>
                                </View>

                                <View className="pl-8">
                                    <Text color="muted">
                                        {t("profile.ipfsGuide.step4Description")}
                                    </Text>
                                </View>
                            </View>

                            {/* What is IPFS? */}
                            <Card>
                                <View className="gap-2">
                                    <View className="flex-row items-center gap-2">
                                        <Ionicons
                                            name="information-circle"
                                            size={24}
                                            color={iconColor.primary}
                                        />
                                        <Text size="large" className="font-bold">
                                            {t("profile.ipfsGuide.whatIsIpfsTitle")}
                                        </Text>
                                    </View>
                                    <Text color="muted">
                                        {t("profile.ipfsGuide.whatIsIpfsDescription")}
                                    </Text>
                                </View>
                            </Card>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};
