import { useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Button } from "@/components/Button";
import { Dialog } from "@/components/Dialog";
import { signumWhiteSymbolPicture } from "@/assets";
import { Text } from "@/components/Text";
import { useAppStore } from "@/hooks/useAppStore";
import { useAppTheme } from "@/hooks/useAppTheme";
import { LanguageCard } from "@/features/Dashboard/Settings/Language/components/LanguageCard";
import { lngCards } from "@/locales";
import Markdown from "react-native-marked";

export const TermsScreen = () => {
  const { t } = useTranslation();
  const { tokens } = useAppTheme();
  const { setIsTermAgreed } = useAppStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [languageDialogVisible, setLanguageDialogVisible] = useState(false);

  const markdown = useMemo(() => {
    const sections = [
      "nonCustodial",
      "useAtOwnRisk",
      "irreversible",
      "thirdParty",
      "misuse",
      "regulatory",
      "noFinancialAdvice",
    ] as const;

    const body = sections.map((key) => t(`terms.${key}`)).join("\n\n");

    const acknowledgments = t("terms.acknowledgments", {
      returnObjects: true,
    }) as string[];
    const bullets = acknowledgments.map((item) => `- ${item}`).join("\n");

    const links = [
      `**Source code:** ${t("terms.sourceCodeUrl")}`,
      `**License:** ${t("terms.license")}`,
    ].join("\n\n");

    return `# ${t("terms.title")}\n\n${body}\n\n**${t("terms.acknowledgmentsIntro")}**\n${bullets}\n\n${links}`;
  }, [t]);

  const saveTerms = () => {
    setIsTermAgreed(true);
    router.replace("/auth/enroll");
  };

  return (
    <View
      className="flex-1 gap-4"
      style={{
        backgroundColor: tokens.background,
      }}
    >
      <View
        className="items-center justify-center pb-4 gap-4"
        style={{
          paddingTop: insets.top + 24,
          backgroundColor: tokens.primary,
        }}
      >
        <Pressable
          onPress={() => setLanguageDialogVisible(true)}
          className="absolute right-4 active:opacity-70"
          style={{ top: insets.top + 12 }}
        >
          <Ionicons name="globe-outline" size={28} color="white" />
        </Pressable>
        <Image
          source={{ uri: signumWhiteSymbolPicture }}
          style={{ width: 96, height: 96 }}
        />
        <Text size="extraLarge" className="font-bold" color="white">
          {t("welcome")}
        </Text>
      </View>
      <View style={{ flex: 0.95 }} className="px-4 gap-4">
        <View>
          <Text size="large" color="muted" className="text-center font-medium">
            {t("terms.requestFirstLine")}
          </Text>
          <Text size="large" color="muted" className="text-center font-medium">
            {t("terms.requestSecondLine")}
          </Text>
        </View>
        <View
          className="flex-1 p-2 rounded-md border"
          style={{
            borderColor: tokens.border,
            backgroundColor: tokens.surface,
          }}
        >
          <Markdown
            value={markdown}
            styles={{ li: { paddingBottom: 10, color: tokens.text } }}
            flatListProps={{
              style: { backgroundColor: "transparent" },
            }}
          />
        </View>
      </View>
      <View className="flex items-center px-4 gap-4">
        <View className="w-full" style={{ paddingBottom: insets.bottom }}>
          <Button
            type="primary"
            title={t("continue")}
            pressableProps={{ onPress: saveTerms }}
          />
        </View>
      </View>

      <Dialog
        visible={languageDialogVisible}
        variant="transparent"
        onClose={() => setLanguageDialogVisible(false)}
      >
        <View className="p-4 gap-3">
          <View className="flex-row justify-between items-center mb-2">
            <Text size="large" className="font-bold">
              {t("settings.language.title")}
            </Text>
            <Pressable
              onPress={() => setLanguageDialogVisible(false)}
              className="active:opacity-70"
            >
              <Ionicons name="close" size={24} color={tokens.text} />
            </Pressable>
          </View>
          <ScrollView style={{ maxHeight: 400 }}>
            <View className="gap-2">
              {lngCards.map(({ lng, label }) => (
                <Pressable
                  key={lng}
                  onPress={() => setLanguageDialogVisible(false)}
                >
                  <LanguageCard lng={lng} label={label} />
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>
      </Dialog>
    </View>
  );
};
