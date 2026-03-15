"use client";

import { useState } from "react";
import { adminMembers, type AdminMember } from "../mockData";

const PERM_CONFIG: Record<AdminMember["permission"], { label: string; className: string }> = {
  OWNER: { label: "소유자", className: "bg-amber-100 text-amber-700" },
  ADMIN: { label: "관리자", className: "bg-violet-100 text-violet-700" },
};

export default function MembersTab() {
  const [members, setMembers] = useState(adminMembers);
  const [inviteEmail, setInviteEmail] = useState("");
  const [showInvite, setShowInvite] = useState(false);

  const remove = (id: string) => setMembers((prev) => prev.filter((m) => m.id !== id));
  const invite = () => {
    if (!inviteEmail) return;
    setInviteEmail("");
    setShowInvite(false);
  };

  return (
    <div className="max-w-2xl flex flex-col gap-4">
      <div className="bg-white rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 border-b border-slate-100">
              <th className="text-left px-5 py-3 font-medium">이름 / 이메일</th>
              <th className="text-left px-4 py-3 font-medium">권한</th>
              <th className="text-left px-4 py-3 font-medium">초대일</th>
              <th className="text-left px-4 py-3 font-medium">액션</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => {
              const perm = PERM_CONFIG[m.permission];
              return (
                <tr key={m.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-3">
                    <p className="font-medium text-slate-800">{m.name}</p>
                    <p className="text-xs text-slate-400">{m.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${perm.className}`}>
                      {perm.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{m.invitedAt}</td>
                  <td className="px-4 py-3">
                    {m.permission !== "OWNER" && (
                      <button
                        onClick={() => remove(m.id)}
                        className="text-xs px-2 py-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        제거
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showInvite ? (
        <div className="flex items-center gap-2">
          <input
            type="email"
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 flex-1 max-w-xs"
            placeholder="admin@acme.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
          <button
            onClick={invite}
            className="px-4 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
          >
            초대
          </button>
          <button
            onClick={() => setShowInvite(false)}
            className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            취소
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowInvite(true)}
          className="self-start px-4 py-2 text-sm text-violet-600 border border-violet-200 rounded-lg hover:bg-violet-50 transition-colors"
        >
          + 관리자 추가
        </button>
      )}
    </div>
  );
}
