"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { UserRole } from "../mockData";

interface Props {
  onClose: () => void;
  defaultRole?: UserRole;
}

export default function InviteUserModal({ onClose, defaultRole = "LEARNER" }: Props) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>(defaultRole);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-slate-800">유저 초대</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">이메일</label>
            <input
              type="email"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              placeholder="user@acme.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">역할</label>
            <select
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
            >
              <option value="LEARNER">수강생</option>
              <option value="INSTRUCTOR">강사</option>
              <option value="ORG_ADMIN">관리자</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
          >
            초대 보내기
          </button>
        </div>
      </div>
    </div>
  );
}
