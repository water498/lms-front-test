"use client";

import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import { useImpersonationStore } from "./impersonation-store";
import { useUsersStore } from "./users-store";

export default function StudentImpersonationBanner() {
  const { impersonatingUserId, stop } = useImpersonationStore();
  const { users } = useUsersStore();
  const router = useRouter();

  if (!impersonatingUserId) return null;

  const user = users.find((u) => u.id === impersonatingUserId);
  if (!user) return null;

  function handleExit() {
    stop();
    router.push(`/admin/users/${impersonatingUserId}`);
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-9 bg-violet-600 flex items-center px-4 gap-2">
      <Eye size={13} className="text-violet-200 flex-shrink-0" />
      <span className="text-xs text-white font-medium">
        관리자 미리보기 모드
      </span>
      <span className="text-violet-300 select-none">|</span>
      <span className="text-xs text-violet-200">
        {user.name} ({user.email})
      </span>
      <div className="ml-auto">
        <button
          onClick={handleExit}
          className="text-xs text-violet-200 hover:text-white font-medium underline underline-offset-2 transition-colors"
        >
          관리자로 돌아가기 →
        </button>
      </div>
    </div>
  );
}
