import { useAuthStore } from "@/lib/stores/auth-store";

interface AuthStore {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

export const useAdminAuthStore = (): AuthStore => {
  const { isLoggedIn, role, login, logout } = useAuthStore();
  return {
    isLoggedIn: isLoggedIn && (role === "ORG_ADMIN" || role === "SUPER_ADMIN"),
    login: () => login("ORG_ADMIN", "B2B"),
    logout,
  };
};

export const useInstructorAuthStore = (): AuthStore => {
  const { isLoggedIn, role, login, logout } = useAuthStore();
  return {
    isLoggedIn: isLoggedIn && role === "INSTRUCTOR",
    login: () => login("INSTRUCTOR", "B2B"),
    logout,
  };
};
