import { PropsWithChildren, useEffect, useRef } from "react";
import { AppState, AppStateStatus, View } from "react-native";
import { router, usePathname } from "expo-router";

type Props = {
  /** Time until auto-logout when user is inactive (in ms) */
  timeoutMs?: number;
  /** Grace period after the app goes to background (in ms) */
  backgroundGraceMs?: number;
  /** Optional callback for cleanup before logout */
  onLogout?: () => void;
};

export default function InactivityGuard({
  timeoutMs,
  backgroundGraceMs,
  onLogout,
  children,
}: PropsWithChildren<Props>) {
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bgTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastBackgroundAt = useRef<number | null>(null);
  const loggingOut = useRef(false);
  const pathname = usePathname();

  /** Clears all active timers */
  const clearTimers = () => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (bgTimer.current) clearTimeout(bgTimer.current);
    idleTimer.current = null;
    bgTimer.current = null;
  };

  /** Performs logout and navigation reset */
  const doLogout = () => {
    if (loggingOut.current) return; // prevent multiple triggers
    loggingOut.current = true;
    clearTimers();
    try {
      onLogout?.();
    } catch {}
    router.replace("/auth/login");
  };

  /** Arms (or resets) the inactivity timer */
  const armIdle = () => {
    if (!timeoutMs || timeoutMs <= 0) return;
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(doLogout, timeoutMs);
  };

  /** Called on any user touch to reset idle timer */
  const onAnyTouch = () => {
    armIdle();
  };

  useEffect(() => {
    armIdle();
  }, [pathname]);
  // Handle app foreground/background transitions and base idle timer
  useEffect(() => {
    // Arm idle timer initially (if configured)
    armIdle();

    const sub = AppState.addEventListener("change", (state: AppStateStatus) => {
      if (state === "active") {
        // App returned to foreground
        if (
          lastBackgroundAt.current != null &&
          typeof backgroundGraceMs === "number"
        ) {
          const elapsed = Date.now() - lastBackgroundAt.current;
          // If background period exceeded grace time → logout
          if (elapsed > backgroundGraceMs) {
            doLogout();
            return;
          }
        }
        lastBackgroundAt.current = null;

        if (bgTimer.current) {
          clearTimeout(bgTimer.current);
          bgTimer.current = null;
        }
        armIdle();
      } else if (state === "background" || state === "inactive") {
        // Remember the time when app went to background
        // (Android sometimes only emits "inactive")
        if (lastBackgroundAt.current == null) {
          lastBackgroundAt.current = Date.now();
        }
        if (bgTimer.current) clearTimeout(bgTimer.current);
        if (typeof backgroundGraceMs === "number") {
          bgTimer.current = setTimeout(doLogout, Math.max(0, backgroundGraceMs));
        }
      }
    });

    return () => {
      sub.remove();
      clearTimers();
    };
  }, [timeoutMs, backgroundGraceMs]);

  return (
    <View
      style={{ flex: 1 }}
      pointerEvents="box-none"
      onStartShouldSetResponderCapture={() => {
        onAnyTouch();
        return false;
      }}
    >
      {children}
    </View>
  );
}
