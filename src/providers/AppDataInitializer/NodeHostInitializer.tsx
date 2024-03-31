import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { PUBLIC_SIGNUM_PUBLIC_RESOURCES_URL } from "@/types/constants";
import { useNodeHostStore } from "@/hooks/useNodeHostStore";
import type { nodeHost, PublicNodeHost } from "@/types/nodeHost";
import { LedgerClientFactory } from "@signumjs/core";

export const NodeHostInitializer = () => {
  const {
    connectionType,
    activeNodeHost,
    reliableNodeHost,
    setActiveNodeHost,
    setReliableNodeHost,
    setTestnetReliableNodeHost,
  } = useNodeHostStore();

  useQuery({
    queryKey: ["fetchReliableNodeHosts"],
    queryFn: () =>
      fetch(`${PUBLIC_SIGNUM_PUBLIC_RESOURCES_URL}/nodes.json`).then(
        async (res) => {
          const response: any = await res.json();

          const reliableNodes: nodeHost[] = [];
          const testnetReliableNodes: nodeHost[] = [];

          const mainnetNodes = response.mainnet;
          const testnetNodes = response.testnet;

          mainnetNodes.forEach(({ name, url }: PublicNodeHost) => {
            if (url.includes("localhost")) return;

            reliableNodes.push({
              name,
              url,
              isTestnet: false,
            });
          });

          testnetNodes.forEach(({ name, url }: PublicNodeHost) => {
            if (url.includes("localhost")) return;

            testnetReliableNodes.push({
              name,
              url,
              isTestnet: true,
            });
          });

          // Sorting the array alphabetically by the "name" property
          const sorter = (a: nodeHost, b: nodeHost) => {
            // Convert names to lowercase for case-insensitive sorting
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();

            // Compare names
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0; // Names are equal
          };

          reliableNodes.sort(sorter);
          testnetReliableNodes.sort(sorter);

          setReliableNodeHost(reliableNodes);
          setTestnetReliableNodeHost(testnetReliableNodes);

          return testnetNodes;
        }
      ),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (
      !reliableNodeHost.length ||
      activeNodeHost.name ||
      connectionType === "manual"
    ) {
      return;
    }

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
  }, [reliableNodeHost, activeNodeHost, connectionType]);

  return null;
};
