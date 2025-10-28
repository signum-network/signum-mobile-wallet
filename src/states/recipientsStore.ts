import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

export type Recipient = {
  address: string;       // e.g. "S-5MS6..." or numeric "167552..."
  label?: string;        // optional display name
  addedAt: number;       // first time added
  lastUsedAt: number;    // last time used (resets 90-day timer)
};

type RecipientMap = { [address: string]: Recipient };

interface State {
  recipients: RecipientMap;
}

interface Actions {
  reset: () => void;
  /**
   * Add a recipient or refresh its "lastUsedAt" timestamp
   * when another transaction is sent to it.
   */
  addOrTouchRecipient: (params: { address: string; label?: string }) => void;
  /** Delete a recipient by address */
  deleteRecipient: (address: string) => void;
  /** Manually remove recipients older than 90 days */
  purgeExpired: () => void;
  /** Return the most recently used recipients */
  getRecent: (limit?: number) => Recipient[];
}

const initialState: State = {
  recipients: {},
};

/**
 * Removes recipients older than 90 days
 */
function purge(map: RecipientMap): RecipientMap {
  const now = Date.now();
  const fresh: RecipientMap = {};
  for (const [addr, rec] of Object.entries(map)) {
    const age = now - (rec.lastUsedAt ?? rec.addedAt);
    if (age <= EXPIRY_MS) {
      fresh[addr] = rec;
    }
  }
  return fresh;
}

export const recipientsStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...initialState,
      reset: () => set(initialState),

      /**
       * Adds a new recipient or refreshes (extends) its lifetime
       * by updating the `lastUsedAt` timestamp whenever a new
       * transaction is made to this address.
       */
      addOrTouchRecipient: ({ address, label }) =>
        set(() => {
          const current = purge(get().recipients);
          const now = Date.now();

          const existing = current[address];

          const next: Recipient = existing
            ? {
                ...existing,
                // If a label is provided, update it. Otherwise, keep the old one.
                label: label ?? existing.label,
                // This line resets the "expiry timer" to 0
                // (extends validity by another 90 days)
                lastUsedAt: now,
              }
            : {
                address,
                label,
                addedAt: now,
                lastUsedAt: now,
              };

          return {
            recipients: { ...current, [address]: next },
          };
        }),

      deleteRecipient: (address) =>
        set(() => {
          const current = get().recipients;
          const next = { ...current };
          delete next[address];
          return { recipients: next };
        }),

      purgeExpired: () =>
        set(() => ({
          recipients: purge(get().recipients),
        })),

      getRecent: (limit) => {
        const items = Object.values(get().recipients).sort(
          (a, b) => b.lastUsedAt - a.lastUsedAt
        );
        return typeof limit === "number" ? items.slice(0, limit) : items;
      },
    }),
    {
      name: "recipients-storage",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      // Automatically clean up old recipients after hydration
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        setTimeout(() => {
          state.purgeExpired();
        }, 0);
      },
    }
  )
);
