// Enrollment domain models — split from lib/models.ts

export type EnrollmentStatus = "ACTIVE" | "COMPLETED" | "FAILED" | "CANCELLED" | "EXPIRED";
export type EnrollmentSource = "SELF" | "ADMIN_ASSIGNED" | "PAYMENT";

export interface Enrollment {
  id: string;
  tenantId?: string;
  learnerId: string;
  courseId: string;
  courseSessionId: string;
  status: EnrollmentStatus;
  progress: number;
  enrolledAt: string;
  lastStudiedAt?: string;
  orderId?: string; // Order.id
  expiresAt?: string;
  completedAt?: string;
  source?: EnrollmentSource;
}

export interface WaitApply {
  id: string;
  courseSessionId: string;
  userId: string;
  userName: string;
  requestedAt: string;
  status: "WAITING" | "APPROVED" | "CANCELLED";
}
