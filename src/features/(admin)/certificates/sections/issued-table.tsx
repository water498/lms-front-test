"use client";

import { useState } from "react";
import { Download, Link2, RefreshCw, XCircle } from "lucide-react";
import { useCertStore } from "../store";
import { CertStatus, IssuedCert } from "../mockData";
import RevokeModal from "../modals/revoke-modal";
import ReissueModal from "../modals/reissue-modal";

const STATUS_BADGE: Record<CertStatus, { label: string; className: string }> = {
  VALID:   { label: "유효",   className: "bg-emerald-100 text-emerald-700" },
  REVOKED: { label: "취소됨", className: "bg-red-100 text-red-600" },
  EXPIRED: { label: "만료됨", className: "bg-slate-100 text-slate-500" },
};

type ModalState =
  | { type: "revoke"; cert: IssuedCert }
  | { type: "reissue"; cert: IssuedCert }
  | null;

export default function IssuedTable() {
  const { certs, revoke, reissue } = useCertStore();
  const [courseFilter, setCourseFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<CertStatus | "ALL">("ALL");
  const [modal, setModal] = useState<ModalState>(null);

  const courses = Array.from(new Set(certs.map((c) => c.course)));

  const filtered = certs.filter(
    (c) =>
      (courseFilter === "ALL" || c.course === courseFilter) &&
      (statusFilter === "ALL" || c.status === statusFilter)
  );

  const copyLink = (token: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/verify/${token}`);
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 flex-wrap">
          <select
            className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
          >
            <option value="ALL">전체 과정</option>
            {courses.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select
            className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as CertStatus | "ALL")}
          >
            <option value="ALL">전체 상태</option>
            <option value="VALID">유효</option>
            <option value="REVOKED">취소됨</option>
            <option value="EXPIRED">만료됨</option>
          </select>
          <span className="text-sm text-slate-500">{filtered.length}건</span>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 border-b border-slate-100">
              <th className="text-left px-5 py-3 font-medium">수료증 번호</th>
              <th className="text-left px-4 py-3 font-medium">수령인</th>
              <th className="text-left px-4 py-3 font-medium">과정</th>
              <th className="text-left px-4 py-3 font-medium">상태</th>
              <th className="text-left px-4 py-3 font-medium">발급일</th>
              <th className="text-left px-4 py-3 font-medium">만료일</th>
              <th className="text-left px-4 py-3 font-medium">재발급일</th>
              <th className="text-left px-4 py-3 font-medium">액션</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const badge = STATUS_BADGE[c.status];
              return (
                <tr key={c.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-slate-600">{c.certNumber}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{c.recipient}</td>
                  <td className="px-4 py-3 text-slate-600">{c.course}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.className}`}>
                      {badge.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{c.issuedAt}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{c.expiredAt ?? "무기한"}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{c.reissuedAt ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {c.status === "VALID" && (
                        <button
                          title="PDF 다운로드"
                          className="text-violet-600 hover:text-violet-800 transition-colors"
                        >
                          <Download size={14} />
                        </button>
                      )}
                      <button
                        title="링크 복사"
                        onClick={() => copyLink(c.publicToken)}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <Link2 size={14} />
                      </button>
                      {c.status === "VALID" && (
                        <>
                          <button
                            title="재발급"
                            onClick={() => setModal({ type: "reissue", cert: c })}
                            className="text-slate-400 hover:text-emerald-600 transition-colors"
                          >
                            <RefreshCw size={14} />
                          </button>
                          <button
                            title="취소"
                            onClick={() => setModal({ type: "revoke", cert: c })}
                            className="text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <XCircle size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modal?.type === "revoke" && (
        <RevokeModal
          certNumber={modal.cert.certNumber}
          recipient={modal.cert.recipient}
          onConfirm={(reason) => {
            revoke(modal.cert.id, reason, "관리자");
            setModal(null);
          }}
          onCancel={() => setModal(null)}
        />
      )}

      {modal?.type === "reissue" && (
        <ReissueModal
          certNumber={modal.cert.certNumber}
          recipient={modal.cert.recipient}
          onConfirm={() => {
            reissue(modal.cert.id);
            setModal(null);
          }}
          onCancel={() => setModal(null)}
        />
      )}
    </>
  );
}
