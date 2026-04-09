"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, ImagePlus, Trash2, X } from "lucide-react";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { certVariableDefs } from "../mockData";
import { useCertStore } from "../store";
import { CERT_W, CERT_H, buildSrcDoc } from "../utils/cert-preview";

const DEFAULT_HTML = `<div style="box-sizing:border-box;width:100%;height:100%;padding:80px 100px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;font-family:'Apple SD Gothic Neo','Noto Sans KR',sans-serif;color:#1a1a1a;background:#ffffff;">
  <p style="font-size:11px;letter-spacing:.35em;color:#94a3b8;text-transform:uppercase;">{{orgName}}</p>
  <div style="text-align:center;">
    <p style="font-size:9px;letter-spacing:.5em;color:#e2e8f0;text-transform:uppercase;margin-bottom:12px;">Certificate of Completion</p>
    <p style="font-size:32px;font-weight:700;letter-spacing:.4em;color:#1e293b;">수 료 증</p>
  </div>
  <div style="width:48px;height:2px;background:#334155;"></div>
  <p style="font-size:15px;text-align:center;line-height:2.1;color:#475569;">
    <strong style="font-size:20px;color:#0f172a;display:block;margin-bottom:4px;">{{recipientName}}</strong>
    님이 <strong>{{courseName}}</strong> 과정을<br>성공적으로 이수하였음을 증명합니다.
  </p>
  <div style="text-align:center;font-size:11px;color:#94a3b8;line-height:2.4;margin-top:8px;">
    <p>수료일 &nbsp;&nbsp; {{completionDate}}</p>
    <p>발급일 &nbsp;&nbsp; {{issuedDate}}</p>
  </div>
  <p style="font-size:10px;color:#cbd5e1;margin-top:4px;">No. {{certNumber}}</p>
  <div style="display:flex;gap:100px;margin-top:36px;padding-top:24px;border-top:1px solid #e2e8f0;width:80%;justify-content:center;">
    <div style="text-align:center;"><div style="width:90px;border-top:1px solid #cbd5e1;padding-top:8px;font-size:11px;color:#94a3b8;">대표자 서명</div></div>
    <div style="text-align:center;"><div style="width:90px;border-top:1px solid #cbd5e1;padding-top:8px;font-size:11px;color:#94a3b8;">직인 날인</div></div>
  </div>
</div>`;

interface Props {
  onClose: () => void;
}

