// Domain: offline — 오프라인 수업, 출결 관리
import type { CourseInstructor } from './course'

export type OfflineSessionStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";

// OfflineSessionInstructor — 차시-강사 N:M pivot (backend: offline_session_instructor)
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
  dayNum: number;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  instructors: CourseInstructor[];
  maxCapacity: number;
  status: OfflineSessionStatus;
}

export type AttendanceStatus = "PRESENT" | "LATE" | "ABSENT" | "EXCUSED";
export type AttendanceMethod = "QR" | "MANUAL";

export interface OfflineAttendance {
  id: string;
  offlineSessionId: string;
  learnerId: string;
  learnerName: string;
  status: AttendanceStatus;
  method: AttendanceMethod;
  checkedAt?: string;
}

export interface OfflineAttendanceLog {
  id: string;
  offlineSessionId: string;
  userId: string;
  beforeStatus: AttendanceStatus;
  afterStatus: AttendanceStatus;
  modifiedBy: string;
  modifiedAt: string;
  note?: string;
}
