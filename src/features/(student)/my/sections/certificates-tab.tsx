"use client";

import { useState } from "react";
import { Award, Download, X, ExternalLink } from "lucide-react";

interface Certificate {
  id: string;
  courseTitle: string;
  issuedAt: string;
  instructor: string;
  category?: string;
  duration?: string;
}

const certificatesMock: Certificate[] = [
  { id: "cert-1", courseTitle: "HTML/CSS 기초 완성", issuedAt: "2026-01-18", instructor: "최유진", category: "프론트엔드", duration: "10시간" },
  { id: "cert-2", courseTitle: "JavaScript 핵심 개념", issuedAt: "2026-02-22", instructor: "강현우", category: "프론트엔드", duration: "15시간" },
  { id: "cert-3", courseTitle: "Git & GitHub 실무", issuedAt: "2025-12-14", instructor: "임도현", category: "기타", duration: "8시간" },
  { id: "cert-4", courseTitle: "파이썬 기초", issuedAt: "2025-09-30", instructor: "윤하늘", category: "데이터", duration: "12시간" },
  { id: "cert-5", courseTitle: "선형대수학 입문", issuedAt: "2025-07-12", instructor: "박지호", category: "데이터", duration: "20시간" },
];

const CERT_NUMBER_MAP: Record<string, string> = {
  "cert-1": "OK-2026-0118-A4F2",
  "cert-2": "OK-2026-0222-B7D9",
  "cert-3": "OK-2025-1214-C1E3",
  "cert-4": "OK-2025-0930-D5A8",
  "cert-5": "OK-2025-0712-E9B1",
};

function CertificateModal({ cert, onClose }: { cert: Certificate; onClose: () => void }) {
  const certNumber = CERT_NUMBER_MAP[cert.id] ?? "OK-XXXX-XXXX-XXXX";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg flex flex-col gap-3">
        {/* Close */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Certificate body */}
        <div className="bg-gradient-to-br from-zinc-900 via-violet-950/30 to-zinc-900 border border-violet-800/40 rounded-2xl overflow-hidden shadow-2xl shadow-violet-900/20">
          {/* Top decoration */}
          <div className="h-1.5 bg-gradient-to-r from-violet-600 via-violet-400 to-violet-600" />

          <div className="px-8 py-10 flex flex-col items-center gap-6 text-center">
            {/* Logo + brand */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
                <Award className="w-7 h-7 text-violet-400" />
              </div>
              <p className="text-xs font-bold tracking-[0.25em] text-violet-400 uppercase">롯데건설</p>
            </div>

            {/* Certificate of completion */}
            <div>
              <p className="text-xs text-zinc-500 tracking-widest uppercase mb-1">Certificate of Completion</p>
              <h2 className="text-xl font-bold text-white">수료증</h2>
            </div>

            {/* Recipient */}
            <div className="flex flex-col items-center gap-1">
              <p className="text-xs text-zinc-500">이 수료증은 다음 분에게 수여합니다</p>
              <p className="text-2xl font-bold text-white mt-1">홍 길 동</p>
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-zinc-600 to-transparent mt-2" />
            </div>

            {/* Course info */}
            <div className="flex flex-col items-center gap-1.5">
              <p className="text-xs text-zinc-500">아래 과정을 성공적으로 이수하였음을 증명합니다</p>
              <p className="text-base font-semibold text-violet-300 leading-snug max-w-xs">{cert.courseTitle}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                <span>{cert.instructor} 강사</span>
                {cert.category && <><span>·</span><span>{cert.category}</span></>}
                {cert.duration && <><span>·</span><span>{cert.duration}</span></>}
              </div>
            </div>

            {/* Date + cert number */}
            <div className="flex items-center justify-between w-full pt-4 border-t border-zinc-800">
              <div className="text-left">
                <p className="text-xs text-zinc-600">발급일</p>
                <p className="text-sm font-medium text-zinc-300">{cert.issuedAt}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-zinc-600">증서번호</p>
                <p className="text-xs font-mono text-zinc-400">{certNumber}</p>
              </div>
            </div>
          </div>

          {/* Bottom decoration */}
          <div className="h-1 bg-gradient-to-r from-violet-600 via-violet-400 to-violet-600" />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm rounded-xl transition-colors">
            <Download className="w-4 h-4" />
            PDF 다운로드
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm rounded-xl transition-colors">
            <ExternalLink className="w-4 h-4" />
            공유
          </button>
        </div>
      </div>
    </div>
  );
}

export function CertificatesTab() {
  const [selected, setSelected] = useState<Certificate | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certificatesMock.map((cert) => (
          <button
            key={cert.id}
            onClick={() => setSelected(cert)}
            className="bg-zinc-900 border border-zinc-800 hover:border-violet-800/50 rounded-2xl p-5 flex flex-col gap-3 text-left transition-all hover:bg-zinc-900/80 group"
          >
            {/* Certificate visual */}
            <div className="w-full h-28 rounded-xl bg-gradient-to-br from-violet-900/40 to-zinc-900 border border-violet-800/30 group-hover:border-violet-600/40 flex flex-col items-center justify-center gap-1 transition-colors">
              <Award className="w-8 h-8 text-violet-400" />
              <span className="text-[10px] text-violet-400 font-semibold tracking-widest uppercase">Certificate</span>
            </div>

            <div>
              <p className="text-sm font-semibold text-white leading-tight">{cert.courseTitle}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{cert.instructor} 강사 · 발급일: {cert.issuedAt}</p>
            </div>

            <div className="flex items-center justify-center gap-1.5 w-full py-2 border border-zinc-700 group-hover:border-violet-600/50 text-zinc-400 group-hover:text-violet-400 text-xs font-medium rounded-lg transition-colors">
              <Download className="w-3.5 h-3.5" />
              수료증 보기 · PDF 다운로드
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <CertificateModal cert={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
