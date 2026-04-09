import { create } from 'zustand';

interface ImpersonationStore {
  impersonatingUserId: string | null;
  start: (userId: string) => void;
  stop: () => void;
}

export const useImpersonationStore = create<ImpersonationStore>((set) => ({
  impersonatingUserId: null,
  start: (userId) => set({ impersonatingUserId: userId }),
  stop: () => set({ impersonatingUserId: null }),
}));
