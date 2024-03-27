import { Text } from "@/components/Text";
import { useAccountStore } from "@/hooks/useAccountStore";

export default function Screen() {
  const { activeAccount, isAccountEnrolled } = useAccountStore();

  return (
    <Text>
      Overview Screen {activeAccount} {String(isAccountEnrolled)}
    </Text>
  );
}