export default function CreateTemplateModal({ onClose }: Props) {
  const addTemplate = useCertStore((s) => s.addTemplate);

  const [name, setName] = useState("");
  const [active, setActive] = useState(true);
  const [validityYears, setValidityYears] = useState<number | null>(null);
  const [htmlTemplate, setHtmlTemplate] = useState(DEFAULT_HTML);
  const [bgUrl, setBgUrl] = useState<string | null>(null);

  const editorRef = useRef<ReactCodeMirrorRef>(null);
  const previewPanelRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(0.45);

  useEffect(() => {
    const el = previewPanelRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth - 48;
      const h = el.clientHeight - 56;
      const s = Math.min(w / CERT_W, h / CERT_H, 1);
      setPreviewScale(s > 0 ? s : 0.45);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const [srcDoc, setSrcDoc] = useState(() => buildSrcDoc(htmlTemplate, bgUrl));
  useEffect(() => {
    const timer = setTimeout(() => setSrcDoc(buildSrcDoc(htmlTemplate, bgUrl)), 350);
    return () => clearTimeout(timer);
  }, [htmlTemplate, bgUrl]);

  function insertVariable(key: string) {
    const view = editorRef.current?.view;
    const snippet = `{{${key}}}`;
    if (!view) {
      setHtmlTemplate((t) => t + snippet);
      return;
    }
    const { from } = view.state.selection.main;
    view.dispatch({
      changes: { from, insert: snippet },
      selection: { anchor: from + snippet.length },
    });
    view.focus();
  }

  function handleBgFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setBgUrl((ev.target?.result as string) ?? null);
    reader.readAsDataURL(file);
  }

  function openInNewTab() {
    const blob = new Blob([srcDoc], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function handleSave() {
    addTemplate({ tenantId: "t1", name, active, validityYears, htmlTemplate, backgroundImageUrl: bgUrl });
    onClose();
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-6xl mx-4 flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <h2 className="font-semibold text-slate-800">새 템플릿 만들기</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 min-h-0 divide-x divide-slate-100 overflow-hidden">
          {/* Left: Settings + Editor */}
          <div className="flex-1 min-w-0 flex flex-col divide-y divide-slate-100 overflow-y-auto">

            {/* Settings */}
            <div className="p-5 flex flex-col gap-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">설정</p>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-600">템플릿 이름</label>
                <input
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="템플릿 이름을 입력하세요"
                  autoFocus
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-600">활성화</label>
                <button
                  onClick={() => setActive((v) => !v)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${active ? "bg-violet-500" : "bg-slate-200"}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${active ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-600">유효기간 (년, 비워두면 무기한)</label>
                <input
                  type="number"
                  min={1}
                  placeholder="무기한"
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                  value={validityYears ?? ""}
                  onChange={(e) => setValidityYears(e.target.value === "" ? null : Number(e.target.value))}
                />
              </div>
            </div>

            {/* Background image */}
            <div className="p-5 flex flex-col gap-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">배경 이미지</p>
              {bgUrl ? (
                <div className="flex items-center gap-3">
                  <img src={bgUrl} className="h-12 w-20 object-cover rounded-md border border-slate-200" />
                  <button
                    onClick={() => setBgUrl(null)}
                    className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={12} />
                    제거
                  </button>
                </div>
              ) : (
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-500 border border-dashed border-slate-200 rounded-lg px-3 py-2.5 hover:bg-slate-50 transition-colors">
                  <ImagePlus size={14} className="text-slate-400 flex-shrink-0" />
                  <span>이미지 선택 <span className="text-slate-300">(794 × 1123px 권장)</span></span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleBgFile} />
                </label>
              )}
            </div>

            {/* HTML editor */}
            <div className="p-5 flex flex-col gap-3 flex-1 min-h-0">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">HTML 템플릿</p>
              <div className="flex-1 min-h-64 border border-slate-200 rounded-lg overflow-hidden">
                <CodeMirror
                  ref={editorRef}
                  value={htmlTemplate}
                  onChange={(val) => setHtmlTemplate(val)}
                  extensions={[html()]}
                  theme="light"
                  style={{ fontSize: 12 }}
                  basicSetup={{
                    lineNumbers: true,
                    foldGutter: false,
                    highlightActiveLine: true,
                  }}
                />
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1.5">변수 삽입</p>
                <div className="flex flex-wrap gap-1">
                  {certVariableDefs.map((v) => (
                    <button
                      key={v.key}
                      onClick={() => insertVariable(v.key)}
                      title={`소스: ${v.source}`}
                      className="text-[11px] bg-slate-100 hover:bg-violet-50 hover:text-violet-600 text-slate-600 px-2 py-0.5 rounded transition-colors font-mono"
                    >
                      {`{{${v.key}}}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: iframe preview */}
          <div ref={previewPanelRef} className="w-72 flex-shrink-0 p-6 flex flex-col gap-3 overflow-hidden bg-slate-50">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex-shrink-0 flex items-center">
              미리보기
              <span className="normal-case font-normal text-slate-300 ml-2">샘플 데이터 기준</span>
              <button
                onClick={openInNewTab}
                className="ml-auto flex items-center gap-1 text-xs text-slate-400 hover:text-violet-600 transition-colors"
                title="새창에서 보기"
              >
                <ExternalLink size={12} />
              </button>
            </p>
            <div className="flex-1 flex items-start justify-center overflow-hidden">
              <div
                style={{
                  width: CERT_W * previewScale,
                  height: CERT_H * previewScale,
                  flexShrink: 0,
                  overflow: "hidden",
                  borderRadius: 8,
                  boxShadow: "0 4px 32px rgba(0,0,0,0.14)",
                  position: "relative",
                  background: "#fff",
                }}
              >
                <iframe
                  srcDoc={srcDoc}
                  style={{
                    width: CERT_W,
                    height: CERT_H,
                    border: "none",
                    transform: `scale(${previewScale})`,
                    transformOrigin: "top left",
                    pointerEvents: "none",
                  }}
                  sandbox="allow-same-origin"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors">
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="px-4 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
