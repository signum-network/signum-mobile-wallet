import { ProtectedScreen } from "@/features/Dashboard/components/ProtectedScreen";
import { ConnectDAppScreen } from "@/features/Dashboard/Deeplinking/ConnectDApp";

export default function Screen() {
  return (
    <ProtectedScreen>
      <ConnectDAppScreen />
    </ProtectedScreen>
  );
}
