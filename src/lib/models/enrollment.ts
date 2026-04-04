// Enrollment domain models — split from lib/models.ts

export type EnrollmentStatus = "ACTIVE" | "COMPLETED" | "FAILED" | "CANCELLED" | "EXPIRED";
export type EnrollmentSource = "SELF" | "ADMIN_ASSIGNED" | "PAYMENT";

export interface Enrollment {
  id: string;
  tenantId?: string;
  learnerId: string;       // backend: user_id. UI에서 learner 시맨틱 유지
  courseId: string;
  courseSessionId: string;
  status: EnrollmentStatus;
  source?: EnrollmentSource;
  progress: number;        // 0-100%, cache
  enrolledAt: string;
  lastStudiedAt?: string;
  completedAt?: string;
  expiresAt?: string;
  cancelledAt?: string;
  orderId?: string; // FK → Order. B2C only
}

export interface WaitApply {
  id: string;
  courseSessionId: string;
  userId: string;
  userName: string; // 스냅샷
  requestedAt: string;
  status: "WAITING" | "APPROVED" | "CANCELLED";
}
