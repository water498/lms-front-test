"use client";

import { useState, useRef } from "react";
import { X, Upload, FileText, CheckCircle, XCircle } from "lucide-react";

interface Props {
  onClose: () => void;
}

type ImportStatus = "OK" | "DUPLICATE" | "ERROR";

const PREVIEW_ROWS: { name: string; email: string; role: string; status: ImportStatus }[] = [
  { name: "김철수", email: "kim.cs@acme.com",  role: "수강생", status: "OK" },
  { name: "이영희", email: "lee.yh@acme.com",  role: "수강생", status: "OK" },
  { name: "박민호", email: "park.mh@acme.com", role: "수강생", status: "OK" },
  { name: "홍길동", email: "admin@acme.com",   role: "수강생", status: "DUPLICATE" },
  { name: "최지수", email: "invalid-email",    role: "수강생", status: "ERROR" },
];

const STATUS_ICON = {
  OK:        <CheckCircle size={14} className="text-emerald-500" />,
  DUPLICATE: <XCircle size={14} className="text-amber-500" />,
  ERROR:     <XCircle size={14} className="text-red-500" />,
};

const STATUS_LABEL = {
  OK:        "정상",
  DUPLICATE: "중복",
  ERROR:     "오류",
};

export default function ImportUsersModal({ onClose }: Props) {
  const [step, setStep] = useState<"upload" | "preview">("upload");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const okCount = PREVIEW_ROWS.filter((r) => r.status === "OK").length;

  const handleFile = () => setStep("preview");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-slate-800">유저 가져오기 (CSV)</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        {step === "upload" ? (
          <>
            <div
              className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center gap-3 transition-colors cursor-pointer ${
                dragging ? "border-violet-400 bg-violet-50" : "border-slate-200 hover:border-slate-300"
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(); }}
              onClick={() => inputRef.current?.click()}
            >
              <Upload size={28} className="text-slate-400" />
              <p className="text-sm text-slate-600 font-medium">CSV 파일을 드래그하거나 클릭해서 선택</p>
              <p className="text-xs text-slate-400">이름, 이메일, 역할 컬럼 포함 필요</p>
              <input ref={inputRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
            </div>
            <div className="flex items-center justify-between mt-4">
              <button className="text-xs text-violet-600 hover:underline flex items-center gap-1">
                <FileText size={12} /> 템플릿 다운로드
              </button>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                취소
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-slate-600">
                총 <span className="font-semibold text-slate-800">{PREVIEW_ROWS.length}</span>행 —{" "}
                <span className="text-emerald-600 font-medium">{okCount}건 정상</span>,{" "}
                <span className="text-amber-600 font-medium">{PREVIEW_ROWS.filter((r) => r.status === "DUPLICATE").length}건 중복</span>,{" "}
                <span className="text-red-500 font-medium">{PREVIEW_ROWS.filter((r) => r.status === "ERROR").length}건 오류</span>
              </p>
              <button
                onClick={() => setStep("upload")}
                className="text-xs text-slate-500 hover:text-slate-700 hover:underline"
              >
                파일 다시 선택
              </button>
            </div>
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-slate-400 bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-4 py-2 font-medium">이름</th>
                    <th className="text-left px-4 py-2 font-medium">이메일</th>
                    <th className="text-left px-4 py-2 font-medium">역할</th>
                    <th className="text-left px-4 py-2 font-medium">결과</th>
                  </tr>
                </thead>
                <tbody>
                  {PREVIEW_ROWS.map((row, i) => (
                    <tr key={i} className="border-b border-slate-50 last:border-0">
                      <td className="px-4 py-2 text-slate-800">{row.name}</td>
                      <td className="px-4 py-2 text-slate-500">{row.email}</td>
                      <td className="px-4 py-2 text-slate-500">{row.role}</td>
                      <td className="px-4 py-2">
                        <span className="flex items-center gap-1 text-xs">
                          {STATUS_ICON[row.status]}
                          {STATUS_LABEL[row.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
              >
                {okCount}건 가져오기 확인
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
