import { useEffect } from "react";
import { onlineManager } from "@tanstack/react-query";
import { useAppStore } from "@/hooks/useAppStore";
import NetInfo from "@react-native-community/netinfo";

export const OnlineManagerInitializer = () => {
  const { setIsOnline } = useAppStore();

  useEffect(() => {
    return onlineManager.setEventListener((setOnline) => {
      return NetInfo.addEventListener((state) => {
        // setOnline - from tanstack query
        setOnline(!!state.isConnected);

        // setIsOnline - from our zustand storage for detecting network availability
        setIsOnline(!!state.isConnected);
      });
    });
  }, []);

  return null;
};
