import { useMemo } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/Button";
import { signumWhiteSymbolPicture } from "@/assets";
import { Text } from "@/components/Text";
import { useAppStore } from "@/hooks/useAppStore";
import { useAppTheme } from "@/hooks/useAppTheme";
import Markdown from "react-native-marked";

export const TermsScreen = () => {
  const { t } = useTranslation();
  const { tokens } = useAppTheme();
  const { setIsTermAgreed } = useAppStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

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

    return `# ${t("terms.title")}\n\n${body}\n\n**By continuing, you acknowledge that:**\n${bullets}\n\n${links}`;
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
    </View>
  );
};
