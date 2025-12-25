import {PUBLIC_IPFS_GATEWAY} from "@/types/constants";

export function toIpfsUrl(cid?: string | null) {
    if (!cid) return null;
    const base = String(PUBLIC_IPFS_GATEWAY).replace(/\/+$/, ""); // trim trailing /
    return `${base}/${cid}`;
}
