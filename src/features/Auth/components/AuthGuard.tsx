import type {ReactNode} from "react";
import {useAppStore} from "@/hooks/useAppStore";
import {LoginAuthScreen} from "@/features/Auth/Login";
import {PUBLIC_INACTIVITY_AUTO_LOCK} from "@/types/constants";
import InactivityGuard from "@/features/Auth/components/InactivityGuard";

interface Props {
    children: ReactNode;
}

export const AuthGuard = ({children}: Props) => {
    const {isUnlocked, setIsUnlocked, isAuthEnrolled} = useAppStore();

    console.log("isUnlocked: ", isUnlocked);
    console.log("isAuthEnrolled: ", isAuthEnrolled);

    // If locked, show login screen instead of children
    if (!isUnlocked) {
        return <LoginAuthScreen/>;
    }

    // If unlocked, render children with touch listener for inactivity reset
    return (
        <InactivityGuard
            timeoutMs={PUBLIC_INACTIVITY_AUTO_LOCK}
            backgroundGraceMs={PUBLIC_INACTIVITY_AUTO_LOCK}
            onLogout={() => setIsUnlocked(false)}
        >
            {children}
        </InactivityGuard>
    );
};
