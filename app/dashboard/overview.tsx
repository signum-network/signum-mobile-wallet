import { ProtectedScreen } from "@/features/Dashboard/components/ProtectedScreen";
import { OverviewScreen } from "@/features/Dashboard/Overview";

export default function Screen() {
  return (
    <ProtectedScreen>
      <OverviewScreen />
    </ProtectedScreen>
  );
}
