"use client";

import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";

interface Props {
  onClose: () => void;
}

function generateTempPassword() {
  const chars = "ABCDEFGHJKMNPQRSTWXYZabcdefghjkmnpqrstwxyz23456789";
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export default function CreateInstructorModal({ onClose }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tempPassword] = useState(generateTempPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [created, setCreated] = useState(false);

  if (created) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
            <h2 className="text-base font-semibold text-slate-800">강사 계정이 생성되었습니다</h2>
            <p className="text-sm text-slate-500">
              <span className="font-medium text-slate-700">{name}</span>님의 계정이 생성되었습니다.<br />
              임시 비밀번호를 강사에게 전달하세요.
            </p>
            <div className="w-full bg-slate-50 rounded-lg px-4 py-3 text-sm font-mono text-slate-700 border border-slate-200">
              {tempPassword}
            </div>
            <p className="text-xs text-slate-400">첫 로그인 시 비밀번호 변경을 요구합니다.</p>
          </div>
          <button
            onClick={onClose}
            className="w-full mt-5 px-4 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-slate-800">강사 계정 생성</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          강사는 별도 가입 없이 관리자가 직접 생성합니다. 임시 비밀번호가 자동 발급됩니다.
        </p>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">이름</label>
            <input
              type="text"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              placeholder="홍길동"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">이메일</label>
            <input
              type="email"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              placeholder="instructor@acme.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">임시 비밀번호 (자동 생성)</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-500 font-mono pr-10"
                value={tempPassword}
                readOnly
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
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
            onClick={() => { if (name && email) setCreated(true); }}
            disabled={!name || !email}
            className="px-4 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            계정 생성
          </button>
        </div>
      </div>
    </div>
  );
}
