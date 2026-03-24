"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import type { User } from "../../mockData";
import type { UserRole } from "@/lib/models";
import { useOrgStructureStore, findDeptNode } from "../../../shared/org-structure-store";
import { useImpersonationStore } from "../../../shared/impersonation-store";

const ROLE_CONFIG = {
  LEARNER:     { label: "수강생",     className: "bg-blue-100 text-blue-700" },
  INSTRUCTOR:  { label: "강사",       className: "bg-violet-100 text-violet-700" },
  ORG_ADMIN:   { label: "관리자",     className: "bg-amber-100 text-amber-700" },
  SUPER_ADMIN: { label: "최고관리자", className: "bg-red-100 text-red-700" },
} as const;

const STATUS_CONFIG = {
  ACTIVE:   { label: "활성",   className: "bg-emerald-100 text-emerald-700" },
  INACTIVE: { label: "비활성", className: "bg-slate-100 text-slate-600" },
} as const;

const CHANGEABLE_ROLES: { value: UserRole; label: string }[] = [
  { value: "LEARNER",    label: "수강생" },
  { value: "INSTRUCTOR", label: "강사" },
  { value: "ORG_ADMIN",  label: "관리자" },
];

export default function ProfileTab({ user, onUserChange }: { user: User; onUserChange?: (u: User) => void }) {
  const { departments, jobGrades, sites } = useOrgStructureStore();
  const { start } = useImpersonationStore();
  const router = useRouter();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(user.roles[0]);

  function handleRoleConfirm() {
    onUserChange?.({ ...user, roles: [selectedRole] });
    setShowRoleModal(false);
  }

  function handleImpersonate() {
    start(user.id);
    const dest =
      user.authProvider === "SSO"
        ? "/experiments/b2b-student"
        : "/experiments/b2c-student";
    router.push(dest);
  }

  const role = ROLE_CONFIG[user.roles[0]];
  const status = STATUS_CONFIG[user.status];

  const deptName = user.departmentId
    ? (findDeptNode(departments, user.departmentId)?.name ?? "—")
    : "—";
  const gradeName = user.jobGradeId
    ? (jobGrades.find((g) => g.id === user.jobGradeId)?.name ?? "—")
    : "—";
  const siteName = user.siteId
    ? (sites.find((s) => s.id === user.siteId)?.name ?? "—")
    : "—";

  return (
    <>
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
          {user.departmentId && (
            <p className="text-xs text-slate-400 mt-0.5">{deptName}</p>
          )}
        </div>
        <div className="flex gap-2 flex-shrink-0">
          {user.roles.includes("LEARNER") && (
            <button
              onClick={handleImpersonate}
              className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              이 유저로 보기
            </button>
          )}
          {!user.roles.includes("SUPER_ADMIN") && (
            <button
              onClick={() => { setSelectedRole(user.roles[0]); setShowRoleModal(true); }}
              className="px-4 py-2 text-sm text-violet-600 border border-violet-200 rounded-lg hover:bg-violet-50 transition-colors"
            >
              역할 변경
            </button>
          )}
        </div>
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
            { label: "수강 과정", value: `${user.enrolledCourses}개` },
            { label: "완료 과정", value: "1개" },
            { label: "수료증",    value: "1장" },
            { label: "사업장",    value: siteName },
            { label: "부서",      value: deptName },
            { label: "직급",      value: gradeName },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-sm">
              <dt className="text-slate-400">{label}</dt>
              <dd className="text-slate-700 font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {user.status === "ACTIVE" && !user.roles.includes("SUPER_ADMIN") && (
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

      {user.roles.includes("INSTRUCTOR") && (
        <InstructorProfileSection />
      )}
    </div>

    {showRoleModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-800">역할 변경</h2>
            <button onClick={() => setShowRoleModal(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition-colors">
              <X size={18} />
            </button>
          </div>
          <p className="text-sm text-slate-500">
            <span className="font-medium text-slate-700">{user.name}</span> 님의 역할을 변경합니다.
          </p>
          <div className="flex flex-col gap-2">
            {CHANGEABLE_ROLES.map((r) => (
              <label key={r.value} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                selectedRole === r.value
                  ? "border-violet-400 bg-violet-50"
                  : "border-slate-200 hover:bg-slate-50"
              }`}>
                <input
                  type="radio"
                  name="role"
                  value={r.value}
                  checked={selectedRole === r.value}
                  onChange={() => setSelectedRole(r.value)}
                  className="accent-violet-600"
                />
                <span className="text-sm font-medium text-slate-700">{r.label}</span>
              </label>
            ))}
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowRoleModal(false)}
              className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleRoleConfirm}
              className="px-4 py-2 text-sm font-medium bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition-colors"
            >
              변경 적용
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}

// Mock instructor profile — replaced with real data when API is connected
const MOCK_INSTRUCTOR_PROFILE = {
  headline: "풀스택 개발자 · 5년 경력",
  specialty: "React, Node.js, TypeScript",
  bio: "실무 중심의 강의를 통해 수강생들이 현업에서 바로 사용할 수 있는 기술을 가르칩니다.",
  career: "2019–현재 스타트업 CTO\n2016–2019 네이버 소프트웨어 엔지니어",
  websiteUrl: "https://example.com",
  isPublic: true,
};

function InstructorProfileSection() {
  const [isPublic, setIsPublic] = useState(MOCK_INSTRUCTOR_PROFILE.isPublic);
  const p = MOCK_INSTRUCTOR_PROFILE;

  return (
    <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">강사 프로필</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">{isPublic ? "공개" : "비공개"}</span>
          <button
            onClick={() => setIsPublic((v) => !v)}
            className={`relative w-9 h-5 rounded-full transition-colors ${
              isPublic ? "bg-violet-600" : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                isPublic ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
      <dl className="flex flex-col gap-3">
        {[
          { label: "한 줄 소개", value: p.headline },
          { label: "전문 분야",  value: p.specialty },
          { label: "웹사이트",   value: p.websiteUrl },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between text-sm">
            <dt className="text-slate-400">{label}</dt>
            <dd className="text-slate-700 font-medium">{value ?? "—"}</dd>
          </div>
        ))}
        {p.bio && (
          <div className="flex flex-col gap-1 text-sm">
            <dt className="text-slate-400">소개</dt>
            <dd className="text-slate-700 leading-relaxed">{p.bio}</dd>
          </div>
        )}
        {p.career && (
          <div className="flex flex-col gap-1 text-sm">
            <dt className="text-slate-400">경력</dt>
            <dd className="text-slate-700 whitespace-pre-line leading-relaxed">{p.career}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
