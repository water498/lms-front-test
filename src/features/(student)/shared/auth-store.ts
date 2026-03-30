import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StudentAuthStore {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

export const useStudentAuthStore = create<StudentAuthStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      login: () => set({ isLoggedIn: true }),
      logout: () => set({ isLoggedIn: false }),
    }),
    { name: "student-auth" },
  ),
);
