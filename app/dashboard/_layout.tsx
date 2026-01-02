import {AuthGuard} from "@/features/Auth/components/AuthGuard";
import {AppNavigation} from "@/components/AppNavigation";

export default function Layout() {
    return (
      <AuthGuard>
        <AppNavigation />
      </AuthGuard>
  );
}
