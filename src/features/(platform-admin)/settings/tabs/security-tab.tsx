"use client";

import { useState } from "react";
import { INITIAL_SETTINGS } from "../mockData";

export default function SecurityTab() {
  const init = INITIAL_SETTINGS.security;
  const [sessionTimeout, setSessionTimeout] = useState(init.sessionTimeoutMin);
  const [require2FA, setRequire2FA] = useState(init.require2FAForPlatformAdmin);
  const [auditRetention, setAuditRetention] = useState(init.auditLogRetentionDays);
  const [graceDays, setGraceDays] = useState(init.dataDeletionGraceDays);

  const handleSave = () => {
    alert(
      `보안 설정 저장\n세션 타임아웃: ${sessionTimeout}분\n플랫폼 관리자 2FA: ${require2FA ? "필수" : "선택"}\n감사 로그 보존: ${auditRetention}일\n데이터 삭제 유예: ${graceDays}일`,
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-x-8 gap-y-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-600">
            세션 타임아웃 (분)
          </label>
          <input
            type="number"
            min={5}
            max={480}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-32"
            value={sessionTimeout}
            onChange={(e) => setSessionTimeout(Number(e.target.value))}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-600">
            감사 로그 보존 기간 (일)
          </label>
          <input
            type="number"
            min={30}
            max={2555}
            step={30}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-32"
            value={auditRetention}
            onChange={(e) => setAuditRetention(Number(e.target.value))}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-600">
            데이터 삭제 유예 기간 (일)
          </label>
          <input
            type="number"
            min={0}
            max={90}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-32"
            value={graceDays}
            onChange={(e) => setGraceDays(Number(e.target.value))}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-600">
            IP 화이트리스트
          </label>
          <input
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="10.0.0.0/8, 192.168.1.0/24"
            disabled
          />
          <p className="text-xs text-slate-400">추후 지원 예정</p>
        </div>
      </div>

      <div className="flex items-center justify-between py-3 border-t border-slate-100">
        <div>
          <p className="text-sm font-medium text-slate-700">
            플랫폼 관리자 2FA 필수
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            플랫폼 운영팀 계정의 2단계 인증을 의무화
          </p>
        </div>
        <button
          onClick={() => setRequire2FA((v) => !v)}
          className={`relative w-10 h-5.5 rounded-full transition-colors ${
            require2FA ? "bg-blue-600" : "bg-slate-200"
          }`}
          style={{ height: "22px", width: "40px" }}
        >
          <span
            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
              require2FA ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
        >
          저장
        </button>
      </div>
    </div>
  );
}
