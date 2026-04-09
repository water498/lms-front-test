import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * 전역 Auth Store — 통합 인증 상태 관리.
 *
 * 프로토타입에서는 역할/테넌트 유형을 선택하여 로그인.
 * 실제 API 연동 시 JWT/세션에서 role, tenantType을 읽어 설정.
 *
 * 모든 앱(Backoffice, Learner, Platform Admin)이 이 store를 참조.
 */

export type UserRole = "SUPER_ADMIN" | "ORG_ADMIN" | "INSTRUCTOR" | "LEARNER";
export type TenantType = "B2C" | "B2B";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  isLoggedIn: boolean;
  role: UserRole | null;
  tenantType: TenantType;
  user: AuthUser | null;

  login: (role: UserRole, tenantType: TenantType) => void;
  logout: () => void;
  setTenantType: (tenantType: TenantType) => void;
}

/** role별 mock user 데이터 */
const MOCK_USERS: Record<UserRole, AuthUser> = {
  SUPER_ADMIN: { id: "u-super-1", name: "플랫폼 관리자", email: "super@openknock.io" },
  ORG_ADMIN: { id: "u-admin-1", name: "관리자", email: "admin@acme.com" },
  INSTRUCTOR: { id: "u-inst-1", name: "김강사", email: "instructor@acme.com" },
  LEARNER: { id: "u-learner-1", name: "박수강생", email: "learner@acme.com" },
};

/** role별 로그인 후 리다이렉트 경로 */
export const ROLE_REDIRECT: Record<UserRole, string> = {
  SUPER_ADMIN: "/platform-admin",
  ORG_ADMIN: "/backoffice",
  INSTRUCTOR: "/backoffice",
  LEARNER: "/student",
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      role: null,
      tenantType: "B2B",
      user: null,

      login: (role, tenantType) =>
        set({
          isLoggedIn: true,
          role,
          tenantType,
          user: MOCK_USERS[role],
        }),

      logout: () =>
        set({
          isLoggedIn: false,
          role: null,
          user: null,
        }),

      setTenantType: (tenantType) => set({ tenantType }),
    }),
    { name: "openknock-auth" }
  )
);
