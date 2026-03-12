import Link from "next/link";

const experiments: { href: string; title: string; description: string }[] = [
  { href: "/experiments/scorm12",      title: "SCORM 1.2",   description: "Mock SCORM 1.2 API + iframe 연동 테스트" },
  { href: "/experiments/scorm2004",    title: "SCORM 2004",  description: "경량 SCORM 2004 API + iframe 테스트" },
  { href: "/experiments/student-home", title: "OTT 학생 홈", description: "Netflix 스타일 LMS 수강생 대시보드" },
  { href: "/experiments/video-player", title: "Video Player", description: "Video.js HLS/MP4 재생 + 법정의무교육 모드 실험" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 p-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">LMS Front Test</h1>
        <p className="text-zinc-500 mb-10 text-sm">실험용 Next.js 프로젝트 — 각 실험은 /experiments/ 하위 경로로 추가</p>

        {experiments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-400 text-sm">
            아직 실험이 없습니다. <code className="text-zinc-600">src/app/experiments/</code>에 폴더를 추가하세요.
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {experiments.map((exp) => (
              <li key={exp.href}>
                <Link
                  href={exp.href}
                  className="flex flex-col gap-1 rounded-xl border border-zinc-200 bg-white px-6 py-4 hover:border-zinc-400 transition-colors"
                >
                  <span className="font-medium text-zinc-900">{exp.title}</span>
                  <span className="text-sm text-zinc-500">{exp.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
