export type nodeHost = {
  name: string;
  url: string;
  isTestnet: boolean;
};

export type PublicNodeHost = {
  id: string;
  name: string;
  description: string;
  url: string;
};

export const defaultNodeHost = { name: "", url: "", isTestnet: false };
