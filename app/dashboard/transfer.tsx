import { ProtectedScreen } from "@/features/Dashboard/components/ProtectedScreen";
import { TransferScreen } from "@/features/Dashboard/Transfer";

export default function Screen() {
  return (
    <ProtectedScreen>
      <TransferScreen />
    </ProtectedScreen>
  );
}
