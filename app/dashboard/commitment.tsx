import { ProtectedScreen } from "@/features/Dashboard/components/ProtectedScreen";
import { CommitmentScreen } from "@/features/Dashboard/Commitment";

export default function Screen() {
  return (
    <ProtectedScreen>
      <CommitmentScreen />
    </ProtectedScreen>
  );
}
