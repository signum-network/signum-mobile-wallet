import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Recipient = {
  publicKey: string;
  label?: string;
  addedAt: number;
};

interface State {
  recipients: Record<string, Recipient>;
  add: (publicKey: string, label?: string) => void;
  remove: (publicKey: string) => void;
  clear: () => void;
  getAll: () => Recipient[];
  purgeExpired: () => void;
}

export const EXPIRY_DAYS = 90;
const EXPIRY_MS = EXPIRY_DAYS * 24 * 60 * 60 * 1000;
const now = () => Date.now();

export const recipientsStore = create<State>()(
  persist(
    (set, get) => ({
      recipients: {},

      add: (publicKey, label) => {
        const pk = publicKey.toLowerCase();
        const current = get().recipients;
        const existing = current[pk];
        const updated: Recipient = {
          publicKey: pk,
          label: label ?? existing?.label,
          addedAt: now(),
        };
        set({ recipients: { ...current, [pk]: updated } });
      },

      remove: (publicKey) => {
        const pk = publicKey.toLowerCase();
        const next = { ...get().recipients };
        delete next[pk];
        set({ recipients: next });
      },

      clear: () => set({ recipients: {} }),

      getAll: () => {
        const cutoff = now() - EXPIRY_MS;
        return Object.values(get().recipients)
          .filter((r) => r.addedAt >= cutoff)
          .sort((a, b) => b.addedAt - a.addedAt);
      },

      purgeExpired: () => {
        const cutoff = now() - EXPIRY_MS;
        const next: Record<string, Recipient> = {};
        for (const [pk, r] of Object.entries(get().recipients)) {
          if (r.addedAt >= cutoff) next[pk] = r;
        }
        set({ recipients: next });
      },
    }),
    {
      name: "recipients-store",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);
