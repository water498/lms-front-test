"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────────────

interface Scorm12Api {
  LMSInitialize(param: string): "true" | "false";
  LMSFinish(param: string): "true" | "false";
  LMSGetValue(element: string): string;
  LMSSetValue(element: string, value: string): "true" | "false";
  LMSCommit(param: string): "true" | "false";
  LMSGetLastError(): string;
  LMSGetErrorString(errorCode: string): string;
  LMSGetDiagnostic(errorCode: string): string;
}

declare global {
  interface Window {
    API: Scorm12Api;
  }
}

type ScormData = Record<string, string>;

type LogEntry = {
  id: number;
  ts: string;
  fn: string;
  args: string;
  result: string;
  type: "init" | "get" | "set" | "commit" | "finish" | "error" | "info";
};

// ── Constants ──────────────────────────────────────────────────────────────

const DEFAULT_DATA: ScormData = {
  "cmi.core.student_id": "student_001",
  "cmi.core.student_name": "홍길동",
  "cmi.core.lesson_status": "not attempted",
  "cmi.core.score.raw": "",
  "cmi.core.score.min": "0",
  "cmi.core.score.max": "100",
  "cmi.core.session_time": "00:00:00",
  "cmi.core.total_time": "00:00:00",
  "cmi.core.lesson_location": "",
  "cmi.core.entry": "ab-initio",
  "cmi.core.credit": "credit",
  "cmi.core.exit": "",
  "cmi.launch_data": "",
  "cmi.suspend_data": "",
};

const ERROR_STRINGS: Record<string, string> = {
  "0":   "No Error",
  "101": "General Exception",
  "201": "Invalid Argument Error",
  "202": "Element Cannot Have Children",
  "203": "Element Not an Array — Cannot Have Count",
  "301": "Not Initialized",
  "401": "Not Implemented Error",
  "402": "Invalid Set Value, Element is a Keyword",
  "403": "Element is Read Only",
  "404": "Element is Write Only",
  "405": "Incorrect Data Type",
};

const LOG_TYPE_COLORS: Record<LogEntry["type"], string> = {
  init:   "text-emerald-400",
  finish: "text-rose-400",
  get:    "text-sky-400",
  set:    "text-amber-400",
  commit: "text-violet-400",
  error:  "text-red-400",
  info:   "text-zinc-400",
};

// ── Key fields to show in state panel ─────────────────────────────────────

const DISPLAY_KEYS = [
  "cmi.core.lesson_status",
  "cmi.core.score.raw",
  "cmi.core.score.min",
  "cmi.core.score.max",
  "cmi.core.session_time",
  "cmi.core.lesson_location",
  "cmi.core.student_name",
  "cmi.suspend_data",
];

const STATUS_COLORS: Record<string, string> = {
  "not attempted": "bg-zinc-700 text-zinc-300",
  "incomplete":    "bg-amber-900/50 text-amber-300",
  "completed":     "bg-emerald-900/50 text-emerald-300",
  "passed":        "bg-emerald-900/50 text-emerald-300",
  "failed":        "bg-red-900/50 text-red-300",
};

// ── Component ──────────────────────────────────────────────────────────────

