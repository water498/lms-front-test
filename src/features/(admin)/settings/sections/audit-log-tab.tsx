"use client";

import { useState } from "react";
import { Download, Search, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import type { OrgAuditAction, OrgAuditLog } from "@/lib/models";

const ACTION_LABEL: Record<OrgAuditAction, string> = {
  ENROLLMENT_CANCEL:   "수강 취소",
  ENROLLMENT_CREATE:   "수강 등록",
  COURSE_CREATE:       "과정 생성",
  COURSE_UPDATE:       "과정 수정",
  USER_ROLE_CHANGE:    "역할 변경",
  ORG_STRUCTURE_UPDATE:"조직 구조 변경",
  SETTINGS_UPDATE:     "설정 변경",
  CERT_ISSUE:          "수료증 발급",
};

const ACTION_COLOR: Record<OrgAuditAction, string> = {
  ENROLLMENT_CANCEL:    "bg-red-100 text-red-600",
  ENROLLMENT_CREATE:    "bg-blue-100 text-blue-600",
  COURSE_CREATE:        "bg-violet-100 text-violet-600",
  COURSE_UPDATE:        "bg-amber-100 text-amber-600",
  USER_ROLE_CHANGE:     "bg-orange-100 text-orange-600",
  ORG_STRUCTURE_UPDATE: "bg-teal-100 text-teal-600",
  SETTINGS_UPDATE:      "bg-slate-100 text-slate-600",
  CERT_ISSUE:           "bg-green-100 text-green-600",
};

const auditLogs: OrgAuditLog[] = [
  { id: "al1",  tenantId: "t1", timestamp: "2025-03-17 14:32:11", actorId: "u2", actor: "홍길동 (관리자)",   action: "ENROLLMENT_CANCEL",    target: "정하은 / React 기초",             detail: "ACTIVE → CANCELLED. 사유: 수강생 본인 요청 (부서 이동으로 인한 취소)" },
  { id: "al2",  tenantId: "t1", timestamp: "2025-03-17 11:05:44", actorId: "u2", actor: "홍길동 (관리자)",   action: "ENROLLMENT_CREATE",    target: "홍민재 / React 기초",             detail: "수동 수강 등록. 3기 (2025 3분기) 차수에 배정" },
  { id: "al3",  tenantId: "t1", timestamp: "2025-03-16 17:22:03", actorId: "u2", actor: "홍길동 (관리자)",   action: "CERT_ISSUE",           target: "박지호 / Next.js 마스터",         detail: "수료증 수동 발급. 증서번호: CERT-2025-0342" },
  { id: "al4",  tenantId: "t1", timestamp: "2025-03-16 15:48:30", actorId: "u2", actor: "홍길동 (관리자)",   action: "COURSE_UPDATE",        target: "React 기초",                      detail: "수료 기준 80% → 70%. 사유: 1기 수료율 저조로 인한 기준 완화" },
  { id: "al5",  tenantId: "t1", timestamp: "2025-03-15 10:13:55", actorId: "u2", actor: "홍길동 (관리자)",   action: "USER_ROLE_CHANGE",     target: "이준혁",                          detail: "LEARNER → INSTRUCTOR. 사유: 사내강사 선발 (2025년 상반기)" },
  { id: "al6",  tenantId: "t1", timestamp: "2025-03-14 09:50:22", actorId: "u2", actor: "홍길동 (관리자)",   action: "ORG_STRUCTURE_UPDATE", target: "개발본부 / 백엔드팀",             detail: "부서 추가. 상위: 개발본부. 사이트: 본사" },
  { id: "al7",  tenantId: "t1", timestamp: "2025-03-13 16:05:10", actorId: "u2", actor: "홍길동 (관리자)",   action: "COURSE_CREATE",        target: "Docker & Kubernetes",             detail: "신규 과정 생성 (DRAFT). 카테고리: 개발·인프라. 학습유형: BLENDED" },
  { id: "al8",  tenantId: "t1", timestamp: "2025-03-12 14:30:00", actorId: "u2", actor: "홍길동 (관리자)",   action: "SETTINGS_UPDATE",      target: "브랜딩 설정",                     detail: "로고 이미지 업데이트. 파일: logo_v3_2025.png" },
  { id: "al9",  tenantId: "t1", timestamp: "2025-03-11 11:22:18", actorId: "u2", actor: "홍길동 (관리자)",   action: "ENROLLMENT_CREATE",    target: "신입 온보딩 그룹 (3명) / React 기초", detail: "그룹 일괄 배정. 대상: 김민준, 이서연, 박지호" },
  { id: "al10", tenantId: "t1", timestamp: "2025-03-10 09:11:05", actorId: "u2", actor: "홍길동 (관리자)",   action: "ORG_STRUCTURE_UPDATE", target: "직급",                            detail: "부장 직급 추가. roleType: LEADER, order: 5" },
  { id: "al11", tenantId: "t1", timestamp: "2025-03-09 16:45:30", actorId: "u3", actor: "박영수 (관리자)",   action: "COURSE_UPDATE",        target: "안전교육 기본과정",               detail: "과정 상태 DRAFT → PUBLISHED. 공개 대상: 전체" },
  { id: "al12", tenantId: "t1", timestamp: "2025-03-09 14:20:15", actorId: "u3", actor: "박영수 (관리자)",   action: "ENROLLMENT_CREATE",    target: "현장관리팀 (12명) / 안전교육 기본과정", detail: "부서 일괄 배정. 차수: 1기" },
  { id: "al13", tenantId: "t1", timestamp: "2025-03-08 11:30:00", actorId: "u2", actor: "홍길동 (관리자)",   action: "CERT_ISSUE",           target: "최유진 / React 기초",             detail: "수료증 수동 발급. 증서번호: CERT-2025-0298" },
  { id: "al14", tenantId: "t1", timestamp: "2025-03-07 17:15:42", actorId: "u2", actor: "홍길동 (관리자)",   action: "SETTINGS_UPDATE",      target: "알림 설정",                       detail: "수강 등록 알림 활성화. 채널: 이메일 + 알림톡" },
  { id: "al15", tenantId: "t1", timestamp: "2025-03-07 10:05:33", actorId: "u3", actor: "박영수 (관리자)",   action: "USER_ROLE_CHANGE",     target: "김현수",                          detail: "INSTRUCTOR → LEARNER. 사유: 강사 계약 만료" },
  { id: "al16", tenantId: "t1", timestamp: "2025-03-06 15:40:20", actorId: "u2", actor: "홍길동 (관리자)",   action: "COURSE_CREATE",        target: "리더십 과정 2025",                detail: "신규 과정 생성 (DRAFT). 카테고리: 리더십. 학습유형: ONLINE" },
  { id: "al17", tenantId: "t1", timestamp: "2025-03-05 13:22:10", actorId: "u2", actor: "홍길동 (관리자)",   action: "ENROLLMENT_CANCEL",    target: "윤서준 / Docker & Kubernetes",    detail: "ACTIVE → CANCELLED. 사유: 중복 등록 정리" },
  { id: "al18", tenantId: "t1", timestamp: "2025-03-04 09:55:00", actorId: "u3", actor: "박영수 (관리자)",   action: "ORG_STRUCTURE_UPDATE", target: "개발본부 / 프론트엔드팀",         detail: "부서명 변경: UI팀 → 프론트엔드팀" },
  { id: "al19", tenantId: "t1", timestamp: "2025-03-03 16:30:45", actorId: "u2", actor: "홍길동 (관리자)",   action: "COURSE_UPDATE",        target: "Next.js 마스터",                  detail: "커리큘럼 업데이트. 주제 3개 추가, 활동 5개 추가" },
  { id: "al20", tenantId: "t1", timestamp: "2025-03-02 11:10:28", actorId: "u2", actor: "홍길동 (관리자)",   action: "ENROLLMENT_CREATE",    target: "장도윤 / 리더십 과정 2025",       detail: "수동 수강 등록. 자유수강 차수에 배정" },
  { id: "al21", tenantId: "t1", timestamp: "2025-03-01 14:45:00", actorId: "u3", actor: "박영수 (관리자)",   action: "SETTINGS_UPDATE",      target: "SSO 설정",                        detail: "Azure AD SAML 연동 설정 완료. IdP: login.microsoftonline.com" },
  { id: "al22", tenantId: "t1", timestamp: "2025-02-28 10:20:15", actorId: "u2", actor: "홍길동 (관리자)",   action: "CERT_ISSUE",           target: "한예린 / 안전교육 기본과정",      detail: "수료증 일괄 발급 (5건). 증서번호: CERT-2025-0250~0254" },
  { id: "al23", tenantId: "t1", timestamp: "2025-02-27 16:55:30", actorId: "u2", actor: "홍길동 (관리자)",   action: "USER_ROLE_CHANGE",     target: "송현우",                          detail: "LEARNER → ORG_ADMIN. 사유: 부관리자 추가 지정" },
  { id: "al24", tenantId: "t1", timestamp: "2025-02-26 09:30:00", actorId: "u3", actor: "박영수 (관리자)",   action: "COURSE_UPDATE",        target: "안전교육 기본과정",               detail: "오프라인 출석 기준 변경: 70% → 80%" },
  { id: "al25", tenantId: "t1", timestamp: "2025-02-25 13:40:22", actorId: "u2", actor: "홍길동 (관리자)",   action: "ORG_STRUCTURE_UPDATE", target: "사이트",                          detail: "사이트 추가: 판교 R&D센터" },
];

const ALL_ACTIONS = Object.keys(ACTION_LABEL) as OrgAuditAction[];
const PAGE_SIZE = 20;

export default function AuditLogTab() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<"all" | OrgAuditAction>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = auditLogs.filter((log) => {
    const matchSearch =
      !search ||
      log.actor.includes(search) ||
      log.target.includes(search) ||
      log.detail.includes(search);
    const matchAction = actionFilter === "all" || log.action === actionFilter;
    const logDate = log.timestamp.split(" ")[0];
    const matchDateFrom = !dateFrom || logDate >= dateFrom;
    const matchDateTo = !dateTo || logDate <= dateTo;
    return matchSearch && matchAction && matchDateFrom && matchDateTo;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // Reset page when filters change
  const updateFilter = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setPage(1);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500">
          관리자 작업에 의한 데이터 변경 이력입니다.
        </p>
        <button
          onClick={() => alert("CSV 내보내기 (시뮬레이션)")}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <Download size={13} />
          내보내기
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="작업자·대상·내용 검색"
            value={search}
            onChange={(e) => updateFilter(setSearch)(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
          />
        </div>
        <select
          value={actionFilter}
          onChange={(e) => updateFilter(setActionFilter)(e.target.value as "all" | OrgAuditAction)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
        >
          <option value="all">전체 작업</option>
          {ALL_ACTIONS.map((a) => (
            <option key={a} value={a}>
              {ACTION_LABEL[a]}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-1.5">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => updateFilter(setDateFrom)(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
            placeholder="시작일"
          />
          <span className="text-xs text-slate-400">~</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => updateFilter(setDateTo)(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
            placeholder="종료일"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-2.5 font-medium w-6"></th>
              <th className="text-left px-4 py-2.5 font-medium">일시</th>
              <th className="text-left px-4 py-2.5 font-medium">작업자</th>
              <th className="text-left px-4 py-2.5 font-medium">작업 유형</th>
              <th className="text-left px-4 py-2.5 font-medium">대상</th>
              <th className="text-left px-4 py-2.5 font-medium">내용</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400">
                  검색 결과가 없습니다.
                </td>
              </tr>
            ) : (
              paged.map((log) => {
                const isExpanded = expandedId === log.id;
                return (
                  <tr
                    key={log.id}
                    onClick={() => setExpandedId(isExpanded ? null : log.id)}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="pl-4 pr-0 py-2.5 text-slate-400">
                      <ChevronDown
                        size={12}
                        className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </td>
                    <td className="px-4 py-2.5 text-slate-400 text-xs whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="px-4 py-2.5 text-slate-700">{log.actor}</td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${ACTION_COLOR[log.action]}`}
                      >
                        {ACTION_LABEL[log.action]}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-600">{log.target}</td>
                    <td className="px-4 py-2.5 text-slate-500">
                      {isExpanded ? (
                        <div className="flex flex-col gap-1">
                          <span className="text-slate-700 font-medium text-xs">상세 내용</span>
                          <span className="text-slate-500 text-xs leading-relaxed whitespace-pre-wrap">{log.detail}</span>
                        </div>
                      ) : (
                        <span className="truncate block max-w-[200px]">{log.detail.split(".")[0]}</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Footer: count + pagination */}
        <div className="px-4 py-2.5 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            총 {filtered.length}건 중 {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)}건
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} className="text-slate-500" />
            </button>
            <span className="text-xs text-slate-500 px-2">
              {safePage} / {totalPages}
            </span>
            <button
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={14} className="text-slate-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
