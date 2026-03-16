"use client";

import { useState } from "react";

interface Props {
  certNumber: string;
  recipient: string;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

export default function RevokeModal({ certNumber, recipient, onConfirm, onCancel }: Props) {
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 flex flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-800">수료증 취소</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {recipient}님의 {certNumber} 수료증을 취소합니다.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-600">
            취소 사유 <span className="text-red-500">*</span>
          </label>
          <textarea
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-400"
            rows={3}
            placeholder="취소 사유를 입력하세요"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
          >
            닫기
          </button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={!reason.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            취소 처리
          </button>
        </div>
      </div>
    </div>
  );
}
