"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Upload, Search } from "lucide-react";
import { useUsersStore } from "../../shared/users-store";
import { userStats, type User, type UserRole, type UserStatus } from "../mockData";
import { useOrgStructureStore, findDeptNode, flatDeptIds, type DeptNode } from "../../shared/org-structure-store";
import { userGroups } from "../groups/mockData";

const ROLE_CONFIG: Record<UserRole, { label: string; className: string }> = {
  LEARNER:     { label: "수강생",     className: "bg-blue-100 text-blue-700" },
  INSTRUCTOR:  { label: "강사",       className: "bg-violet-100 text-violet-700" },
  ORG_ADMIN:   { label: "관리자",     className: "bg-amber-100 text-amber-700" },
  SUPER_ADMIN: { label: "최고관리자", className: "bg-red-100 text-red-700" },
};

const STATUS_CONFIG: Record<UserStatus, { label: string; className: string }> = {
  ACTIVE:   { label: "활성",   className: "bg-emerald-100 text-emerald-700" },
  INACTIVE: { label: "비활성", className: "bg-slate-100 text-slate-600" },
  BLOCKED:  { label: "차단",   className: "bg-red-100 text-red-700" },
};

function handleExport(users: User[]) {
  const header = "이름,이메일,역할,상태,수강과정,마지막로그인\n";
  const rows = users
    .map((u) => `${u.name},${u.email},${ROLE_CONFIG[u.roles[0]].label},${STATUS_CONFIG[u.status].label},${u.enrolledCourses},${u.lastLogin}`)
    .join("\n");
  const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "users_export.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function flattenDepts(nodes: DeptNode[]): DeptNode[] {
  return nodes.flatMap((n) => [n, ...flattenDepts(n.children)]);
}

type RoleTab = "ALL" | "LEARNER" | "INSTRUCTOR" | "ADMIN";

const ROLE_TABS: { value: RoleTab; label: string }[] = [
  { value: "ALL",        label: "전체" },
  { value: "LEARNER",    label: "학습자" },
  { value: "INSTRUCTOR", label: "강사" },
  { value: "ADMIN",      label: "관리자" },
];

interface Props {
  onCreateClick: () => void;
  onImportClick: () => void;
}

export default function UserTable({ onCreateClick, onImportClick }: Props) {
  const router = useRouter();
  const { users } = useUsersStore();
  const { departments, jobGrades } = useOrgStructureStore();
  const [roleTab, setRoleTab] = useState<RoleTab>("ALL");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "ACTIVE_ONLY">("ACTIVE_ONLY");
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [groupFilter, setGroupFilter] = useState("");

  const flatDepts = flattenDepts(departments);

  const filtered = users.filter((u) => {
    if (u.roles.includes("SUPER_ADMIN")) return false;
    const matchRole =
      roleTab === "ALL" ? true :
      roleTab === "ADMIN" ? u.roles.includes("ORG_ADMIN") :
      u.roles.includes(roleTab as import("@/lib/models").UserRole);
    const matchStatus = statusFilter === "ACTIVE_ONLY" ? u.status === "ACTIVE" : true;
    const q = search.toLowerCase();
    const matchSearch = q === "" || (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.employeeId?.toLowerCase().includes(q) ?? false)
    );
    const matchDept = deptFilter === "" || u.orgTeamId === deptFilter;
    const matchGrade = gradeFilter === "" || u.orgPositionId === gradeFilter;
    const matchGroup = groupFilter === "" || (
      userGroups.find((g) => g.id === groupFilter)?.memberIds?.includes(u.id) ?? false
    );
    return matchRole && matchStatus && matchSearch && matchDept && matchGrade && matchGroup;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "전체 유저", value: userStats.total },
          { label: "활성",      value: userStats.active },
          { label: "비활성",    value: userStats.inactive },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 px-5 py-3 flex items-center gap-3">
            <span className="text-2xl font-bold text-slate-800">{s.value}</span>
            <span className="text-sm text-slate-500">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-1 border-b border-slate-200">
        {ROLE_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setRoleTab(tab.value)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              roleTab === tab.value
                ? "border-violet-600 text-violet-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 gap-3 flex-wrap">
          <div className="flex gap-2 flex-wrap items-center">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="이름·이메일·사번 검색"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white w-52"
              />
            </div>
            <select
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              <option value="">전체 부서</option>
              {flatDepts.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <select
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
            >
              <option value="">전체 직급</option>
              {jobGrades.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
            <select
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
            >
              <option value="">전체 그룹</option>
              {userGroups.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
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
              onClick={() => handleExport(filtered)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Download size={14} /> 내보내기
            </button>
            <button
              onClick={onImportClick}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Upload size={14} /> 일괄 등록
            </button>
            <button
              onClick={onCreateClick}
              className="px-3 py-1.5 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
            >
              + 유저 등록
            </button>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 border-b border-slate-100">
              <th className="text-left px-5 py-3 font-medium">이름 / 이메일</th>
              <th className="text-left px-4 py-3 font-medium">역할</th>
              <th className="text-left px-4 py-3 font-medium">상태</th>
              <th className="text-left px-4 py-3 font-medium">부서 / 직급</th>
              <th className="text-left px-4 py-3 font-medium">그룹</th>
              <th className="text-left px-4 py-3 font-medium">수강 과정</th>
              <th className="text-left px-4 py-3 font-medium">마지막 로그인</th>
              <th className="text-left px-4 py-3 font-medium">액션</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => {
              const deptName = user.orgTeamId
                ? (findDeptNode(departments, user.orgTeamId)?.name ?? undefined)
                : undefined;
              const gradeName = user.orgPositionId
                ? (jobGrades.find((g) => g.id === user.orgPositionId)?.name ?? undefined)
                : undefined;
              return (
                <UserRow
                  key={user.id}
                  user={user}
                  deptName={deptName}
                  gradeName={gradeName}
                  onClick={() => router.push(`/experiments/admin/users/${user.id}`)}
                />
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-10 text-slate-400 text-sm">
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

interface UserRowProps {
  user: User;
  deptName?: string;
  gradeName?: string;
  onClick: () => void;
}

function UserRow({ user, deptName, gradeName, onClick }: UserRowProps) {
  const role = ROLE_CONFIG[user.roles[0]];
  const status = STATUS_CONFIG[user.status];
  const groups = userGroups.filter((g) => g.memberIds?.includes(user.id));

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
      <td className="px-4 py-3">
        {deptName || gradeName ? (
          <div>
            {deptName && <p className="text-slate-700 text-xs">{deptName}</p>}
            {gradeName && <p className="text-slate-400 text-xs">{gradeName}</p>}
          </div>
        ) : (
          <span className="text-slate-300">—</span>
        )}
      </td>
      <td className="px-4 py-3">
        {groups.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {groups.map((g) => (
              <span
                key={g.id}
                className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium whitespace-nowrap"
              >
                {g.name}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-slate-300">—</span>
        )}
      </td>
      <td className="px-4 py-3 text-slate-600">{user.enrolledCourses}</td>
      <td className="px-4 py-3 text-slate-400">{user.lastLogin}</td>
      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
        <div className="flex gap-1">
          {!user.roles.includes("SUPER_ADMIN") && (
            <button className="text-xs px-2 py-1 text-violet-600 hover:bg-violet-50 rounded transition-colors">
              역할 변경
            </button>
          )}
          {user.status === "ACTIVE" && !user.roles.includes("SUPER_ADMIN") && (
            <button className="text-xs px-2 py-1 text-slate-500 hover:bg-slate-100 rounded transition-colors">
              비활성화
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
