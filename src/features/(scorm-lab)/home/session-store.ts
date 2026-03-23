/**
 * session-store.ts
 * localStorage에 SCORM 세션 데이터(suspend_data 등)를 저장/복원.
 * 키: scorm::{manifestId}::{learnerId}
 */

import type { ScormVersion } from "./manifest-parser";

export interface ScormSession {
  version: ScormVersion;
  data: Record<string, string>;
  lastSaved: string; // ISO string
  learnerId: string;
  learnerName: string;
}

function key(manifestId: string, learnerId: string): string {
  return `scorm::${manifestId}::${learnerId}`;
}

export function saveSession(
  manifestId: string,
  learnerId: string,
  learnerName: string,
  version: ScormVersion,
  data: Record<string, string>
): void {
  const session: ScormSession = {
    version,
    data,
    lastSaved: new Date().toISOString(),
    learnerId,
    learnerName,
  };
  try {
    localStorage.setItem(key(manifestId, learnerId), JSON.stringify(session));
  } catch {
    // localStorage quota exceeded — silently ignore in test tool
  }
}

export function loadSession(
  manifestId: string,
  learnerId: string
): ScormSession | null {
  try {
    const raw = localStorage.getItem(key(manifestId, learnerId));
    if (!raw) return null;
    return JSON.parse(raw) as ScormSession;
  } catch {
    return null;
  }
}

export function clearSession(manifestId: string, learnerId: string): void {
  localStorage.removeItem(key(manifestId, learnerId));
}

export function formatSavedTime(iso: string): string {
  return new Date(iso).toLocaleString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
