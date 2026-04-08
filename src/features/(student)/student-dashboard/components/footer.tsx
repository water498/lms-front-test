import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/50 mt-16">
      <div className="max-w-screen-xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-start gap-8 justify-between">
          <div>
            <p className="text-lg font-bold text-white mb-2">
              롯데건설
            </p>
            <p className="text-xs text-zinc-600 max-w-xs leading-relaxed">
              LMS 플랫폼 개발 전 UI/UX 프로토타입 실험 페이지입니다.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div className="flex flex-col gap-2">
              <p className="text-zinc-400 font-medium mb-1">서비스</p>
              <Link href="/experiments/student/search" className="text-zinc-600 hover:text-zinc-400 transition-colors">강의 탐색</Link>
              <Link href="/experiments/student/announcements" className="text-zinc-600 hover:text-zinc-400 transition-colors">공지사항</Link>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-zinc-400 font-medium mb-1">약관</p>
              <Link href="/experiments/student/terms" className="text-zinc-600 hover:text-zinc-400 transition-colors">이용약관</Link>
              <Link href="/experiments/student/terms?tab=privacy" className="text-zinc-600 hover:text-zinc-400 transition-colors">개인정보처리방침</Link>
              <Link href="/experiments/student/terms?tab=policy" className="text-zinc-600 hover:text-zinc-400 transition-colors">운영정책</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-zinc-800/50 mt-8 pt-6 flex items-center justify-between">
          <p className="text-xs text-zinc-700">© 2026 롯데건설. LMS Front Test Prototype.</p>
          <Link href="/" className="text-xs text-zinc-700 hover:text-zinc-500 transition-colors">
            ← 실험 목록으로
          </Link>
        </div>
      </div>
    </footer>
  );
}
