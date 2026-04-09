"use client";

import { useState } from "react";
import { Mail, RotateCcw, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function StudentVerifyEmailFeature() {
  const [resent, setResent] = useState(false);
  // Mock email — 실제로는 URL query param 또는 store에서 가져옴
  const email = "hello@example.com";

  const handleResend = () => {
    setResent(true);
    setTimeout(() => setResent(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          {/* Icon */}
          <div className="w-14 h-14 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <Mail className="w-7 h-7 text-violet-600" />
          </div>

          <h1 className="text-xl font-bold text-slate-900 mb-2">이메일을 확인해 주세요</h1>
          <p className="text-sm text-slate-500 mb-1">
            인증 링크를 발송했습니다.
          </p>
          <p className="text-sm font-medium text-slate-800 mb-6">{email}</p>

          <p className="text-xs text-slate-400 mb-5">
            메일이 오지 않았나요? 스팸 폴더를 확인하거나<br />
            아래 버튼으로 재발송해 주세요.
          </p>

          <button
            onClick={handleResend}
            disabled={resent}
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 mb-6"
          >
            {resent ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                재발송 완료
              </>
            ) : (
              <>
                <RotateCcw className="w-4 h-4" />
                인증 메일 재발송
              </>
            )}
          </button>

          <div className="border-t border-slate-100 pt-5">
            <Link href="/student/login" className="text-sm text-violet-600 hover:text-violet-700 font-medium transition-colors">
              로그인으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
