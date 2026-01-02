import { ProtectedScreen } from "@/features/Dashboard/components/ProtectedScreen";
import { ProfileEditScreen } from "@/features/Dashboard/ProfileEdit";
import {useLocalSearchParams} from "expo-router";

export default function Screen() {
    const { accountId } = useLocalSearchParams<{ accountId: string }>();

  return (
    <ProtectedScreen>
      <ProfileEditScreen accountId={accountId}/>
    </ProtectedScreen>
  );
}
