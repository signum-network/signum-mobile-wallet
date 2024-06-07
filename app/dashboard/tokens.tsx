import { ProtectedScreen } from "@/features/Dashboard/components/ProtectedScreen";
import { TokensScreen } from "@/features/Dashboard/Tokens";

export default function Screen() {
  return (
    <ProtectedScreen>
      <TokensScreen />
    </ProtectedScreen>
  );
}
