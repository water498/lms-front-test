"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useStudentAuthStore } from "@/features/(student)/shared/auth-store";

type State = "loading" | "error";

export default function StudentSsoCallbackFeature() {
  const router = useRouter();
  const { login } = useStudentAuthStore();
  const [state, setState] = useState<State>("loading");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "true") {
      setState("error");
    } else {
      setTimeout(() => {
        login();
        router.push("/student");
      }, 1000);
    }
  }, [login, router]);

  if (state === "error") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <AlertCircle className="w-7 h-7 text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">로그인에 실패했습니다</h2>
            <p className="text-sm text-slate-500 mb-7">
              SSO 인증 중 오류가 발생했습니다.<br />
              잠시 후 다시 시도해 주세요.
            </p>
            <Link
              href="/student/login"
              className="inline-block w-full py-2.5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors text-center"
            >
              로그인으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-medium text-slate-700">로그인 처리 중...</p>
        <p className="text-xs text-slate-400 mt-1">잠시만 기다려 주세요</p>
      </div>
    </div>
  );
}
