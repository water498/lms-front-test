"use client";

import { useState, useRef, useEffect } from "react";
import { X, Upload } from "lucide-react";
import type { MediaType } from "../mockData";

interface Props {
  onClose: () => void;
}

const MEDIA_TYPES: { id: MediaType; label: string }[] = [
  { id: "VIDEO",    label: "동영상" },
  { id: "DOCUMENT", label: "문서 (PDF)" },
  { id: "SCORM",    label: "SCORM" },
  { id: "OTHER",    label: "기타" },
];

export default function UploadModal({ onClose }: Props) {
  const [dragging, setDragging] = useState(false);
  const [mediaType, setMediaType] = useState<MediaType>("VIDEO");
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const mockCdnUrl = fileName
    ? `cdn.acme.com/media/${Math.random().toString(36).slice(2, 10)}`
    : "";

  function startUpload(name: string) {
    setFileName(name);
    setUploading(true);
    setProgress(0);
    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setUploading(false);
          setDone(true);
          return 100;
        }
        return p + Math.floor(Math.random() * 12) + 5;
      });
    }, 200);
  }

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

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
          {/* Type */}
          <div>
            <label className="text-xs font-medium text-slate-600 mb-2 block">유형</label>
            <div className="flex gap-2">
              {MEDIA_TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setMediaType(t.id)}
                  className={`flex-1 text-xs py-1.5 rounded-lg border font-medium transition-colors ${
                    mediaType === t.id
                      ? "border-violet-400 bg-violet-50 text-violet-700"
                      : "border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Drop zone */}
          {!uploading && !done && (
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
                if (file) startUpload(file.name);
              }}
              onClick={() => inputRef.current?.click()}
            >
              <Upload size={24} className="text-slate-400" />
              <p className="text-sm text-slate-600 font-medium">파일을 드래그하거나 클릭해서 선택</p>
              <p className="text-xs text-slate-400">최대 2GB</p>
              <input ref={inputRef} type="file" className="hidden" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) startUpload(file.name);
              }} />
            </div>
          )}

          {/* Progress */}
          {(uploading || done) && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-700 font-medium truncate pr-4">{fileName}</p>
                <span className="text-sm font-semibold text-violet-600 tabular-nums">{Math.min(progress, 100)}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-violet-500 rounded-full transition-all duration-200"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              {done && (
                <div className="bg-slate-50 rounded-lg px-4 py-3">
                  <p className="text-xs text-slate-500 mb-0.5">CDN 경로</p>
                  <p className="text-xs font-mono text-slate-700">{mockCdnUrl}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            {done ? "닫기" : "취소"}
          </button>
          {done && (
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
