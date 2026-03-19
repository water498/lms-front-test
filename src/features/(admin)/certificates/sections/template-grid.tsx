"use client";

import { useEffect, useRef, useState } from "react";
import { Clock, Pencil, PlusCircle } from "lucide-react";
import { CertificateTemplate } from "../mockData";
import { useCertStore } from "../store";
import { courses } from "@/features/(admin)/courses/mockData";
import EditTemplateModal from "../modals/edit-template-modal";
import IssueCertModal from "../modals/issue-cert-modal";
import CreateTemplateModal from "../modals/create-template-modal";
import { CERT_W, CERT_H, buildSrcDoc } from "../utils/cert-preview";

function CertThumbnail({ template }: { template: CertificateTemplate }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.25);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setScale(el.clientWidth / CERT_W);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        aspectRatio: `${CERT_W} / ${CERT_H}`,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <iframe
        srcDoc={buildSrcDoc(template.htmlTemplate, template.backgroundImageUrl)}
        style={{
          width: CERT_W,
          height: CERT_H,
          border: "none",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          pointerEvents: "none",
        }}
        sandbox="allow-same-origin"
      />
    </div>
  );
}

export default function TemplateGrid() {
  const templates = useCertStore((s) => s.templates);
  const [editTarget, setEditTarget] = useState<CertificateTemplate | null>(null);
  const [issueTarget, setIssueTarget] = useState<CertificateTemplate | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-end">
          <button onClick={() => setShowCreate(true)} className="px-4 py-1.5 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors">
            + 새 템플릿
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {templates.map((t) => {
            const linkedCount = courses.filter((c) => c.certConfig?.templateId === t.id).length;
            return (
              <div key={t.id} className="bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden">
                {/* Thumbnail */}
                <div className="rounded-t-xl overflow-hidden border-b border-slate-100">
                  <CertThumbnail template={t} />
                </div>

                {/* Info */}
                <div className="p-3 flex flex-col gap-2 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-slate-800 text-sm leading-snug">{t.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${t.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                      {t.active ? "활성" : "비활성"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">연결 과정 {linkedCount}개</p>

                  <div className="mt-auto pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock size={11} />
                      {t.validityYears ? `${t.validityYears}년` : "무기한"}
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setEditTarget(t)}
                        className="flex items-center gap-1 text-xs text-slate-600 border border-slate-200 rounded-lg px-2 py-1 hover:bg-slate-50 transition-colors"
                      >
                        <Pencil size={11} />
                        편집
                      </button>
                      <button
                        onClick={() => setIssueTarget(t)}
                        className="flex items-center gap-1 text-xs text-violet-600 border border-violet-200 rounded-lg px-2 py-1 hover:bg-violet-50 transition-colors"
                      >
                        <PlusCircle size={11} />
                        발급
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {editTarget && (
        <EditTemplateModal template={editTarget} onClose={() => setEditTarget(null)} />
      )}
      {issueTarget && (
        <IssueCertModal template={issueTarget} onClose={() => setIssueTarget(null)} />
      )}
      {showCreate && (
        <CreateTemplateModal onClose={() => setShowCreate(false)} />
      )}
    </>
  );
}
