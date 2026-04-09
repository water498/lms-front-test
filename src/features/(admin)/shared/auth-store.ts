import { useAuthStore } from "@/lib/stores/auth-store";

/**
 * Admin auth store — 전역 auth store 위임.
 * 기존 인터페이스 유지하여 호환성 보장.
 */
interface AdminAuthStore {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

export const useAdminAuthStore = (): AdminAuthStore => {
  const { isLoggedIn, role, login, logout } = useAuthStore();
  return {
    isLoggedIn: isLoggedIn && (role === "ORG_ADMIN" || role === "SUPER_ADMIN"),
    login: () => login("ORG_ADMIN", "B2B"),
    logout,
  };
};
