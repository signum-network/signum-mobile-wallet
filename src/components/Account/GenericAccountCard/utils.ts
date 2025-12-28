import { src44 } from "@signumjs/standards";
import { toIpfsUrl } from "@/utils/toIpsUrl";
import type { AccountImages } from "./types";

/**
 * Parses account description to extract avatar and background images
 */
export const parseAccountImages = (description?: string): AccountImages | null => {
  if (!description) return null;

  try {
    const descriptor = src44.DescriptorData.parse(description, false);
    return {
      avatarUrl: toIpfsUrl(descriptor?.avatar?.ipfsCid) ?? null,
      backgroundUrl: toIpfsUrl(descriptor?.background?.ipfsCid) ?? null,
    };
  } catch {
    return null;
  }
};
