"use client";

import { X } from "lucide-react";
import ProfileTab from "../../user-profile/feature";
import { users } from "../../users/mockData";

interface Props {
  userId: string | null;
  onClose: () => void;
}

export default function UserDrawer({ userId, onClose }: Props) {
  if (!userId) return null;

  const user = users.find((u) => u.id === userId) ?? users[0];

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/30"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 z-50 h-full w-[480px] bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
          <span className="text-sm font-semibold text-slate-700">학습자 상세</span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <ProfileTab user={user} />
        </div>
      </div>
    </>
  );
}
