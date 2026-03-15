"use client";

import type { OrgUser } from "../../mockData";

const ROLE_CONFIG = {
  LEARNER:     { label: "수강생",     className: "bg-blue-100 text-blue-700" },
  INSTRUCTOR:  { label: "강사",       className: "bg-violet-100 text-violet-700" },
  ORG_ADMIN:   { label: "관리자",     className: "bg-amber-100 text-amber-700" },
  SUPER_ADMIN: { label: "최고관리자", className: "bg-red-100 text-red-700" },
} as const;

const STATUS_CONFIG = {
  ACTIVE:   { label: "활성",      className: "bg-emerald-100 text-emerald-700" },
  INACTIVE: { label: "비활성",    className: "bg-slate-100 text-slate-600" },
  INVITED:  { label: "초대 대기", className: "bg-orange-100 text-orange-600" },
} as const;

export default function ProfileTab({ user }: { user: OrgUser }) {
  const role = ROLE_CONFIG[user.role];
  const status = STATUS_CONFIG[user.status];

  return (
    <div className="grid grid-cols-2 gap-5">
      <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-2xl flex-shrink-0">
          {user.name[0]}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-semibold text-slate-800">{user.name}</h2>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${role.className}`}>{role.label}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.className}`}>{status.label}</span>
          </div>
          <p className="text-sm text-slate-500">{user.email}</p>
          {user.department && <p className="text-xs text-slate-400 mt-0.5">{user.department}</p>}
        </div>
        {user.role !== "SUPER_ADMIN" && (
          <button className="px-4 py-2 text-sm text-violet-600 border border-violet-200 rounded-lg hover:bg-violet-50 transition-colors">
            역할 변경
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-slate-700">계정 정보</h3>
        <dl className="flex flex-col gap-3">
          {[
            { label: "이메일",       value: user.email },
            { label: "역할",         value: role.label },
            { label: "가입일",       value: user.joinedAt },
            { label: "마지막 로그인", value: user.lastLogin },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-sm">
              <dt className="text-slate-400">{label}</dt>
              <dd className="text-slate-700 font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-slate-700">학습 현황</h3>
        <dl className="flex flex-col gap-3">
          {[
            { label: "수강 과정",  value: `${user.enrolledCourses}개` },
            { label: "완료 과정",  value: "1개" },
            { label: "수료증",     value: "1장" },
            { label: "부서",       value: user.department ?? "—" },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-sm">
              <dt className="text-slate-400">{label}</dt>
              <dd className="text-slate-700 font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {user.status === "ACTIVE" && user.role !== "SUPER_ADMIN" && (
        <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">계정 관리</h3>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              비밀번호 초기화
            </button>
            <button className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
              계정 비활성화
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
