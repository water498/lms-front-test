"use client";

import { useState } from "react";
import { INITIAL_SETTINGS, type PlanConfig } from "../mockData";

function PlanRow({
  config,
  onChange,
}: {
  config: PlanConfig;
  onChange: (updated: PlanConfig) => void;
}) {
  const isEnterprise = config.id === "ENTERPRISE";

  return (
    <div className="grid grid-cols-5 gap-3 items-center py-3 border-b border-slate-100 last:border-0">
      <div>
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            config.id === "ENTERPRISE"
              ? "bg-violet-100 text-violet-700"
              : config.id === "GROWTH"
                ? "bg-blue-100 text-blue-700"
                : "bg-slate-100 text-slate-600"
          }`}
        >
          {config.id}
        </span>
      </div>
      <div className="flex flex-col gap-0.5">
        <label className="text-xs text-slate-400">최대 사용자</label>
        {isEnterprise ? (
          <span className="text-sm text-slate-400 italic">무제한</span>
        ) : (
          <input
            type="number"
            min={1}
            className="border border-slate-200 rounded px-2 py-1 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={config.maxUsers}
            onChange={(e) =>
              onChange({ ...config, maxUsers: Number(e.target.value) })
            }
          />
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <label className="text-xs text-slate-400">저장 용량 (GB)</label>
        {isEnterprise ? (
          <span className="text-sm text-slate-400 italic">무제한</span>
        ) : (
          <input
            type="number"
            min={1}
            className="border border-slate-200 rounded px-2 py-1 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={config.storageGB}
            onChange={(e) =>
              onChange({ ...config, storageGB: Number(e.target.value) })
            }
          />
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <label className="text-xs text-slate-400">월 요금 (원)</label>
        {isEnterprise ? (
          <span className="text-sm text-slate-400 italic">커스텀</span>
        ) : (
          <input
            type="number"
            min={0}
            step={10000}
            className="border border-slate-200 rounded px-2 py-1 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={config.monthlyKRW}
            onChange={(e) =>
              onChange({ ...config, monthlyKRW: Number(e.target.value) })
            }
          />
        )}
      </div>
      <div className="text-xs text-slate-400">
        {isEnterprise ? "직접 협의" : `${config.monthlyKRW.toLocaleString()}원/월`}
      </div>
    </div>
  );
}

export default function PlansTab() {
  const [configs, setConfigs] = useState<PlanConfig[]>(
    INITIAL_SETTINGS.plans.configs,
  );
  const [trialDays, setTrialDays] = useState(INITIAL_SETTINGS.plans.trialDays);

  const updateConfig = (updated: PlanConfig) => {
    setConfigs((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleSave = () => {
    alert("플랜 설정 저장\n(실험 환경 — store 반영 없음)");
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
          플랜 구성
        </h4>
        <div>
          {configs.map((c) => (
            <PlanRow key={c.id} config={c} onChange={updateConfig} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5 max-w-xs">
        <label className="text-xs font-medium text-slate-600">
          트라이얼 기간 (일)
        </label>
        <input
          type="number"
          min={1}
          max={90}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-32"
          value={trialDays}
          onChange={(e) => setTrialDays(Number(e.target.value))}
        />
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
        >
          저장
        </button>
      </div>
    </div>
  );
}
