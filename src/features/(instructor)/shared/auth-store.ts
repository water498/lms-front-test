import { create } from "zustand";
import { persist } from "zustand/middleware";

interface InstructorAuthStore {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

export const useInstructorAuthStore = create<InstructorAuthStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      login: () => set({ isLoggedIn: true }),
      logout: () => set({ isLoggedIn: false }),
    }),
    { name: "instructor-auth" },
  ),
);
