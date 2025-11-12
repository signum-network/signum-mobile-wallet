import { useNodeHostStore } from "./useNodeHostStore";

export const useTicker = () => {
  const { isTestnet } = useNodeHostStore();

  const NativeTicker = isTestnet ? "TSIGNA" : "SIGNA";

  return { NativeTicker };
};
