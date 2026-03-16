"use client";

interface Props {
  certNumber: string;
  recipient: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ReissueModal({ certNumber, recipient, onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 flex flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-800">수료증 재발급</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {recipient}님의 {certNumber} 수료증을 재발급합니다.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-700">
          재발급 시 최초 발급일은 유지되며, 재발급일이 별도 기록됩니다.
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
          >
            닫기
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
          >
            재발급
          </button>
        </div>
      </div>
    </div>
  );
}
