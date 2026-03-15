import {useEffect} from "react";
import {useQuery} from "@tanstack/react-query";
import {useNodeHostStore} from "@/hooks/useNodeHostStore";
import {useLedgerService} from "@/hooks/useLedgerService";
import {useAppStore} from "@/hooks/useAppStore";
import type {NodeHost, PublicNodeHost} from "@/types/nodeHost";
import {ChainService} from "@signumjs/core";

import {
    PUBLIC_SIGNUM_PUBLIC_RESOURCES_URL,
    PUBLIC_SIGNUM_AVERAGE_BLOCK_TIME_IN_MILLISECONDS,
} from "@/types/constants";

export const NodeHostInitializer = () => {
    const {isOnline} = useAppStore();
    const {ledgerService} = useLedgerService();
    const {
        connectionType,
        activeNodeHost,
        reliableNodeHost,
        setActiveNodeHost,
        setReliableNodeHost,
        setTestnetReliableNodeHost,
        setIsActiveNodeAvailable,
        setIsActiveNodeSynced,
        setActiveNodeSyncedPercentage,
        setActiveNodeNumberOfBlocks,
        resetActiveNodeHost,
    } = useNodeHostStore();

    const {data} = useQuery({
        queryKey: ["fetchReliableNodeHosts"],
        queryFn: async () => {
            const reliableNodesMap = new Map<string, NodeHost>();
            const testnetReliableNodesMap = new Map<string, NodeHost>();
            const res = await fetch(`${PUBLIC_SIGNUM_PUBLIC_RESOURCES_URL}/nodes.json`)
            const response: any = await res.json();
            const mainnetNodes = response.mainnet;
            const testnetNodes = response.testnet;

            mainnetNodes.forEach(({name, url}: PublicNodeHost) => {
                if (url.includes("localhost")) return;
                if (reliableNodesMap.has(url)) return;
                reliableNodesMap.set(url, {
                    name,
                    url,
                    isTestnet: false,
                });
            });

            testnetNodes.forEach(({name, url}: PublicNodeHost) => {
                if (url.includes("localhost")) return;
                if (testnetReliableNodesMap.has(url)) return;
                testnetReliableNodesMap.set(url, {
                    name,
                    url,
                    isTestnet: true,
                });
            });

            const sortByName = (a: NodeHost, b: NodeHost) => {
                const nameA = a.name.toLowerCase();
                const nameB = b.name.toLowerCase();
                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
                return 0;
            };

            const mainnet = Array.from(reliableNodesMap.values()).sort(sortByName);
            const testnet = Array.from(testnetReliableNodesMap.values()).sort(sortByName);

            return {
                mainnet,
                testnet,
            }
        },
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchInterval: false,
        staleTime: Infinity,
    });

    useEffect(() => {
        if(data){
            console.log('[NodeHostInitializer] Reliable node hosts loaded:', data);
            setReliableNodeHost(data.mainnet);
            setTestnetReliableNodeHost(data.testnet);
        }
    }, [data]);

    useEffect(() => {
        if (
            !reliableNodeHost.length ||
            activeNodeHost.name ||
            connectionType === "manual"
        ) {
            return;
        }

        async function determineBestNodeHost(nodeHosts: NodeHost[]) {
            async function probe(url: string) {
                await new ChainService({nodeHost: url}).query("getBlock")
                return url
            }

            const urls = nodeHosts.map(node => node.url)
            const fastestResponderUrl = await Promise.race(urls.map(probe))
            const selectedHost = nodeHosts.find(node => node.url === fastestResponderUrl)
            if (selectedHost) {
                setActiveNodeHost(selectedHost)
            }
        }

        determineBestNodeHost(reliableNodeHost);

    }, [reliableNodeHost, activeNodeHost, connectionType]);

    // TODO: Once SignumJS has improved the selectBestHost method, clean the active node host if active node is syncing
    const {data: blockchainStatus, error: blockchainStatusError} = useQuery({
        queryKey: ["fetchBlockchainStatus", activeNodeHost.url],
        queryFn: async () => {
            const status = await ledgerService!.node.fetchBlockchainStatus();
            const {numberOfBlocks, lastBlockchainFeederHeight} = status;
            const percentageRaw = (numberOfBlocks / lastBlockchainFeederHeight) * 100;
            return {
                numberOfBlocks,
                isSynced: lastBlockchainFeederHeight - numberOfBlocks <= 1,
                syncedPercentage: Number(percentageRaw.toFixed(2)),
            };
        },
        refetchInterval: PUBLIC_SIGNUM_AVERAGE_BLOCK_TIME_IN_MILLISECONDS,
        enabled: !!activeNodeHost.url && !!ledgerService,
    });

    useEffect(() => {
        if (blockchainStatus) {
            setActiveNodeSyncedPercentage(blockchainStatus.syncedPercentage);
            setActiveNodeNumberOfBlocks(blockchainStatus.numberOfBlocks);
            setIsActiveNodeSynced(blockchainStatus.isSynced);
            setIsActiveNodeAvailable(true);
        }
    }, [blockchainStatus]);

    useEffect(() => {
        if (blockchainStatusError) {
            setIsActiveNodeAvailable(false);
            if (isOnline && connectionType === "automatic") resetActiveNodeHost();
        }
    }, [blockchainStatusError]);

    return null;
};
