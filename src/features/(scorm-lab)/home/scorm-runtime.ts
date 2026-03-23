/**
 * scorm-runtime.ts
 * SCORM 1.2 + 2004 통합 런타임.
 * window.API (1.2) 또는 window.API_1484_11 (2004)를 설치하고,
 * 각 API 호출을 onUpdate 콜백으로 리액트 상태에 반영한다.
 */

import type { ScormVersion } from "./manifest-parser";

// ── Types ─────────────────────────────────────────────────────────────────

export type LogType = "init" | "get" | "set" | "commit" | "finish" | "error" | "info";

export interface LogEntry {
  id: number;
  ts: string;
  fn: string;
  args: string;
  result: string;
  type: LogType;
}

export interface ChecklistState {
  sessionStarted: boolean;
  dataWritten: boolean;      // SetValue 호출 여부
  completionSignaled: boolean; // lesson_status=completed/passed or completion_status=completed
  sessionEnded: boolean;     // LMSFinish / Terminate 호출
}

export interface RuntimeCallbacks {
  onDataUpdate: (data: Record<string, string>) => void;
  onLog: (entry: LogEntry) => void;
  onChecklist: (state: ChecklistState) => void;
  onSave: (data: Record<string, string>) => void; // commit 또는 finish 시 저장 트리거
}

// ── Default Data ──────────────────────────────────────────────────────────

