"use client";

import { useState } from "react";
import { INITIAL_SETTINGS } from "../mockData";

export default function NotificationsTab() {
  const init = INITIAL_SETTINGS.notifications;
  const [trialWarningDays, setTrialWarningDays] = useState(init.trialExpiryWarningDays);
  const [storageThreshold, setStorageThreshold] = useState(init.storageThresholdPct);
  const [userThreshold, setUserThreshold] = useState(init.userThresholdPct);
  const [emailAlerts, setEmailAlerts] = useState(init.emailAlertsEnabled);
  const [slackWebhook, setSlackWebhook] = useState(init.slackWebhookUrl);

  const handleSave = () => {
    if (slackWebhook) {
      alert(`Slack Webhook URL 저장 요청: ${slackWebhook}\n(실험 환경 — 실제 저장 없음)`);
    } else {
      alert("알림 설정 저장\n(실험 환경 — store 반영 없음)");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-x-8 gap-y-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-600">
            트라이얼 만료 경고 (일 전)
          </label>
          <input
            type="number"
            min={1}
            max={30}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-32"
            value={trialWarningDays}
            onChange={(e) => setTrialWarningDays(Number(e.target.value))}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-600">
            스토리지 임계값 (%)
          </label>
          <input
            type="number"
            min={50}
            max={99}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-32"
            value={storageThreshold}
            onChange={(e) => setStorageThreshold(Number(e.target.value))}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-600">
            사용자 임계값 (%)
          </label>
          <input
            type="number"
            min={50}
            max={99}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-32"
            value={userThreshold}
            onChange={(e) => setUserThreshold(Number(e.target.value))}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-600">
            Slack Webhook URL
          </label>
          <input
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="https://hooks.slack.com/services/..."
            value={slackWebhook}
            onChange={(e) => setSlackWebhook(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between py-3 border-t border-slate-100">
        <div>
          <p className="text-sm font-medium text-slate-700">이메일 알림 활성화</p>
          <p className="text-xs text-slate-400 mt-0.5">
            트라이얼 만료, 스토리지·사용자 임계값 초과 시 운영 이메일로 알림 발송
          </p>
        </div>
        <button
          onClick={() => setEmailAlerts((v) => !v)}
          className={`relative rounded-full transition-colors ${
            emailAlerts ? "bg-blue-600" : "bg-slate-200"
          }`}
          style={{ height: "22px", width: "40px" }}
        >
          <span
            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
              emailAlerts ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
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
