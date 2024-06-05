import { useAppTheme } from "@/hooks/useAppTheme";
import Feather from "@expo/vector-icons/Feather";

export const SettingsLabel = () => {
  const { iconColor } = useAppTheme();

  return (
    <Feather
      name="menu"
      size={24}
      color={iconColor.default}
      className="opacity-50"
    />
  );
};
