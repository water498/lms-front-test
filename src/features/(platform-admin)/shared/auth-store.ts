import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PlatformAdminAuthStore {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

export const usePlatformAdminAuthStore = create<PlatformAdminAuthStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      login: () => set({ isLoggedIn: true }),
      logout: () => set({ isLoggedIn: false }),
    }),
    { name: "platform-admin-auth" },
  ),
);
