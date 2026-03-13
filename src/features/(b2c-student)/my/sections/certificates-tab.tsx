import { Award, Download } from "lucide-react";

const certificatesMock = [
  { id: "cert-1", courseTitle: "HTML/CSS 기초 완성", issuedAt: "2026-01-18", instructor: "최유진" },
  { id: "cert-2", courseTitle: "JavaScript 핵심 개념", issuedAt: "2026-02-22", instructor: "강현우" },
  { id: "cert-3", courseTitle: "Git & GitHub 실무", issuedAt: "2025-12-14", instructor: "임도현" },
  { id: "cert-4", courseTitle: "파이썬 기초", issuedAt: "2025-09-30", instructor: "윤하늘" },
  { id: "cert-5", courseTitle: "선형대수학 입문", issuedAt: "2025-07-12", instructor: "박지호" },
];

export function CertificatesTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {certificatesMock.map((cert) => (
        <div
          key={cert.id}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-3"
        >
          {/* Certificate visual */}
          <div className="w-full h-28 rounded-xl bg-gradient-to-br from-violet-900/40 to-zinc-900 border border-violet-800/30 flex flex-col items-center justify-center gap-1">
            <Award className="w-8 h-8 text-violet-400" />
            <span className="text-[10px] text-violet-400 font-semibold tracking-widest uppercase">Certificate</span>
          </div>

          <div>
            <p className="text-sm font-semibold text-white leading-tight">{cert.courseTitle}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{cert.instructor} 강사 · 발급일: {cert.issuedAt}</p>
          </div>

          <button className="flex items-center justify-center gap-1.5 w-full py-2 border border-zinc-700 hover:border-violet-500 text-zinc-400 hover:text-violet-400 text-xs font-medium rounded-lg transition-colors">
            <Download className="w-3.5 h-3.5" />
            PDF 다운로드
          </button>
        </div>
      ))}
    </div>
  );
}
