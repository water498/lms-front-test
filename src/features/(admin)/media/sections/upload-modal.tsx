"use client";

import { useState, useRef, useEffect } from "react";
import { X, Upload, CheckCircle2, ChevronDown } from "lucide-react";
import type { AssetType } from "../mockData";

interface Props {
  onClose: () => void;
}

type Step = "idle" | "detecting" | "pending" | "validating" | "processing" | "active" | "error";

const TYPE_CONFIG: Record<AssetType, { label: string; className: string }> = {
  VIDEO: { label: "VIDEO",  className: "bg-blue-100 text-blue-700" },
  PDF:   { label: "PDF",    className: "bg-amber-100 text-amber-700" },
  SCORM: { label: "SCORM",  className: "bg-violet-100 text-violet-700" },
  IMAGE: { label: "IMAGE",  className: "bg-emerald-100 text-emerald-700" },
};

function detectTypeFromName(name: string): AssetType {
  const lower = name.toLowerCase();
  if (lower.endsWith(".mp4") || lower.endsWith(".mov") || lower.endsWith(".webm")) return "VIDEO";
  if (lower.endsWith(".pdf")) return "PDF";
  if (lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".gif") || lower.endsWith(".webp")) return "IMAGE";
  if (lower.endsWith(".zip") || lower.endsWith(".scorm")) return "SCORM";
  return "VIDEO";
}

function fileNameToTitle(name: string): string {
  return name.replace(/\.[^.]+$/, "").replace(/[_\-]/g, " ");
}

export default function UploadModal({ onClose }: Props) {
  const [dragging, setDragging] = useState(false);
  const [step, setStep] = useState<Step>("idle");
  const [fileName, setFileName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [detectedType, setDetectedType] = useState<AssetType>("VIDEO");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [progress, setProgress] = useState(0);
  const [cdnUrl, setCdnUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function clear() {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  useEffect(() => () => clear(), []);

  function handleFile(name: string) {
    setFileName(name);
    setDisplayName(fileNameToTitle(name));
    setStep("detecting");
    timerRef.current = setTimeout(() => {
      setDetectedType(detectTypeFromName(name));
      setStep("detecting");
    }, 500);
  }

  function startUpload() {
    setStep("pending");
    timerRef.current = setTimeout(() => {
      setStep("validating");
      timerRef.current = setTimeout(() => {
        setStep("processing");
        setProgress(0);
        intervalRef.current = setInterval(() => {
          setProgress((p) => {
            const next = p + Math.floor(Math.random() * 10) + 5;
            if (next >= 100) {
              if (intervalRef.current) clearInterval(intervalRef.current);
              const mockId = Math.random().toString(36).slice(2, 10);
              setCdnUrl(`cdn.acme.com/media/${mockId}`);
              setStep("active");
              return 100;
            }
            return next;
          });
        }, 200);
      }, 800);
    }, 300);
  }

  const isScorm = detectedType === "SCORM";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-slate-800">파일 업로드</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* ── idle: drop zone ── */}
          {step === "idle" && (
            <div
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-2 transition-colors cursor-pointer ${
                dragging ? "border-violet-400 bg-violet-50" : "border-slate-200 hover:border-slate-300"
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                const file = e.dataTransfer.files[0];
                if (file) handleFile(file.name);
              }}
              onClick={() => inputRef.current?.click()}
            >
              <Upload size={24} className="text-slate-400" />
              <p className="text-sm text-slate-600 font-medium">파일을 드래그하거나 클릭해서 선택</p>
              <p className="text-xs text-slate-400">최대 2GB · MP4, PDF, PNG, ZIP(SCORM) 지원</p>
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file.name);
                }}
              />
            </div>
          )}

          {/* ── detecting: spinner → result ── */}
          {step === "detecting" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <div className="w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
                파일 분석 완료
              </div>
              <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-3">
                <p className="text-xs text-slate-500 truncate font-mono">{fileName}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">감지된 유형</span>
                  <div className="relative">
                    <button
                      onClick={() => setShowTypeDropdown((v) => !v)}
                      className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${TYPE_CONFIG[detectedType].className}`}
                    >
                      {TYPE_CONFIG[detectedType].label}
                      <ChevronDown size={11} />
                    </button>
                    {showTypeDropdown && (
                      <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-md z-10 overflow-hidden">
                        {(["VIDEO", "PDF", "IMAGE", "SCORM"] as AssetType[]).map((t) => (
                          <button
                            key={t}
                            onClick={() => { setDetectedType(t); setShowTypeDropdown(false); }}
                            className="block w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 text-slate-700"
                          >
                            {TYPE_CONFIG[t].label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">(수정 가능)</span>
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">이름</label>
                  <input
                    className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="표시 이름을 입력하세요"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">태그 <span className="text-slate-400">(선택)</span></label>
                  <div className="flex flex-wrap gap-1 mb-1.5">
                    {tags.map((tag) => (
                      <span key={tag} className="flex items-center gap-1 text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                        {tag}
                        <button
                          type="button"
                          onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}
                          className="text-violet-400 hover:text-violet-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
                        e.preventDefault();
                        const newTag = tagInput.trim().replace(/,$/, "");
                        if (newTag && !tags.includes(newTag)) setTags((prev) => [...prev, newTag]);
                        setTagInput("");
                      }
                    }}
                    placeholder="태그 입력 후 Enter 또는 쉼표"
                  />
                </div>
              </div>
              <button
                onClick={startUpload}
                disabled={!displayName.trim()}
                className="w-full py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 disabled:opacity-40 transition-colors font-medium"
              >
                업로드 시작
              </button>
            </div>
          )}

          {/* ── pending ── */}
          {step === "pending" && (
            <div className="flex items-center gap-2 text-sm text-slate-600 py-4 justify-center">
              <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              DB 레코드 생성 중...
            </div>
          )}

          {/* ── validating ── */}
          {step === "validating" && (
            <div className="flex flex-col items-center gap-1 py-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                파일 검증 중...
              </div>
              {isScorm && (
                <p className="text-xs text-slate-400">imsmanifest.xml 파싱 중</p>
              )}
            </div>
          )}

          {/* ── processing ── */}
          {step === "processing" && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                S3 업로드 중...
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500 truncate pr-4 font-mono">{fileName}</p>
                <span className="text-sm font-semibold text-violet-600 tabular-nums">{Math.min(progress, 100)}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-violet-500 rounded-full transition-all duration-200"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* ── active ── */}
          {step === "active" && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                <CheckCircle2 size={18} className="text-green-500" />
                업로드 완료
              </div>
              <div className="bg-slate-50 rounded-lg px-4 py-3">
                <p className="text-sm font-medium text-slate-800 mb-0.5">{displayName}</p>
                <p className="text-xs font-mono text-slate-400">{cdnUrl}</p>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {tags.map((tag) => (
                      <span key={tag} className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── error ── */}
          {step === "error" && (
            <div className="flex flex-col gap-3">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm font-medium text-red-600 mb-1">업로드 실패</p>
                <p className="text-xs text-red-400">서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.</p>
              </div>
              <button
                onClick={() => { setStep("idle"); setFileName(""); setProgress(0); }}
                className="w-full py-2 text-sm text-violet-600 border border-violet-300 rounded-lg hover:bg-violet-50 transition-colors font-medium"
              >
                다시 시도
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            {step === "active" ? "닫기" : "취소"}
          </button>
          {step === "active" && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
            >
              완료
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
