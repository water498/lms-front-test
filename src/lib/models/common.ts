// Domain: common — 테넌트 컨텍스트, 공통 설정

export type TenantType = "B2C" | "B2B";

export interface TenantContext {
  tenantId: string;
  tenantType: TenantType;         // 메타 정보용 (직접 분기에 쓰지 않음)
  tenantName: string;
  features: {
    payments: boolean;            // [B2C only] 결제
    cart: boolean;                // [B2C only] 장바구니
    orgStructure: boolean;        // [B2B only] 조직 구조
    sso: boolean;                 // [B2B only] SSO 설정
    mandatoryCourses: boolean;    // [B2B only] 필수 수강
  };
  /** 현재 로그인한 학습자의 조직 속성 — B2B only. B2C에서는 undefined */
  currentLearner?: {
    orgTeamId?: string;
    orgPositionId?: string;
    orgSiteId?: string;
  };
}

export interface PlatformSetting {
  id: string;
  key: string;           // e.g. "maintenance_mode", "default_lang"
  value: string;         // JSON-serialized
  description?: string;
  updatedAt: string;
  updatedBy: string;     // admin userId
}
