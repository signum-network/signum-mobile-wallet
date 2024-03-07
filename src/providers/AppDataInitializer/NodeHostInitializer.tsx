import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { PUBLIC_SIGNUM_PUBLIC_RESOURCES_URL } from "@/types/constants";
import { nodeHostStore } from "@/states/nodeHostStore";
import type { nodeHost, PublicNodeHost } from "@/types/nodeHost";
import { LedgerClientFactory } from "@signumjs/core";

// TODO: Add Support for inactive node which user has active
// TODO: Detect if user is on a unsynced node

export const NodeHostInitializer = () => {
  const activeNodeHost = nodeHostStore((state) => state.activeNodeHost);
  const setActiveNodeHost = nodeHostStore((state) => state.setActiveNodeHost);
  const reliableNodeHost = nodeHostStore((state) => state.reliableNodeHost);
  const setReliableNodeHost = nodeHostStore(
    (state) => state.setReliableNodeHost
  );

  useQuery({
    queryKey: ["fetchReliableNodeHosts"],
    queryFn: () =>
      fetch(`${PUBLIC_SIGNUM_PUBLIC_RESOURCES_URL}/nodesa.json`).then(
        async (res) => {
          const response: any = await res.json();
          const reliableNodes: nodeHost[] = [];

          console.log(response);

          const mainnetNodes = response.mainnet;
          const testnetNodes = response.testnet;

          mainnetNodes.forEach((node: PublicNodeHost) => {
            reliableNodes.push({
              name: node.name,
              url: node.url,
              isTestnet: false,
            });
          });

          testnetNodes.forEach((node: PublicNodeHost) => {
            reliableNodes.push({
              name: node.name,
              url: node.url,
              isTestnet: true,
            });
          });

          setReliableNodeHost(reliableNodes);

          return reliableNodes;
        }
      ),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!reliableNodeHost.length || activeNodeHost.name) return;

    (async () => {
      const reliableNodeHostsUrls = reliableNodeHost.map((node) => node.url);

      const probeClient = LedgerClientFactory.createClient({
        nodeHost: reliableNodeHost[0].url,
        reliableNodeHosts: reliableNodeHostsUrls,
      });

      await probeClient.service.selectBestHost().then((host) => {
        const index = reliableNodeHostsUrls.indexOf(host);
        setActiveNodeHost(reliableNodeHost[index]);
      });
    })();
  }, [reliableNodeHost, activeNodeHost]);

  return null;
};
