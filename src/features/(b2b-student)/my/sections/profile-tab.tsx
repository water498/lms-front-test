"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";

export function ProfileTab() {
  const [bio, setBio] = useState("개발팀 시니어 엔지니어. 백엔드와 인프라에 관심이 많습니다.");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-lg flex flex-col gap-6">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-violet-600 flex items-center justify-center text-2xl font-bold text-white shrink-0">
          홍
        </div>
        <div>
          <p className="text-sm font-semibold text-white">홍길동</p>
          <p className="text-xs text-zinc-500">hong@acme.com</p>
          <p className="text-xs text-zinc-600 mt-0.5">개발팀 · 시니어 엔지니어</p>
        </div>
      </div>

      {/* SSO notice */}
      <div className="flex items-start gap-3 bg-amber-950/30 border border-amber-900/40 rounded-xl px-4 py-3.5">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-300 leading-relaxed">
          이름과 이메일은 회사 계정(Azure AD)에서 관리됩니다. 변경이 필요하면 IT 팀에 문의하세요.
        </p>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-400">이름</label>
          <input
            type="text"
            value="홍길동"
            disabled
            className="bg-zinc-900/50 border border-zinc-700/50 rounded-xl px-4 py-2.5 text-sm text-zinc-500 cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-400">이메일</label>
          <input
            type="email"
            value="hong@acme.com"
            disabled
            className="bg-zinc-900/50 border border-zinc-700/50 rounded-xl px-4 py-2.5 text-sm text-zinc-500 cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-400">부서</label>
          <input
            type="text"
            value="개발팀"
            disabled
            className="bg-zinc-900/50 border border-zinc-700/50 rounded-xl px-4 py-2.5 text-sm text-zinc-500 cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-400">직책</label>
          <input
            type="text"
            value="시니어 엔지니어"
            disabled
            className="bg-zinc-900/50 border border-zinc-700/50 rounded-xl px-4 py-2.5 text-sm text-zinc-500 cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-400">자기소개</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors resize-none"
          />
        </div>

        <button
          onClick={handleSave}
          className={`py-3 rounded-xl font-semibold text-sm transition-colors ${
            saved
              ? "bg-emerald-600 text-white"
              : "bg-violet-600 hover:bg-violet-500 text-white"
          }`}
        >
          {saved ? "✓ 저장되었습니다" : "저장하기"}
        </button>
      </div>
    </div>
  );
}
