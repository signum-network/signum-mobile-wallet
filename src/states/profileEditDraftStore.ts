import { create } from "zustand";
import { registerStore } from "@/states/storeRegistry";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ProfileEdit } from "@/features/Dashboard/ProfileEdit/utils/types";

// Store draft per account and network
type DraftKey = `${string}-${string}`; // publicKey-network

interface State {
  drafts: Record<DraftKey, ProfileEdit>;
}

interface Actions {
  getDraft: (publicKey: string, network: string) => ProfileEdit | null;
  saveDraft: (publicKey: string, network: string, draft: ProfileEdit) => void;
  clearDraft: (publicKey: string, network: string) => void;
  reset: () => void;
}

const initialState: State = {
  drafts: {},
};

export const profileEditDraftStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...initialState,
      getDraft: (publicKey, network) => {
        const key: DraftKey = `${publicKey}-${network}`;
        return get().drafts[key] || null;
      },
      saveDraft: (publicKey, network, draft) => {
        const key: DraftKey = `${publicKey}-${network}`;
        set((state) => ({
          drafts: {
            ...state.drafts,
            [key]: draft,
          },
        }));
      },
      clearDraft: (publicKey, network) => {
        const key: DraftKey = `${publicKey}-${network}`;
        set((state) => {
          const newDrafts = { ...state.drafts };
          delete newDrafts[key];
          return { drafts: newDrafts };
        });
      },
      reset: () => set(initialState),
    }),
    {
      name: "profile-edit-draft-storage",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);
registerStore(profileEditDraftStore);
