import type {ReactNode} from "react";
import {useAppStore} from "@/hooks/useAppStore";
import {LoginAuthScreen} from "@/features/Auth/Login";
import {PUBLIC_INACTIVITY_AUTO_LOCK} from "@/types/constants";
import InactivityGuard from "@/features/Auth/components/InactivityGuard";

interface Props {
    children: ReactNode;
}

export const AuthGuard = ({children}: Props) => {
    const {isUnlocked, setIsUnlocked} = useAppStore();

    if (!isUnlocked) {
        return <LoginAuthScreen/>;
    }

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
