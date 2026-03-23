import Link from "next/link";

const experiments: { href: string; title: string; description: string }[] = [
  {
    href: "/experiments/platform-admin",
    title: "🌐 OpenKnock 관리자(B2C + B2B)",
    description: "Platform Admin — B2B 기업 온보딩·테넌트 관리 내부 운영툴",
  },
  {
    href: "/experiments/admin",
    title: "🌐 Tenant 관리자(B2B)",
    description: "ORG_ADMIN 멀티페이지 관리자 대시보드 (과정·유저·수강·설정)",
  },
  {
    href: "/experiments/b2c-student",
    title: "🌐 B2C 수강생",
    description: "Netflix 스타일 LMS 수강생 대시보드 (B2C)",
  },
  {
    href: "/experiments/b2b-student",
    title: "🌐 B2B 수강생",
    description: "기업 LMS 수강생 대시보드 (B2B · SSO 테넌트)",
  },
  {
    href: "/experiments/scorm-lab",
    title: "iSpring SCORM 테스트👩🏻‍🎓",
    description: "ZIP 업로드 · 진행률 저장/재개 · 완료 조건 진단 (비개발자용)",
  },
  {
    href: "/experiments/scorm12",
    title: "SCORM 1.2",
    description: "Mock SCORM 1.2 API + iframe 연동 테스트",
  },
  {
    href: "/experiments/scorm2004",
    title: "SCORM 2004",
    description: "경량 SCORM 2004 API + iframe 테스트",
  },
  {
    href: "/experiments/video-player",
    title: "Video Player",
    description: "Video.js HLS/MP4 재생 + 법정의무교육 모드 실험",
  },
  {
    href: "/experiments/scorm-cdn-arch",
    title: "SCORM CDN 아키텍처",
    description: "CDN 서빙 구조, cross-origin 이슈, S3 CORS 전략 리서치 노트",
  },
  {
    href: "/experiments/scorm-api-ref",
    title: "SCORM API 레퍼런스",
    description: "SCORM 1.2 / 2004 API 함수·CMI 필드·에러 코드 비교 정리",
  },
  {
    href: "/experiments/scorm-session-arch",
    title: "SCORM 세션 아키텍처",
    description: "어댑터 레이어 · Redis 세션 버퍼 · 정규화 모델",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 p-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">
          LMS Front Test
        </h1>
        <p className="text-zinc-500 mb-10 text-sm">
          실험용 Next.js 프로젝트 — 각 실험은 /experiments/ 하위 경로로 추가
        </p>

        {experiments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-400 text-sm">
            아직 실험이 없습니다.{" "}
            <code className="text-zinc-600">src/app/experiments/</code>에 폴더를
            추가하세요.
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
                  <span className="text-sm text-zinc-500">
                    {exp.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
