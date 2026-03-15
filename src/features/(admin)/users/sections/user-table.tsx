"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Upload } from "lucide-react";
import { orgUsers, userStats, type OrgUser, type UserRole, type UserStatus } from "../mockData";

const ROLE_CONFIG: Record<UserRole, { label: string; className: string }> = {
  LEARNER:     { label: "수강생",     className: "bg-blue-100 text-blue-700" },
  INSTRUCTOR:  { label: "강사",       className: "bg-violet-100 text-violet-700" },
  ORG_ADMIN:   { label: "관리자",     className: "bg-amber-100 text-amber-700" },
  SUPER_ADMIN: { label: "최고관리자", className: "bg-red-100 text-red-700" },
};

const STATUS_CONFIG: Record<UserStatus, { label: string; className: string }> = {
  ACTIVE:   { label: "활성",      className: "bg-emerald-100 text-emerald-700" },
  INACTIVE: { label: "비활성",    className: "bg-slate-100 text-slate-600" },
  INVITED:  { label: "초대 대기", className: "bg-orange-100 text-orange-600" },
};

function handleExport() {
  const header = "이름,이메일,역할,상태,수강코스,마지막로그인\n";
  const rows = orgUsers
    .map((u) => `${u.name},${u.email},${ROLE_CONFIG[u.role].label},${STATUS_CONFIG[u.status].label},${u.enrolledCourses},${u.lastLogin}`)
    .join("\n");
  const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "users_export.csv";
  a.click();
  URL.revokeObjectURL(url);
}

interface Props {
  onInviteClick: () => void;
  onCreateInstructorClick: () => void;
  onImportClick: () => void;
}

export default function UserTable({ onInviteClick, onCreateInstructorClick, onImportClick }: Props) {
  const router = useRouter();
  const [roleFilter, setRoleFilter] = useState<UserRole | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "ACTIVE_ONLY">("ACTIVE_ONLY");

  const filtered = orgUsers.filter((u) => {
    const matchRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchStatus = statusFilter === "ACTIVE_ONLY" ? u.status === "ACTIVE" : true;
    return matchRole && matchStatus;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "전체 유저", value: userStats.total },
          { label: "활성",      value: userStats.active },
          { label: "초대 대기", value: userStats.invited },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 px-5 py-3 flex items-center gap-3">
            <span className="text-2xl font-bold text-slate-800">{s.value}</span>
            <span className="text-sm text-slate-500">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 gap-3 flex-wrap">
          <div className="flex gap-2">
            <select
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as UserRole | "ALL")}
            >
              <option value="ALL">전체 역할</option>
              <option value="LEARNER">수강생</option>
              <option value="INSTRUCTOR">강사</option>
              <option value="ORG_ADMIN">관리자</option>
              <option value="SUPER_ADMIN">최고관리자</option>
            </select>
            <select
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as UserStatus | "ACTIVE_ONLY")}
            >
              <option value="ACTIVE_ONLY">활성만</option>
              <option value="ALL">전체 상태</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Download size={14} /> 내보내기
            </button>
            <button
              onClick={onImportClick}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Upload size={14} /> 가져오기
            </button>
            <button
              onClick={onCreateInstructorClick}
              className="px-3 py-1.5 text-sm text-violet-700 border border-violet-200 bg-violet-50 rounded-lg hover:bg-violet-100 transition-colors"
            >
              + 강사 생성
            </button>
            <button
              onClick={onInviteClick}
              className="px-3 py-1.5 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
            >
              + 유저 초대
            </button>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 border-b border-slate-100">
              <th className="text-left px-5 py-3 font-medium">이름 / 이메일</th>
              <th className="text-left px-4 py-3 font-medium">역할</th>
              <th className="text-left px-4 py-3 font-medium">상태</th>
              <th className="text-left px-4 py-3 font-medium">수강 코스</th>
              <th className="text-left px-4 py-3 font-medium">마지막 로그인</th>
              <th className="text-left px-4 py-3 font-medium">액션</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                onClick={() => router.push(`/experiments/admin/users/${user.id}`)}
              />
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-10 text-slate-400 text-sm">
                  해당하는 유저가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UserRow({ user, onClick }: { user: OrgUser; onClick: () => void }) {
  const role = ROLE_CONFIG[user.role];
  const status = STATUS_CONFIG[user.status];
  return (
    <tr
      className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <td className="px-5 py-3">
        <p className="font-medium text-slate-800">{user.name}</p>
        <p className="text-xs text-slate-400">{user.email}</p>
      </td>
      <td className="px-4 py-3">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${role.className}`}>
          {role.label}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.className}`}>
          {status.label}
        </span>
      </td>
      <td className="px-4 py-3 text-slate-600">{user.enrolledCourses}</td>
      <td className="px-4 py-3 text-slate-400">{user.lastLogin}</td>
      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
        <div className="flex gap-1">
          {user.role !== "SUPER_ADMIN" && (
            <button className="text-xs px-2 py-1 text-violet-600 hover:bg-violet-50 rounded transition-colors">
              역할 변경
            </button>
          )}
          {user.status === "ACTIVE" && user.role !== "SUPER_ADMIN" && (
            <button className="text-xs px-2 py-1 text-slate-500 hover:bg-slate-100 rounded transition-colors">
              비활성화
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
