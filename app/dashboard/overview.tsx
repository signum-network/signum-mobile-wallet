import { Text } from "@/components/Text";
import { useAccountStore } from "@/hooks/useAccountStore";
import { ProtectedScreen } from "@/features/Dashboard/components/ProtectedScreen";

export default function Screen() {
  const { activeAccount, isAccountEnrolled } = useAccountStore();

  return (
    <ProtectedScreen>
      <Text>
        Overview Screen {activeAccount} {String(isAccountEnrolled)}
      </Text>
    </ProtectedScreen>
  );
}
