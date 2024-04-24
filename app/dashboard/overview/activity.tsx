import { ProtectedScreen } from "@/features/Dashboard/components/ProtectedScreen";
import { Text } from "@/components/Text";

export default function Screen() {
  return (
    <ProtectedScreen>
      <Text>Account Activity Screen</Text>
    </ProtectedScreen>
  );
}
