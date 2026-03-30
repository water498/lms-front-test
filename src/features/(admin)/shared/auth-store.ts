import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminAuthStore {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

export const useAdminAuthStore = create<AdminAuthStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      login: () => set({ isLoggedIn: true }),
      logout: () => set({ isLoggedIn: false }),
    }),
    { name: "admin-auth" },
  ),
);
