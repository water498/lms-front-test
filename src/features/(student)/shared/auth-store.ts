import { useAuthStore } from "@/lib/stores/auth-store";

interface StudentAuthStore {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

export const useStudentAuthStore = (): StudentAuthStore => {
  const { isLoggedIn, role, login, logout } = useAuthStore();
  return {
    isLoggedIn: isLoggedIn && role === "LEARNER",
    login: () => login("LEARNER", "B2C"),
    logout,
  };
};