export default function Scorm12Page() {
  const [iframeSrc, setIframeSrc] = useState("/scorm12/index.html");
  const [inputUrl, setInputUrl] = useState("/scorm12/index.html");
  const [scormData, setScormData] = useState<ScormData>({ ...DEFAULT_DATA });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [initialized, setInitialized] = useState(false);
  const logIdRef = useRef(0);
  const logEndRef = useRef<HTMLDivElement>(null);

  const addLog = (fn: string, args: string, result: string, type: LogEntry["type"]) => {
    const entry: LogEntry = {
      id: ++logIdRef.current,
      ts: new Date().toLocaleTimeString("ko-KR", { hour12: false }),
      fn,
      args,
      result,
      type,
    };
    setLogs((prev) => [entry, ...prev].slice(0, 200));
  };

  useEffect(() => {
    // Mutable closure state — not React state (avoids stale closure)
    let _data: ScormData = { ...DEFAULT_DATA };
    let _initialized = false;
    let _errorCode = "0";

    const api: Scorm12Api = {
      LMSInitialize(param) {
        if (_initialized) {
          _errorCode = "101";
          addLog("LMSInitialize", JSON.stringify(param), "false", "error");
          return "false";
        }
        _initialized = true;
        _data = { ...DEFAULT_DATA };
        _errorCode = "0";
        setInitialized(true);
        setScormData({ ..._data });
        addLog("LMSInitialize", JSON.stringify(param), "true", "init");
        return "true";
      },

      LMSFinish(param) {
        _initialized = false;
        _errorCode = "0";
        setInitialized(false);
        addLog("LMSFinish", JSON.stringify(param), "true", "finish");
        return "true";
      },

      LMSGetValue(element) {
        if (!_initialized) {
          _errorCode = "301";
          addLog("LMSGetValue", element, "ERROR:301", "error");
          return "";
        }
        const value = _data[element] ?? "";
        _errorCode = "0";
        addLog("LMSGetValue", element, JSON.stringify(value), "get");
        return value;
      },

      LMSSetValue(element, value) {
        if (!_initialized) {
          _errorCode = "301";
          addLog("LMSSetValue", `${element} = ${JSON.stringify(value)}`, "ERROR:301", "error");
          return "false";
        }
        _data[element] = value;
        _errorCode = "0";
        setScormData({ ..._data });
        addLog("LMSSetValue", `${element} = ${JSON.stringify(value)}`, "true", "set");
        return "true";
      },

      LMSCommit(param) {
        if (!_initialized) {
          _errorCode = "301";
          addLog("LMSCommit", JSON.stringify(param), "ERROR:301", "error");
          return "false";
        }
        _errorCode = "0";
        setScormData({ ..._data });
        addLog("LMSCommit", JSON.stringify(param), "true (synced)", "commit");
        return "true";
      },

      LMSGetLastError() {
        addLog("LMSGetLastError", "", _errorCode, "info");
        return _errorCode;
      },

      LMSGetErrorString(errorCode) {
        const msg = ERROR_STRINGS[errorCode] ?? "Unknown Error";
        addLog("LMSGetErrorString", errorCode, msg, "info");
        return msg;
      },

      LMSGetDiagnostic(errorCode) {
        const msg = ERROR_STRINGS[errorCode] ?? "Unknown Error";
        addLog("LMSGetDiagnostic", errorCode, msg, "info");
        return msg;
      },
    };

    window.API = api;
    addLog("window.API", "installed", "ready", "info");

    return () => {
      delete (window as unknown as { API?: Scorm12Api }).API;
      addLog("window.API", "cleanup", "removed", "info");
    };
  }, []);

  const handleLoad = () => {
    setIframeSrc(inputUrl);
    setLogs([]);
    setScormData({ ...DEFAULT_DATA });
    setInitialized(false);
  };

  const statusColor = STATUS_COLORS[scormData["cmi.core.lesson_status"]] ?? "bg-zinc-700 text-zinc-300";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-zinc-800">
        <Link href="/" className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm">
          ← 홈
        </Link>
        <div className="w-px h-4 bg-zinc-700" />
        <h1 className="font-semibold text-sm">SCORM 1.2 테스트</h1>
        <div
          className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${
            initialized ? "bg-emerald-900/50 text-emerald-300" : "bg-zinc-800 text-zinc-500"
          }`}
        >
          {initialized ? "● 초기화됨" : "○ 대기중"}
        </div>
      </header>

      {/* URL input bar */}
      <div className="flex gap-2 px-6 py-3 border-b border-zinc-800 bg-zinc-900/50">
        <input
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLoad()}
          className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
          placeholder="SCORM 패키지 URL (예: /scorm12/index.html)"
        />
        <button
          onClick={handleLoad}
          className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm font-medium transition-colors"
        >
          Load
        </button>
        <button
          onClick={() => {
            setLogs([]);
            setScormData({ ...DEFAULT_DATA });
            setInitialized(false);
          }}
          className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-sm text-zinc-400 transition-colors"
        >
          초기화
        </button>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 min-h-0" style={{ height: "calc(100vh - 112px)" }}>
        {/* Left: iframe */}
        <div className="flex-1 border-r border-zinc-800 bg-white">
          <iframe
            key={iframeSrc}
            src={iframeSrc}
            sandbox="allow-scripts allow-same-origin allow-forms"
            className="w-full h-full border-0"
            title="SCORM 1.2 Content"
          />
        </div>

        {/* Right: state + log */}
        <div className="w-96 flex flex-col bg-zinc-900">
          {/* SCORM state panel */}
          <div className="border-b border-zinc-800 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">SCORM 상태</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor}`}>
                {scormData["cmi.core.lesson_status"]}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {DISPLAY_KEYS.filter((k) => k !== "cmi.core.lesson_status").map((key) => {
                const shortKey = key.replace("cmi.core.", "").replace("cmi.", "");
                const value = scormData[key];
                return (
                  <div key={key} className="flex items-center gap-2 text-xs">
                    <span className="text-zinc-500 w-28 shrink-0 truncate">{shortKey}</span>
                    <span className="text-zinc-300 font-mono truncate">
                      {value === "" ? <span className="text-zinc-700">—</span> : value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Log panel */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">API 로그</span>
            <span className="text-xs text-zinc-600">{logs.length}건</span>
          </div>
          <div className="flex-1 overflow-y-auto font-mono text-xs p-3 space-y-1" ref={logEndRef}>
            {logs.length === 0 ? (
              <p className="text-zinc-700 text-center pt-4">콘텐츠가 로드되면 로그가 표시됩니다.</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex gap-2 items-start leading-5">
                  <span className="text-zinc-700 shrink-0 w-16">{log.ts}</span>
                  <span className={`shrink-0 w-36 ${LOG_TYPE_COLORS[log.type]}`}>{log.fn}</span>
                  <span className="text-zinc-500 truncate" title={`args: ${log.args} → ${log.result}`}>
                    {log.args && <span className="text-zinc-600">{log.args} </span>}
                    <span className="text-zinc-400">→ {log.result}</span>
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
