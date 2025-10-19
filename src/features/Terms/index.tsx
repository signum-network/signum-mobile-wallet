import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/Button";
import { signumWhiteSymbolPicture } from "@/assets";
import { Text } from "@/components/Text";
import { useAppStore } from "@/hooks/useAppStore";
import Markdown from "react-native-marked";

export const TermsScreen = () => {
  const { t } = useTranslation();
  const { setIsTermAgreed } = useAppStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const markdown = t("terms.openSourceMd");

  const saveTerms = () => {
    setIsTermAgreed(true);
    router.replace("/auth/enroll");
  };

  return (
    <View className="flex-1 gap-4 bg-white dark:bg-black">
      <View
        style={{ paddingTop: insets.top + 24 }}
        className="items-center justify-center pb-4 gap-4 bg-signum-dark"
      >
        <Image
          source={{ uri: signumWhiteSymbolPicture }}
          style={{ width: 96, height: 96 }}
        />
        <Text className="text-white font-bold text-3xl">{t("welcome")}</Text>
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

        <View className="flex-1 p-2 rounded-md border border-card-border dark:border-card-border-dark bg-muted dark:bg-muted-dark">
          <Markdown
            value={markdown}
            styles={{  li: { paddingBottom: 10 } }}
            flatListProps={{ style: { backgroundColor: "transparent" } }}
          />
        </View>
      </View>

      <View className="flex items-center px-4 gap-4 color-slate-500">
        <View
          className="w-full"
          style={{ paddingBottom: insets.bottom }}
        >
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
