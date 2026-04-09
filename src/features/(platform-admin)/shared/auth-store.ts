import { useAuthStore } from "@/lib/stores/auth-store";

interface PlatformAdminAuthStore {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

export const usePlatformAdminAuthStore = (): PlatformAdminAuthStore => {
  const { isLoggedIn, role, login, logout } = useAuthStore();
  return {
    isLoggedIn: isLoggedIn && role === "SUPER_ADMIN",
    login: () => login("SUPER_ADMIN", "B2B"),
    logout,
  };
};
