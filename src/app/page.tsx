import Link from "next/link";

const apps: { href: string; title: string; description: string }[] = [
  {
    href: "/platform-admin",
    title: "OpenKnock 슈퍼어드민",
    description: "Control Plane — 전체 테넌트(B2C·B2B) 생성·플랜·SSO·인프라 생명주기 관리 내부툴",
  },
  {
    href: "/admin",
    title: "Tenant 관리자(B2B)",
    description: "ORG_ADMIN 멀티페이지 관리자 대시보드 (과정·유저·수강·설정)",
  },
  {
    href: "/instructor",
    title: "강사 포털",
    description: "강사 전용 대시보드 — 담당 차수·리뷰·정산·계좌 관리",
  },
  {
    href: "/student",
    title: "통합 수강생 (B2C/B2B 토글)",
    description: "TenantContext feature flag 기반 — dev switcher로 B2C/B2B 전환",
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
          LMS 프로토타입 — 각 역할별 진입점
        </p>

        {apps.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-400 text-sm">
            아직 등록된 앱이 없습니다.
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {apps.map((exp) => (
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
