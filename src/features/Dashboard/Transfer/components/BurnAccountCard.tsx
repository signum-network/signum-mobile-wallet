import { View, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text } from "@/components/Text";

interface Props {
  onSelect: () => void;
  isSelected: boolean;
}

export const BurnAccountCard = ({ onSelect, isSelected }: Props) => {
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={onSelect}
      className="rounded-xl overflow-hidden active:opacity-90"
      style={{
        height: 100,
        borderWidth: isSelected ? 3 : 0,
        borderColor: isSelected ? "#FF6B35" : "transparent",
      }}
    >
      {/* Background Image */}
      <Image
        source={require("@/assets/zero_burn_banner.jpg")}
        contentFit="cover"
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
        }}
      />

      {/* Dark overlay for text readability */}
      <View
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      />

      {/* Content */}
      <View className="relative w-full h-full px-4 flex flex-row items-center gap-3">
        {/* Animated Flame Avatar */}
        <View className="size-16 rounded-full overflow-hidden border-2 border-white/40 bg-black/20">
          <Image
            source={require("@/assets/zero_burn_avatar.gif")}
            contentFit="cover"
            style={{ width: "100%", height: "100%" }}
          />
        </View>

        {/* Text Content */}
        <View className="flex-1 gap-0.5">
          <View className="flex flex-row items-center gap-2">
            <Ionicons name="flame" size={20} color="#FF6B35" />
            <Text
              color="white"
              className="font-bold"
              style={{
                textShadowColor: "rgba(0, 0, 0, 0.75)",
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 3,
              }}
            >
              {t("transfer.burnAccount")}
            </Text>
          </View>

          <Text
            color="white"
            size="small"
            style={{
              textShadowColor: "rgba(0, 0, 0, 0.75)",
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 3,
            }}
          >
            {t("transfer.burnAccountDescription")}
          </Text>
        </View>

        {/* Selection Indicator */}
        {isSelected && (
          <View className="bg-white/90 rounded-full p-1.5 shadow-lg">
            <Ionicons name="checkmark-circle" size={24} color="#FF6B35" />
          </View>
        )}
      </View>
    </Pressable>
  );
};
