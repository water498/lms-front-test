export type { UserAccessLog } from "@/lib/models";
import type { UserAccessLog } from "@/lib/models";

export const ACCESS_LOGS: UserAccessLog[] = [
  { id: "al01", userId: "u2", userName: "홍길동", type: "LOGIN",          scope: "ADMIN", occurredAt: "2026-03-17 09:02", ip: "203.0.113.10", userAgent: "Chrome 122 / Windows 10" },
  { id: "al02", userId: "u3", userName: "이준혁", type: "LOGIN",          scope: "USER",  occurredAt: "2026-03-17 09:15", ip: "198.51.100.4",  userAgent: "Safari 17 / macOS 14" },
  { id: "al03", userId: "u5", userName: "김민준", type: "AUTO_LOGIN",     scope: "USER",  occurredAt: "2026-03-17 09:20", ip: "192.0.2.55",   userAgent: "Chrome 122 / Android 14" },
  { id: "al04", userId: "u2", userName: "홍길동", type: "LOGOUT",         scope: "ADMIN", occurredAt: "2026-03-17 11:45", ip: "203.0.113.10", userAgent: "Chrome 122 / Windows 10" },
  { id: "al05", userId: "u3", userName: "이준혁", type: "SESSION_EXPIRED",scope: "USER",  occurredAt: "2026-03-17 11:15", ip: "198.51.100.4",  userAgent: "Safari 17 / macOS 14" },
  { id: "al06", userId: "u5", userName: "김민준", type: "LOGOUT",         scope: "USER",  occurredAt: "2026-03-17 12:30", ip: "192.0.2.55",   userAgent: "Chrome 122 / Android 14" },
  { id: "al07", userId: "u2", userName: "홍길동", type: "LOGIN",          scope: "ADMIN", occurredAt: "2026-03-17 13:00", ip: "203.0.113.10", userAgent: "Chrome 122 / Windows 10" },
  { id: "al08", userId: "u6", userName: "박지은", type: "LOGIN",          scope: "USER",  occurredAt: "2026-03-17 13:10", ip: "10.0.0.22",    userAgent: "Edge 121 / Windows 11" },
  { id: "al09", userId: "u7", userName: "최수아", type: "AUTO_LOGIN",     scope: "USER",  occurredAt: "2026-03-17 13:25", ip: "172.16.0.8",   userAgent: "Firefox 123 / Ubuntu 22" },
  { id: "al10", userId: "u6", userName: "박지은", type: "SESSION_EXPIRED",scope: "USER",  occurredAt: "2026-03-17 15:10", ip: "10.0.0.22",    userAgent: "Edge 121 / Windows 11" },
  { id: "al11", userId: "u3", userName: "이준혁", type: "LOGIN",          scope: "USER",  occurredAt: "2026-03-16 08:55", ip: "198.51.100.4",  userAgent: "Safari 17 / macOS 14" },
  { id: "al12", userId: "u5", userName: "김민준", type: "LOGIN",          scope: "USER",  occurredAt: "2026-03-16 09:03", ip: "192.0.2.55",   userAgent: "Chrome 122 / Android 14" },
  { id: "al13", userId: "u2", userName: "홍길동", type: "LOGIN",          scope: "ADMIN", occurredAt: "2026-03-16 09:30", ip: "203.0.113.10", userAgent: "Chrome 122 / Windows 10" },
  { id: "al14", userId: "u7", userName: "최수아", type: "LOGIN",          scope: "USER",  occurredAt: "2026-03-16 10:00", ip: "172.16.0.8",   userAgent: "Firefox 123 / Ubuntu 22" },
  { id: "al15", userId: "u3", userName: "이준혁", type: "LOGOUT",         scope: "USER",  occurredAt: "2026-03-16 12:00", ip: "198.51.100.4",  userAgent: "Safari 17 / macOS 14" },
  { id: "al16", userId: "u5", userName: "김민준", type: "SESSION_EXPIRED",scope: "USER",  occurredAt: "2026-03-16 11:03", ip: "192.0.2.55",   userAgent: "Chrome 122 / Android 14" },
  { id: "al17", userId: "u2", userName: "홍길동", type: "LOGOUT",         scope: "ADMIN", occurredAt: "2026-03-16 18:00", ip: "203.0.113.10", userAgent: "Chrome 122 / Windows 10" },
  { id: "al18", userId: "u6", userName: "박지은", type: "LOGIN",          scope: "USER",  occurredAt: "2026-03-15 14:20", ip: "10.0.0.22",    userAgent: "Edge 121 / Windows 11" },
  { id: "al19", userId: "u7", userName: "최수아", type: "AUTO_LOGIN",     scope: "USER",  occurredAt: "2026-03-15 14:35", ip: "172.16.0.8",   userAgent: "Firefox 123 / Ubuntu 22" },
  { id: "al20", userId: "u6", userName: "박지은", type: "LOGOUT",         scope: "USER",  occurredAt: "2026-03-15 16:50", ip: "10.0.0.22",    userAgent: "Edge 121 / Windows 11" },
];
