import { useAuthStore } from "@/lib/stores/auth-store";

interface InstructorAuthStore {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

export const useInstructorAuthStore = (): InstructorAuthStore => {
  const { isLoggedIn, role, login, logout } = useAuthStore();
  return {
    isLoggedIn: isLoggedIn && role === "INSTRUCTOR",
    login: () => login("INSTRUCTOR", "B2B"),
    logout,
  };
};
