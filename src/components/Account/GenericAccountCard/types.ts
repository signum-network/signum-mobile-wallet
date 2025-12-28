import type { ReactNode } from "react";
import type { Account } from "@signumjs/core";
import type Ionicons from "@expo/vector-icons/Ionicons";

export interface AccountImages {
  avatarUrl: string | null;
  backgroundUrl: string | null;
}

export interface StatusIndicator {
  type: "contract" | "nft" | "watchOnly" | "unsecured";
  label: string;
}

export interface StatusBadgeProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  backgroundColor: string;
}

export interface GenericAccountCardProps {
  account: Account;
  watchOnly?: boolean;
  height?: number;
  statusIndicators?: StatusIndicator[];
  showStatusIndicators?: boolean;
  images?: AccountImages | null;
  children?: (props: RenderPropsContext) => ReactNode;
  onPress?: () => void;
  isSelected?: boolean;
  className?: string;
}

export interface RenderPropsContext {
  showBackground: boolean;
  account: Account;
  statusIndicators: StatusIndicator[];
}

export interface AccountAvatarProps {
  accountId: string;
  avatarUrl: string | null;
  size?: number;
  onLoad?: () => void;
  onError?: () => void;
  isLoaded?: boolean;
}

export interface BackgroundLayerProps {
  backgroundUrl: string | null;
  isSelected?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  isLoaded?: boolean;
  accountId: string;
}
