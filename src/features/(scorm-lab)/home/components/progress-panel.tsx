"use client";

import type { ChecklistState, LogEntry, LogType } from "../scorm-runtime";
import type { ScormVersion } from "../manifest-parser";
import { useState } from "react";

interface Props {
  version: ScormVersion;
  data: Record<string, string>;
  checklist: ChecklistState;
  logs: LogEntry[];
  lastSaved: string | null;
  onReset: () => void;
}

// ── Status helpers ─────────────────────────────────────────────────────────

function getLessonStatus(version: ScormVersion, data: Record<string, string>): string {
  if (version === "1.2") return data["cmi.core.lesson_status"] ?? "not attempted";
  const c = data["cmi.completion_status"] ?? "not attempted";
  const s = data["cmi.success_status"] ?? "unknown";
  if (s === "passed") return "passed";
  if (s === "failed") return "failed";
  return c;
}

const STATUS_LABELS: Record<string, string> = {
  "not attempted": "미시작",
  incomplete: "진행중",
  completed: "완료",
  passed: "통과",
  failed: "실패",
  unknown: "알 수 없음",
  browsed: "열람",
};

const STATUS_COLORS: Record<string, string> = {
  "not attempted": "bg-zinc-100 text-zinc-500",
  incomplete: "bg-amber-100 text-amber-700",
  completed: "bg-emerald-100 text-emerald-700",
  passed: "bg-emerald-100 text-emerald-700",
  failed: "bg-red-100 text-red-700",
  unknown: "bg-zinc-100 text-zinc-500",
  browsed: "bg-blue-100 text-blue-700",
};

const LOG_COLORS: Record<LogType, string> = {
  init: "text-emerald-600",
  finish: "text-rose-600",
  get: "text-sky-600",
  set: "text-amber-600",
  commit: "text-violet-600",
  error: "text-red-600",
  info: "text-zinc-400",
};

export default function ProgressPanel({
  version, data, checklist, logs, lastSaved, onReset,
}: Props) {
  const [logOpen, setLogOpen] = useState(false);

  const status = getLessonStatus(version, data);
  const statusLabel = STATUS_LABELS[status] ?? status;
  const statusColor = STATUS_COLORS[status] ?? "bg-zinc-100 text-zinc-500";

  const score =
    version === "1.2"
      ? data["cmi.core.score.raw"]
      : data["cmi.score.raw"];
  const scoreMax =
    version === "1.2"
      ? data["cmi.core.score.max"]
      : data["cmi.score.max"];
  const sessionTime =
    version === "1.2"
      ? data["cmi.core.session_time"]
      : data["cmi.session_time"];
  const suspendData =
    data["cmi.suspend_data"] ?? "";

  const checklist12 = [
    { label: "세션 시작됨", ok: checklist.sessionStarted, desc: "LMSInitialize 호출" },
    { label: "데이터 저장됨", ok: checklist.dataWritten, desc: "LMSSetValue 호출" },
    { label: "완료 신호 수신", ok: checklist.completionSignaled, desc: `lesson_status = ${getLessonStatus(version, data)}` },
    { label: "세션 정상 종료", ok: checklist.sessionEnded, desc: "LMSFinish 호출" },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Status */}
      <div className="p-4 border-b border-zinc-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">진행 상태</span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor}`}>
            {statusLabel}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-zinc-50 rounded-lg p-3">
            <div className="text-xs text-zinc-400 mb-0.5">점수</div>
            <div className="font-semibold text-zinc-800">
              {score ? `${score}${scoreMax ? ` / ${scoreMax}` : ""}` : "—"}
            </div>
          </div>
          <div className="bg-zinc-50 rounded-lg p-3">
            <div className="text-xs text-zinc-400 mb-0.5">학습 시간</div>
            <div className="font-semibold text-zinc-800 font-mono text-xs">
              {sessionTime || "—"}
            </div>
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="p-4 border-b border-zinc-200">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
          완료 조건 체크리스트
        </p>
        <div className="space-y-2">
          {checklist12.map((item) => (
            <div key={item.label} className="flex items-start gap-2">
              <span className={`mt-0.5 text-sm shrink-0 ${item.ok ? "text-emerald-500" : "text-zinc-300"}`}>
                {item.ok ? "✓" : "○"}
              </span>
              <div>
                <p className={`text-xs font-medium ${item.ok ? "text-zinc-700" : "text-zinc-400"}`}>
                  {item.label}
                </p>
                <p className="text-xs text-zinc-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 진단 메시지 */}
        {checklist.sessionEnded && !checklist.completionSignaled && (
          <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
            세션이 종료됐지만 완료 신호가 없습니다. iSpring 콘텐츠 설정에서 완료 조건을 확인하세요.
          </div>
        )}
        {checklist.completionSignaled && checklist.sessionEnded && (
          <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700">
            정상적으로 완료 처리됩니다.
          </div>
        )}
      </div>

      {/* Save status */}
      <div className="p-4 border-b border-zinc-200">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">저장 상태</p>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-zinc-500">마지막 저장</span>
            <span className="text-zinc-700 font-mono">
              {lastSaved ?? "—"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-500">suspend_data</span>
            <span className={`font-medium ${suspendData ? "text-emerald-600" : "text-zinc-400"}`}>
              {suspendData ? `저장됨 (${suspendData.length}자)` : "없음"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-500">SCORM 버전</span>
            <span className="text-zinc-700">SCORM {version}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-b border-zinc-200">
        <button
          onClick={onReset}
          className="w-full text-xs px-3 py-2 border border-zinc-300 rounded-lg text-zinc-600 hover:bg-zinc-50 transition-colors"
        >
          진행 초기화 (새로 시작)
        </button>
      </div>

      {/* Dev log toggle */}
      <div className="flex-1 flex flex-col min-h-0">
        <button
          onClick={() => setLogOpen((v) => !v)}
          className="flex items-center justify-between w-full px-4 py-2.5 text-xs text-zinc-400 hover:text-zinc-600 border-b border-zinc-200 transition-colors"
        >
          <span className="font-semibold uppercase tracking-wider">개발자 로그</span>
          <span>{logOpen ? "접기 ↑" : "펼치기 ↓"} ({logs.length}건)</span>
        </button>
        {logOpen && (
          <div className="flex-1 overflow-auto p-3 font-mono text-xs bg-zinc-50">
            {logs.length === 0 ? (
              <p className="text-zinc-400 text-center pt-3">로그 없음</p>
            ) : (
              <div className="space-y-0.5 min-w-max">
              {logs.map((log) => (
                <div key={log.id} className="flex gap-2 items-start leading-5 whitespace-nowrap">
                  <span className="text-zinc-400 shrink-0 w-16">{log.ts}</span>
                  <span className={`shrink-0 w-32 ${LOG_COLORS[log.type]}`}>{log.fn}</span>
                  <span className="text-zinc-500">
                    {log.args && <span className="text-zinc-400">{log.args} </span>}
                    <span className="text-zinc-600">→ {log.result}</span>
                  </span>
                </div>
              ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
