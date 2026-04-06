"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { FileText, X } from "lucide-react";
import Markdown from "react-markdown";

export default function FeatureDescriptionViewer() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchContent = useCallback(async (path: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/feature-description?path=${encodeURIComponent(path)}`
      );
      const data = await res.json();
      setContent(data.content || "");
    } catch {
      setContent("");
    } finally {
      setLoading(false);
    }
  }, []);

  // 경로 변경 시 패널 닫기
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleOpen = () => {
    setIsOpen(true);
    fetchContent(pathname);
  };

  return (
    <>
      {/* 플로팅 버튼 */}
      <button
        onClick={isOpen ? () => setIsOpen(false) : handleOpen}
        className="fixed bottom-5 right-5 z-[9999] flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 text-white shadow-lg transition-all hover:bg-violet-700 hover:scale-110 active:scale-95"
        title="Feature Description"
      >
        <FileText size={18} />
      </button>

      {/* 백드롭 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9997] bg-black/30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 사이드 패널 */}
      <div
        className={`fixed top-0 right-0 z-[9998] h-full w-full max-w-180 bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Feature Description
            </p>
            <p className="mt-0.5 truncate text-sm font-mono text-slate-600">
              {pathname}
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="ml-3 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        </div>

        {/* 본문 */}
        <div className="h-[calc(100%-73px)] overflow-y-auto px-6 py-5">
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-violet-500" />
              불러오는 중...
            </div>
          ) : content ? (
            <div className="prose prose-sm prose-slate max-w-none [&_h1]:text-lg [&_h1]:font-bold [&_h1]:mb-3 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mb-2 [&_h2]:mt-5 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mb-1.5 [&_h3]:mt-4 [&_p]:text-sm [&_p]:text-slate-600 [&_p]:leading-relaxed [&_p]:mb-3 [&_ul]:text-sm [&_ul]:text-slate-600 [&_ul]:mb-3 [&_ul]:pl-5 [&_ul]:list-disc [&_ol]:text-sm [&_ol]:text-slate-600 [&_ol]:mb-3 [&_ol]:pl-5 [&_ol]:list-decimal [&_li]:mb-1 [&_code]:text-xs [&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_pre]:bg-slate-50 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:text-xs [&_pre]:overflow-x-auto [&_pre]:mb-3 [&_blockquote]:border-l-3 [&_blockquote]:border-violet-300 [&_blockquote]:pl-4 [&_blockquote]:text-sm [&_blockquote]:text-slate-500 [&_blockquote]:italic [&_hr]:my-4 [&_hr]:border-slate-200 [&_table]:text-sm [&_table]:w-full [&_th]:text-left [&_th]:font-semibold [&_th]:pb-2 [&_th]:border-b [&_th]:border-slate-200 [&_td]:py-1.5 [&_td]:border-b [&_td]:border-slate-100 [&_a]:text-violet-600 [&_a]:underline">
              <Markdown>{content}</Markdown>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-3">
                <FileText size={20} className="text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-500">
                아직 작성되지 않은 페이지입니다
              </p>
              <p className="mt-1 text-xs text-slate-400">
                이 경로의 feature-description.md를 작성해주세요
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
