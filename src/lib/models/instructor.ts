// Domain: instructor — 강사 프로필, 평가, 정산

export interface InstructorProfile {
  // ── DB 기준 필드 (backend: instructor_profile) ──
  userId: string; // PK + FK → User (1:1). INSTRUCTOR role 사용자만 해당
  headline?: string; // 한 줄 소개. 예: "AI/ML 전문 강사 · 전 네이버 AI Lab"
  bio?: string;
  career?: string;
  specialty?: string; // 전문 분야. 예: '데이터 분석, Python'
  expertise?: string[];
  affiliatedCompany?: string;
  websiteUrl?: string;
  isPublic?: boolean; // false이면 수강생에게 숨김
  isExternal?: boolean; // 외부 강사 여부. false=내부 강사, true=외부 초빙 강사. default false
  updatedAt?: string;
  // ── UI 전용 (실험 단계, API 연동 시 별도 DTO로 분리) ──
  id?: string;
  profileImageUrl?: string;
}

// InstructorReview — 강사 평가 (backend: instructor_review). B2C 수강생 작성.
export interface InstructorReview {
  id: string;
  instructorId: string; // FK → User (role=INSTRUCTOR)
  courseId?: string;    // 리뷰 작성 시 수강한 과정 (맥락 참고용)
  learnerId: string;    // FK → User
  learnerName: string;  // 작성자 이름 스냅샷
  rating: number;       // 1~5
  body: string;
  createdAt: string;
  visible: boolean;
}

export interface InstructorBankAccount {
  id: string;
  instructorId: string; // FK → User (role=INSTRUCTOR)
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  isPrimary: boolean;
  createdAt: string;
}

// InstructorRevenue — 강사 정산 내역 (backend: instructor_revenue)
export type InstructorRevenueType = "COURSE_SALE" | "FLAT_FEE" | "BONUS" | "ADJUSTMENT";
export type InstructorRevenueStatus = "PENDING" | "APPROVED" | "PAID";

export interface InstructorRevenue {
  id: string;
  tenantId: string;
  instructorId: string; // FK → User (role=INSTRUCTOR)
  courseId?: string; // FK → Course. null이면 과정 무관 정산
  orderItemId?: string; // [B2C] FK → OrderItem. B2B는 null
  revenueType: InstructorRevenueType;
  grossAmount: number; // 매출 총액 (KRW)
  commissionRate?: number; // 플랫폼 수수료율 (%). null이면 수수료 없음
  netAmount: number; // 실 정산액
  status: InstructorRevenueStatus;
  periodStart?: string;
  periodEnd?: string;
  paidAt?: string;
  note?: string;
  createdAt: string;
}
