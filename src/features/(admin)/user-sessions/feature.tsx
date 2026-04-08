"use client";

import { useState } from "react";
import { Monitor, Smartphone, Tablet, ShieldOff, ChevronDown, ChevronUp } from "lucide-react";
import { userSessions } from "../user-layout/mockData";
import type { UserSession } from "../user-layout/mockData";

const REVOKE_REASON_LABEL: Record<NonNullable<UserSession["revokedReason"]>, string> = {
  LOGOUT:       "로그아웃",
  NEW_LOGIN:    "재로그인",
  ADMIN_REVOKE: "관리자 종료",
  EXPIRED:      "만료",
};
const REVOKE_REASON_COLOR: Record<NonNullable<UserSession["revokedReason"]>, string> = {
  LOGOUT:       "bg-slate-100 text-slate-500",
  NEW_LOGIN:    "bg-blue-100 text-blue-600",
  ADMIN_REVOKE: "bg-red-100 text-red-600",
  EXPIRED:      "bg-amber-100 text-amber-600",
};

function deviceIcon(deviceName?: string) {
  if (!deviceName) return <Monitor size={18} />;
  const d = deviceName.toLowerCase();
  if (d.includes("iphone") || d.includes("android")) return <Smartphone size={18} />;
  if (d.includes("ipad") || d.includes("tablet")) return <Tablet size={18} />;
  return <Monitor size={18} />;
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("ko-KR", { dateStyle: "short", timeStyle: "short" });
}

interface Props {
  userId: string;
}

export default function SessionsTab({ userId }: Props) {
  const sessions = userSessions[userId] ?? [];
  const active  = sessions.filter((s) => !s.revokedAt);
  const revoked = sessions.filter((s) => s.revokedAt);

  const [localSessions, setLocalSessions] = useState(sessions);
  const [showRevoked, setShowRevoked] = useState(false);

  const activeSessions  = localSessions.filter((s) => !s.revokedAt);
  const revokedSessions = localSessions.filter((s) => s.revokedAt);

  function handleRevoke(sessionId: string) {
    setLocalSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? { ...s, revokedAt: new Date().toISOString(), revokedReason: "ADMIN_REVOKE" as const }
          : s
      )
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400 text-sm gap-2">
        <Monitor size={32} className="text-slate-200" />
        <p>접속 기기 이력이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Active sessions */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700">활성 세션</p>
          <span className="text-xs text-slate-400">{activeSessions.length}개</span>
        </div>
        {activeSessions.length === 0 ? (
          <p className="px-5 py-8 text-sm text-slate-400 text-center">활성 세션이 없습니다.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {activeSessions.map((s) => (
              <div key={s.id} className="px-5 py-4 flex items-start gap-4">
                <div className="text-slate-400 mt-0.5">{deviceIcon(s.deviceName)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">{s.deviceName ?? "알 수 없는 기기"}</p>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{s.userAgent}</p>
                  <div className="flex gap-4 mt-2 text-xs text-slate-500">
                    <span>IP: <span className="font-mono">{s.ip}</span></span>
                    <span>마지막 활동: {formatDate(s.lastUsedAt)}</span>
                    <span>만료: {formatDate(s.expiresAt)}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleRevoke(s.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0"
                >
                  <ShieldOff size={12} />
                  강제 종료
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Revoked sessions */}
      {revokedSessions.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <button
            onClick={() => setShowRevoked((v) => !v)}
            className="w-full px-5 py-3 flex items-center justify-between text-left border-b border-slate-100"
          >
            <p className="text-sm font-semibold text-slate-500">종료된 세션 ({revokedSessions.length})</p>
            {showRevoked ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />}
          </button>
          {showRevoked && (
            <div className="divide-y divide-slate-100">
              {revokedSessions.map((s) => (
                <div key={s.id} className="px-5 py-3 flex items-start gap-4 opacity-60">
                  <div className="text-slate-400 mt-0.5">{deviceIcon(s.deviceName)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-slate-600">{s.deviceName ?? "알 수 없는 기기"}</p>
                      {s.revokedReason && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${REVOKE_REASON_COLOR[s.revokedReason]}`}>
                          {REVOKE_REASON_LABEL[s.revokedReason]}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-4 mt-1 text-xs text-slate-400">
                      <span>IP: <span className="font-mono">{s.ip}</span></span>
                      <span>종료: {formatDate(s.revokedAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
