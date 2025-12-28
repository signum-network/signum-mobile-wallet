import { View } from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { StatusBadge } from "./StatusBadge";
import type { StatusIndicator } from "./types";

interface StatusIndicatorsProps {
  indicators: StatusIndicator[];
  showBackground: boolean;
}

export const StatusIndicators: React.FC<StatusIndicatorsProps> = ({
  indicators,
  showBackground,
}) => {
  const { tokens } = useAppTheme();

  if (!indicators || indicators.length === 0) return null;

  const getStatusBadgeConfig = (indicator: StatusIndicator) => {
    const baseAlpha = showBackground ? 0.9 : 1;

    switch (indicator.type) {
      case "contract":
        return {
          icon: "code-slash" as const,
          backgroundColor: showBackground
            ? `rgba(59, 130, 246, ${baseAlpha})`
            : tokens.primary ?? "#3B82F6",
        };
      case "nft":
        return {
          icon: "image" as const,
          backgroundColor: showBackground
            ? `rgba(139, 92, 246, ${baseAlpha})`
            : "#8B5CF6",
        };
      case "watchOnly":
        return {
          icon: "eye-outline" as const,
          backgroundColor: showBackground
            ? `rgba(107, 114, 128, ${baseAlpha})`
            : "#6B7280",
        };
      case "unsecured":
        return {
          icon: "shield-outline" as const,
          backgroundColor: showBackground
            ? `rgba(239, 68, 68, ${baseAlpha})`
            : "#EF4444",
        };
      default:
        return {
          icon: "information-circle" as const,
          backgroundColor: showBackground
            ? `rgba(107, 114, 128, ${baseAlpha})`
            : "#6B7280",
        };
    }
  };

  return (
    <View className="flex flex-row gap-1 flex-wrap mt-0.5">
      {indicators.map((indicator, index) => {
        const config = getStatusBadgeConfig(indicator);
        return (
          <StatusBadge
            key={`${indicator.type}-${index}`}
            icon={config.icon}
            label={indicator.label}
            backgroundColor={config.backgroundColor}
          />
        );
      })}
    </View>
  );
};
