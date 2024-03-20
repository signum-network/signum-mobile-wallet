import { useEffect } from "react";
import { onlineManager } from "@tanstack/react-query";
import { useAppStore } from "@/hooks/useAppStore";
import NetInfo from "@react-native-community/netinfo";

export const OnlineManagerInitializer = () => {
  const { isConnected, setIsConnected } = useAppStore();

  useEffect(() => {
    return onlineManager.setEventListener((setOnline) => {
      return NetInfo.addEventListener((state) => {
        setOnline(!!state.isConnected);
        setIsConnected(!!state.isConnected);
      });
    });
  }, []);

  return null;
};
