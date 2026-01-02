import { create } from "zustand";

export type PendingDeepLink = {
  pathname: string;
  params?: Record<string, string>;
};

interface State {
  pendingDeepLink: PendingDeepLink | null;
  setPendingDeepLink: (deepLink: PendingDeepLink | null) => void;
  clearPendingDeepLink: () => void;
}

export const pendingDeepLinkStore = create<State>((set) => ({
  pendingDeepLink: null,

  setPendingDeepLink: (deepLink) => {
    set({ pendingDeepLink: deepLink });
  },

  clearPendingDeepLink: () => {
    set({ pendingDeepLink: null });
  },
}));