export function getDefaultData12(
  learnerId: string,
  learnerName: string
): Record<string, string> {
  return {
    "cmi.core.student_id": learnerId,
    "cmi.core.student_name": learnerName,
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
}

export function getDefaultData2004(
  learnerId: string,
  learnerName: string
): Record<string, string> {
  return {
    "cmi.learner_id": learnerId,
    "cmi.learner_name": learnerName,
    "cmi.completion_status": "not attempted",
    "cmi.success_status": "unknown",
    "cmi.score.scaled": "",
    "cmi.score.raw": "",
    "cmi.score.min": "0",
    "cmi.score.max": "100",
    "cmi.session_time": "PT0S",
    "cmi.total_time": "PT0S",
    "cmi.location": "",
    "cmi.suspend_data": "",
    "cmi.entry": "ab-initio",
  };
}

// ── Error strings ─────────────────────────────────────────────────────────

const ERRORS_12: Record<string, string> = {
  "0": "No Error", "101": "General Exception", "201": "Invalid Argument Error",
  "202": "Element Cannot Have Children", "203": "Element Not an Array — Cannot Have Count",
  "301": "Not Initialized", "401": "Not Implemented Error",
  "402": "Invalid Set Value, Element is a Keyword", "403": "Element is Read Only",
  "404": "Element is Write Only", "405": "Incorrect Data Type",
};

const ERRORS_2004: Record<string, string> = {
  "0": "No Error", "101": "General Exception", "102": "General Initialization Failure",
  "103": "Already Initialized", "104": "Content Instance Terminated",
  "111": "General Termination Failure", "112": "Termination Before Initialization",
  "113": "Termination After Termination", "122": "Retrieve Data Before Initialization",
  "123": "Retrieve Data After Termination", "132": "Store Data Before Initialization",
  "133": "Store Data After Termination", "142": "Commit Before Initialization",
  "143": "Commit After Termination", "201": "General Argument Error",
  "301": "General Get Failure", "351": "General Set Failure",
  "391": "General Commit Failure", "401": "Undefined Data Model Element",
  "402": "Unimplemented Data Model Element", "403": "Data Model Element Value Not Initialized",
  "404": "Data Model Element Is Read Only", "405": "Data Model Element Is Write Only",
  "406": "Data Model Element Type Mismatch", "407": "Data Model Element Value Out Of Range",
  "408": "Data Model Dependency Not Established",
};

// ── Completion check ──────────────────────────────────────────────────────

function isCompleted12(data: Record<string, string>): boolean {
  const s = data["cmi.core.lesson_status"];
  return s === "completed" || s === "passed";
}

function isCompleted2004(data: Record<string, string>): boolean {
  return (
    data["cmi.completion_status"] === "completed" ||
    data["cmi.success_status"] === "passed"
  );
}

// ── Install SCORM 1.2 ─────────────────────────────────────────────────────

export function installScorm12(
  initialData: Record<string, string>,
  callbacks: RuntimeCallbacks
): () => void {
  let _data: Record<string, string> = { ...initialData };
  let _initialized = false;
  let _errorCode = "0";
  let _logId = 0;
  const checklist: ChecklistState = {
    sessionStarted: false,
    dataWritten: false,
    completionSignaled: false,
    sessionEnded: false,
  };

  const ts = () =>
    new Date().toLocaleTimeString("ko-KR", { hour12: false });

  const addLog = (fn: string, args: string, result: string, type: LogType) => {
    callbacks.onLog({
      id: ++_logId,
      ts: ts(),
      fn,
      args,
      result,
      type,
    });
  };

  const notifyChecklist = () => callbacks.onChecklist({ ...checklist });

  const api = {
    LMSInitialize(param: string): "true" | "false" {
      if (_initialized) {
        _errorCode = "101";
        addLog("LMSInitialize", param, "false (already init)", "error");
        return "false";
      }
      _initialized = true;
      _errorCode = "0";
      checklist.sessionStarted = true;
      notifyChecklist();
      callbacks.onDataUpdate({ ..._data });
      addLog("LMSInitialize", param, "true", "init");
      return "true";
    },
    LMSFinish(param: string): "true" | "false" {
      _initialized = false;
      _errorCode = "0";
      checklist.sessionEnded = true;
      checklist.completionSignaled = checklist.completionSignaled || isCompleted12(_data);
      notifyChecklist();
      callbacks.onSave({ ..._data });
      addLog("LMSFinish", param, "true", "finish");
      return "true";
    },
    LMSGetValue(element: string): string {
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
    LMSSetValue(element: string, value: string): "true" | "false" {
      if (!_initialized) {
        _errorCode = "301";
        addLog("LMSSetValue", `${element}=${JSON.stringify(value)}`, "ERROR:301", "error");
        return "false";
      }
      _data[element] = value;
      _errorCode = "0";
      checklist.dataWritten = true;
      if (element === "cmi.core.lesson_status" && isCompleted12(_data)) {
        checklist.completionSignaled = true;
      }
      notifyChecklist();
      callbacks.onDataUpdate({ ..._data });
      addLog("LMSSetValue", `${element}=${JSON.stringify(value)}`, "true", "set");
      return "true";
    },
    LMSCommit(param: string): "true" | "false" {
      if (!_initialized) {
        _errorCode = "301";
        addLog("LMSCommit", param, "ERROR:301", "error");
        return "false";
      }
      _errorCode = "0";
      callbacks.onSave({ ..._data });
      addLog("LMSCommit", param, "true (saved)", "commit");
      return "true";
    },
    LMSGetLastError(): string {
      addLog("LMSGetLastError", "", _errorCode, "info");
      return _errorCode;
    },
    LMSGetErrorString(errorCode: string): string {
      const msg = ERRORS_12[errorCode] ?? "Unknown Error";
      addLog("LMSGetErrorString", errorCode, msg, "info");
      return msg;
    },
    LMSGetDiagnostic(errorCode: string): string {
      const msg = ERRORS_12[errorCode] ?? "Unknown Error";
      addLog("LMSGetDiagnostic", errorCode, msg, "info");
      return msg;
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).API = api;
  addLog("window.API", "installed", "SCORM 1.2 ready", "info");

  return () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).API;
  };
}

// ── Install SCORM 2004 ────────────────────────────────────────────────────

export function installScorm2004(
  initialData: Record<string, string>,
  callbacks: RuntimeCallbacks
): () => void {
  let _data: Record<string, string> = { ...initialData };
  let _initialized = false;
  let _terminated = false;
  let _errorCode = "0";
  let _logId = 0;
  const checklist: ChecklistState = {
    sessionStarted: false,
    dataWritten: false,
    completionSignaled: false,
    sessionEnded: false,
  };

  const ts = () =>
    new Date().toLocaleTimeString("ko-KR", { hour12: false });

  const addLog = (fn: string, args: string, result: string, type: LogType) => {
    callbacks.onLog({ id: ++_logId, ts: ts(), fn, args, result, type });
  };

  const notifyChecklist = () => callbacks.onChecklist({ ...checklist });

  const api = {
    Initialize(param: string): "true" | "false" {
      if (_terminated) { _errorCode = "104"; addLog("Initialize", param, "false (terminated)", "error"); return "false"; }
      if (_initialized) { _errorCode = "103"; addLog("Initialize", param, "false (already init)", "error"); return "false"; }
      _initialized = true; _errorCode = "0";
      checklist.sessionStarted = true;
      notifyChecklist();
      callbacks.onDataUpdate({ ..._data });
      addLog("Initialize", param, "true", "init");
      return "true";
    },
    Terminate(param: string): "true" | "false" {
      if (!_initialized) { _errorCode = "112"; addLog("Terminate", param, "false (not init)", "error"); return "false"; }
      _initialized = false; _terminated = true; _errorCode = "0";
      checklist.sessionEnded = true;
      checklist.completionSignaled = checklist.completionSignaled || isCompleted2004(_data);
      notifyChecklist();
      callbacks.onSave({ ..._data });
      addLog("Terminate", param, "true", "finish");
      return "true";
    },
    GetValue(element: string): string {
      if (!_initialized) { _errorCode = "122"; addLog("GetValue", element, "ERROR:122", "error"); return ""; }
      const value = _data[element] ?? "";
      _errorCode = "0";
      addLog("GetValue", element, JSON.stringify(value), "get");
      return value;
    },
    SetValue(element: string, value: string): "true" | "false" {
      if (!_initialized) { _errorCode = "132"; addLog("SetValue", `${element}=${JSON.stringify(value)}`, "ERROR:132", "error"); return "false"; }
      _data[element] = value;
      _errorCode = "0";
      checklist.dataWritten = true;
      if ((element === "cmi.completion_status" || element === "cmi.success_status") && isCompleted2004(_data)) {
        checklist.completionSignaled = true;
      }
      notifyChecklist();
      callbacks.onDataUpdate({ ..._data });
      addLog("SetValue", `${element}=${JSON.stringify(value)}`, "true", "set");
      return "true";
    },
    Commit(param: string): "true" | "false" {
      if (!_initialized) { _errorCode = "142"; addLog("Commit", param, "ERROR:142", "error"); return "false"; }
      _errorCode = "0";
      callbacks.onSave({ ..._data });
      addLog("Commit", param, "true (saved)", "commit");
      return "true";
    },
    GetLastError(): string { addLog("GetLastError", "", _errorCode, "info"); return _errorCode; },
    GetErrorString(errorCode: string): string {
      const msg = ERRORS_2004[errorCode] ?? "Unknown Error";
      addLog("GetErrorString", errorCode, msg, "info");
      return msg;
    },
    GetDiagnostic(errorCode: string): string {
      const msg = ERRORS_2004[errorCode] ?? "Unknown Error";
      addLog("GetDiagnostic", errorCode, msg, "info");
      return msg;
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).API_1484_11 = api;
  addLog("window.API_1484_11", "installed", "SCORM 2004 ready", "info");

  return () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).API_1484_11;
  };
}
