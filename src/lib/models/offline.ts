// Domain: offline — 오프라인 수업, 출결 관리
import type { CourseInstructor } from './course'

export type OfflineSessionStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";

// OfflineSessionInstructor — 차시-강사 N:M pivot (composite PK)
export interface OfflineSessionInstructor {
  offlineSessionId: string;
  instructorId: string;  // FK → User
  role: "PRIMARY" | "ASSISTANT";
  order: number;
  addedAt: string;
}

export interface OfflineSession {
  id: string;
  courseSessionId: string;
  title: string;
  dayNum: number;          // 차시 일차 번호
  startsAt: string;        // DATETIME
  endsAt: string;          // DATETIME
  location?: string;
  locationAddress?: string; // 도로명 주소
  locationLat?: string;
  locationLng?: string;
  maxAttendees?: number;   // null = 무제한
  status: OfflineSessionStatus;
  instructors: CourseInstructor[]; // [UI convenience] OfflineSessionInstructor JOIN 결과
}

export type AttendanceStatus = "PRESENT" | "LATE" | "ABSENT" | "EXCUSED";
export type CheckInMethod = "QR" | "MANUAL";

// OfflineAttendance — composite PK (offlineSessionId, userId)
export interface OfflineAttendance {
  offlineSessionId: string;
  userId: string;          // FK → User
  status: AttendanceStatus;
  checkInMethod: CheckInMethod;
  checkedAt?: string;      // null = 미체크
  note?: string;
  learnerName?: string;    // [UI-only] backend에 없음
}

export interface OfflineAttendanceLog {
  id: string;
  offlineSessionId: string;
  userId?: string;         // FK → User. SET NULL
  beforeStatus: AttendanceStatus;
  afterStatus: AttendanceStatus;
  modifiedBy?: string;     // FK → User. SET NULL
  modifiedAt: string;
  note?: string;
}
