"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────────────

interface Scorm2004Api {
  Initialize(param: string): "true" | "false";
  Terminate(param: string): "true" | "false";
  GetValue(element: string): string;
  SetValue(element: string, value: string): "true" | "false";
  Commit(param: string): "true" | "false";
  GetLastError(): string;
  GetErrorString(errorCode: string): string;
  GetDiagnostic(errorCode: string): string;
}

declare global {
  interface Window {
    API_1484_11: Scorm2004Api;
  }
}

type LogEntry = {
  id: number;
  ts: string;
  fn: string;
  args: string;
  result: string;
  type: "init" | "get" | "set" | "commit" | "finish" | "error" | "info";
};

// ── Constants ──────────────────────────────────────────────────────────────

const DEFAULT_DATA: Record<string, string> = {
  "cmi.learner_id":        "student_001",
  "cmi.learner_name":      "홍길동",
  "cmi.completion_status": "not attempted",
  "cmi.success_status":    "unknown",
  "cmi.score.scaled":      "",
  "cmi.score.raw":         "",
  "cmi.score.min":         "0",
  "cmi.score.max":         "100",
  "cmi.session_time":      "PT0S",
  "cmi.location":          "",
  "cmi.suspend_data":      "",
  "cmi.entry":             "ab-initio",
};

const ERROR_STRINGS: Record<string, string> = {
  "0":    "No Error",
  "101":  "General Exception",
  "102":  "General Initialization Failure",
  "103":  "Already Initialized",
  "104":  "Content Instance Terminated",
  "111":  "General Termination Failure",
  "112":  "Termination Before Initialization",
  "113":  "Termination After Termination",
  "122":  "Retrieve Data Before Initialization",
  "123":  "Retrieve Data After Termination",
  "132":  "Store Data Before Initialization",
  "133":  "Store Data After Termination",
  "142":  "Commit Before Initialization",
  "143":  "Commit After Termination",
  "201":  "General Argument Error",
  "301":  "General Get Failure",
  "351":  "General Set Failure",
  "391":  "General Commit Failure",
  "401":  "Undefined Data Model Element",
  "402":  "Unimplemented Data Model Element",
  "403":  "Data Model Element Value Not Initialized",
  "404":  "Data Model Element Is Read Only",
  "405":  "Data Model Element Is Write Only",
  "406":  "Data Model Element Type Mismatch",
  "407":  "Data Model Element Value Out Of Range",
  "408":  "Data Model Dependency Not Established",
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

// ── Component ──────────────────────────────────────────────────────────────

export default function Scorm2004Page() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [initialized, setInitialized] = useState(false);
  const logIdRef = useRef(0);

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
    let _data: Record<string, string> = { ...DEFAULT_DATA };
    let _initialized = false;
    let _terminated = false;
    let _errorCode = "0";

    const api: Scorm2004Api = {
      Initialize(param) {
        if (_terminated) {
          _errorCode = "104";
          addLog("Initialize", JSON.stringify(param), "false (terminated)", "error");
          return "false";
        }
        if (_initialized) {
          _errorCode = "103";
          addLog("Initialize", JSON.stringify(param), "false (already init)", "error");
          return "false";
        }
        _initialized = true;
        _data = { ...DEFAULT_DATA };
        _errorCode = "0";
        setInitialized(true);
        addLog("Initialize", JSON.stringify(param), "true", "init");
        return "true";
      },

      Terminate(param) {
        if (!_initialized) {
          _errorCode = "112";
          addLog("Terminate", JSON.stringify(param), "false (not initialized)", "error");
          return "false";
        }
        _initialized = false;
        _terminated = true;
        _errorCode = "0";
        setInitialized(false);
        addLog("Terminate", JSON.stringify(param), "true", "finish");
        return "true";
      },

      GetValue(element) {
        if (!_initialized) {
          _errorCode = "122";
          addLog("GetValue", element, "ERROR:122", "error");
          return "";
        }
        const value = _data[element] ?? "";
        _errorCode = "0";
        addLog("GetValue", element, JSON.stringify(value), "get");
        return value;
      },

      SetValue(element, value) {
        if (!_initialized) {
          _errorCode = "132";
          addLog("SetValue", `${element} = ${JSON.stringify(value)}`, "ERROR:132", "error");
          return "false";
        }
        _data[element] = value;
        _errorCode = "0";
        addLog("SetValue", `${element} = ${JSON.stringify(value)}`, "true", "set");
        return "true";
      },

      Commit(param) {
        if (!_initialized) {
          _errorCode = "142";
          addLog("Commit", JSON.stringify(param), "ERROR:142", "error");
          return "false";
        }
        _errorCode = "0";
        addLog("Commit", JSON.stringify(param), "true (synced)", "commit");
        return "true";
      },

      GetLastError() {
        addLog("GetLastError", "", _errorCode, "info");
        return _errorCode;
      },

      GetErrorString(errorCode) {
        const msg = ERROR_STRINGS[errorCode] ?? "Unknown Error";
        addLog("GetErrorString", errorCode, msg, "info");
        return msg;
      },

      GetDiagnostic(errorCode) {
        const msg = ERROR_STRINGS[errorCode] ?? "Unknown Error";
        addLog("GetDiagnostic", errorCode, msg, "info");
        return msg;
      },
    };

    window.API_1484_11 = api;
    addLog("window.API_1484_11", "installed", "ready", "info");

    return () => {
      delete (window as unknown as { API_1484_11?: Scorm2004Api }).API_1484_11;
      addLog("window.API_1484_11", "cleanup", "removed", "info");
    };
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-zinc-800">
        <Link href="/" className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm">
          ← 홈
        </Link>
        <div className="w-px h-4 bg-zinc-700" />
        <h1 className="font-semibold text-sm">SCORM 2004 테스트</h1>
        <span className="text-xs text-zinc-600 ml-1">(경량)</span>
        <div
          className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${
            initialized ? "bg-emerald-900/50 text-emerald-300" : "bg-zinc-800 text-zinc-500"
          }`}
        >
          {initialized ? "● 초기화됨" : "○ 대기중"}
        </div>
      </header>

      {/* Main layout */}
      <div className="flex flex-1 min-h-0" style={{ height: "calc(100vh - 65px)" }}>
        {/* Left: iframe */}
        <div className="flex-1 border-r border-zinc-800 bg-white">
          <iframe
            src="/scorm2004/index.html"
            sandbox="allow-scripts allow-same-origin allow-forms"
            className="w-full h-full border-0"
            title="SCORM 2004 Content"
          />
        </div>

        {/* Right: log */}
        <div className="w-96 flex flex-col bg-zinc-900">
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">API 로그</span>
            <button
              onClick={() => setLogs([])}
              className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              지우기
            </button>
          </div>
          <div className="flex-1 overflow-y-auto font-mono text-xs p-3 space-y-1">
            {logs.length === 0 ? (
              <p className="text-zinc-700 text-center pt-4">콘텐츠가 로드되면 로그가 표시됩니다.</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex gap-2 items-start leading-5">
                  <span className="text-zinc-700 shrink-0 w-16">{log.ts}</span>
                  <span className={`shrink-0 w-28 ${LOG_TYPE_COLORS[log.type]}`}>{log.fn}</span>
                  <span className="text-zinc-500 truncate min-w-0" title={`args: ${log.args} → ${log.result}`}>
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
