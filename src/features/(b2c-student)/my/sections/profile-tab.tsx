"use client";

import { useState } from "react";

export function ProfileTab() {
  const [name, setName] = useState("홍길동");
  const [email, setEmail] = useState("hong@example.com");
  const [bio, setBio] = useState("풀스택 개발자를 목표로 열심히 공부 중입니다.");
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
          <p className="text-sm font-semibold text-white">{name}</p>
          <p className="text-xs text-zinc-500">{email}</p>
          <button className="mt-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors">
            프로필 사진 변경
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-400">이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-400">이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
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

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-400">비밀번호 변경</label>
          <input
            type="password"
            placeholder="새 비밀번호"
            className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors"
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
