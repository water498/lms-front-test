"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";

type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

interface InstructorApplication {
  id: string;
  name: string;
  email: string;
  specialty: string;
  plan: string;
  appliedAt: string;
  status: ApplicationStatus;
}

const INITIAL_APPLICATIONS: InstructorApplication[] = [
  {
    id: "app-1",
    name: "강현우",
    email: "kang@example.com",
    specialty: "데이터 분석",
    plan: "Python, Pandas, 머신러닝 기초 과정을 시리즈로 제작 예정입니다.",
    appliedAt: "2026-03-20",
    status: "PENDING",
  },
  {
    id: "app-2",
    name: "임지수",
    email: "lim@example.com",
    specialty: "UI/UX 디자인",
    plan: "Figma 실무, 사용자 리서치 방법론 강의를 제작하려 합니다.",
    appliedAt: "2026-03-18",
    status: "PENDING",
  },
  {
    id: "app-3",
    name: "조민호",
    email: "jo@example.com",
    specialty: "비즈니스 영어",
    plan: "비즈니스 영어 회화, IELTS 준비 과정",
    appliedAt: "2026-03-15",
    status: "APPROVED",
  },
  {
    id: "app-4",
    name: "윤서희",
    email: "yoon@example.com",
    specialty: "영상 편집",
    plan: "Premiere Pro 기초~고급 실무 과정",
    appliedAt: "2026-03-10",
    status: "REJECTED",
  },
];

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; className: string }> = {
  PENDING:  { label: "검토 중", className: "bg-amber-100 text-amber-700" },
  APPROVED: { label: "승인됨", className: "bg-green-100 text-green-700" },
  REJECTED: { label: "반려됨", className: "bg-red-100 text-red-700" },
};

export default function InstructorApplicationsFeature() {
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  const [expanded, setExpanded] = useState<string | null>(null);

  const pending = applications.filter((a) => a.status === "PENDING").length;

  function handleApprove(id: string) {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "APPROVED" as const } : a))
    );
  }

  function handleReject(id: string) {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "REJECTED" as const } : a))
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">강사 심사</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            강사 활동을 신청한 회원 목록입니다. 승인 시 해당 회원에게 강사 역할이 부여됩니다.
          </p>
        </div>
        {pending > 0 && (
          <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
            검토 대기 {pending}건
          </span>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-4 py-3 font-medium text-slate-500">신청자</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">전문 분야</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">신청일</th>
              <th className="text-center px-4 py-3 font-medium text-slate-500">상태</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => {
              const badge = STATUS_CONFIG[app.status];
              const isOpen = expanded === app.id;
              return (
                <>
                  <tr
                    key={app.id}
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer"
                    onClick={() => setExpanded(isOpen ? null : app.id)}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">{app.name}</p>
                      <p className="text-xs text-slate-400">{app.email}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{app.specialty}</td>
                    <td className="px-4 py-3 text-slate-500">{app.appliedAt}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badge.className}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {app.status === "PENDING" && (
                        <div className="flex gap-1.5 justify-end" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleApprove(app.id)}
                            className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                          >
                            <Check size={13} />
                            승인
                          </button>
                          <button
                            onClick={() => handleReject(app.id)}
                            className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          >
                            <X size={13} />
                            반려
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                  {isOpen && (
                    <tr key={`${app.id}-detail`} className="bg-slate-50 border-b border-slate-100">
                      <td colSpan={5} className="px-4 py-3">
                        <p className="text-xs font-medium text-slate-500 mb-1">강의 계획</p>
                        <p className="text-sm text-slate-700">{app.plan}</p>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
