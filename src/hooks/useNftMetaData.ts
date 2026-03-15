import {useQuery} from "@tanstack/react-query";
import {toIpfsUrl} from "@/utils/toIpsUrl";
import type {Account, Transaction} from "@signumjs/core";
import {useMemo} from "react";
import {array, number, object, string} from "yup";

const mediaItemSchema = object().shape({
    social: string(),
    thumb: string(),
});

const nftDescriptorSchema = object().shape({
    version: number().required(),
    name: string().required(),
    title: string(),
    description: string(),
    collectionId: string(),
    media: array().of(mediaItemSchema),
    attributes: array()
});

interface Props {
    account?: Account;
    transaction?: Transaction
}

export const useNftMetaData = ({transaction, account}: Props) => {

    const descriptorCid = useMemo(() => {
        try {
            const {descriptor} = JSON.parse(transaction?.attachment?.description ?? account?.description ?? "")
            return descriptor as string ?? null;
        } catch {
            return null
        }
    }, [transaction?.attachment, account?.description]);


    const {data: nftMetaData, isLoading, error} = useQuery({
        queryKey: ["fetchNftDescriptor", descriptorCid],
        queryFn: async () => {
            const url = toIpfsUrl(descriptorCid) ?? "";
            if (!url) return;

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            try {
                const result = await fetch(url, {
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'Mozilla/5.0 (compatible; SignumWallet/1.0)',
                    },
                    signal: controller.signal
                })
                clearTimeout(timeoutId);

                if (!result.ok) {
                    throw new Error(`Failed to fetch NFT metadata: ${result.status}`);
                }

                const descriptor = await result.json()
                return nftDescriptorSchema.validate(descriptor)
            } catch (err) {
                clearTimeout(timeoutId);
                throw err;
            }
        },
        enabled: Boolean(descriptorCid),
        retry: 2,
        retryDelay: 1000
    })

    return {nftMetaData, isLoading, error}
}
