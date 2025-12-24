import { ProtectedScreen } from "@/features/Dashboard/components/ProtectedScreen";
import { SignScreen } from "@/features/Dashboard/Deeplinking/Sign";

export default function Screen() {
  return (
    <ProtectedScreen>
      <SignScreen />
    </ProtectedScreen>
  );
}
