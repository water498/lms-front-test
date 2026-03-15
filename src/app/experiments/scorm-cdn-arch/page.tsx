export default function ScormCdnArchPage() {
  return (
    <main className="min-h-screen bg-zinc-50 p-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-xs text-zinc-400 mb-1">Research Note</p>
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">SCORM CDN 아키텍처</h1>
          <p className="text-zinc-500 text-sm">
            SCORM 콘텐츠를 CDN으로 서빙할 때의 파일 구조, cross-origin 이슈, 해결 전략 정리
          </p>
        </div>

        <div className="flex flex-col gap-8">

          {/* Section 1 — Upload Flow */}
          <section className="rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="font-semibold text-zinc-900 mb-4">1. 콘텐츠 업로드 흐름</h2>
            <ol className="flex flex-col gap-2 text-sm text-zinc-700">
              {[
                "관리자가 zip 파일 업로드",
                "서버에서 압축 해제",
                "S3 저장 — courses/{courseId}/index.html, data/...",
                "CloudFront CDN 배포",
                "LMS가 CDN URL을 iframe src로 사용",
                "SCORM 콘텐츠가 window.API 호출",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 text-xs flex items-center justify-center font-medium">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Section 2 — Cross-Origin */}
          <section className="rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="font-semibold text-zinc-900 mb-4">2. Cross-Origin 문제 &amp; 해결 방법</h2>
            <p className="text-sm text-zinc-500 mb-4">
              SCORM 콘텐츠(iframe)가 <code className="bg-zinc-100 px-1 rounded">window.parent.API</code>에 접근하려면
              parent와 iframe이 같은 origin이어야 함.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200">
                    <th className="text-left py-2 pr-4 text-zinc-500 font-medium">방법</th>
                    <th className="text-left py-2 pr-4 text-zinc-500 font-medium">설명</th>
                    <th className="text-left py-2 text-zinc-500 font-medium">난이도</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  <tr>
                    <td className="py-3 pr-4 font-medium text-zinc-800">같은 도메인 서빙<br /><span className="font-normal text-zinc-500">(reverse proxy)</span></td>
                    <td className="py-3 pr-4 text-zinc-600">
                      <code className="bg-zinc-100 px-1 rounded text-xs">lms.example.com/content/*</code> → S3 라우팅.<br />
                      LMS와 콘텐츠가 동일 origin.
                    </td>
                    <td className="py-3">
                      <span className="inline-block bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full">쉬움 · 권장</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-zinc-800">서브도메인 통일</td>
                    <td className="py-3 pr-4 text-zinc-600">
                      <code className="bg-zinc-100 px-1 rounded text-xs">cdn.lms.example.com</code> + <code className="bg-zinc-100 px-1 rounded text-xs">document.domain</code> 동기화.<br />
                      <span className="text-amber-600">브라우저 정책 제한 있음 (일부 브라우저 비활성화).</span>
                    </td>
                    <td className="py-3">
                      <span className="inline-block bg-yellow-50 text-yellow-700 text-xs px-2 py-0.5 rounded-full">쉬움 · 제한 있음</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-zinc-800">postMessage 브릿지</td>
                    <td className="py-3 pr-4 text-zinc-600">
                      SCORM shim이 API 호출을 postMessage로 중계.<br />
                      도메인 무관하게 동작, shim 주입 필요.
                    </td>
                    <td className="py-3">
                      <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">중간</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3 — Supported Formats */}
          <section className="rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="font-semibold text-zinc-900 mb-4">3. 지원 형식 결정</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200">
                    <th className="text-left py-2 pr-4 text-zinc-500 font-medium">형식</th>
                    <th className="text-left py-2 pr-4 text-zinc-500 font-medium">지원</th>
                    <th className="text-left py-2 text-zinc-500 font-medium">이유</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  <tr>
                    <td className="py-3 pr-4 font-medium text-zinc-800">SCORM 1.2</td>
                    <td className="py-3 pr-4">
                      <span className="text-green-600 font-medium">✅ 지원</span>
                    </td>
                    <td className="py-3 text-zinc-600">국내 기업 표준, 이수 추적 가능</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-zinc-800">SCORM 2004</td>
                    <td className="py-3 pr-4">
                      <span className="text-green-600 font-medium">✅ 지원</span>
                    </td>
                    <td className="py-3 text-zinc-600">글로벌 표준, 세분화된 에러코드</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-zinc-800">Web (HTML5)</td>
                    <td className="py-3 pr-4">
                      <span className="text-zinc-400">❌ 미지원</span>
                    </td>
                    <td className="py-3 text-zinc-600">이수 추적 불가</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4 — CORS vs window.parent */}
          <section className="rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="font-semibold text-zinc-900 mb-4">4. S3 CORS 설정 vs window 접근 이슈 구분</h2>
            <div className="flex flex-col gap-4 text-sm">
              <div className="rounded-lg bg-zinc-50 border border-zinc-200 p-4">
                <p className="font-medium text-zinc-800 mb-1">S3 CORS — 파일 로드 문제</p>
                <p className="text-zinc-600">
                  <code className="bg-white px-1 rounded border border-zinc-200">fetch</code>나 <code className="bg-white px-1 rounded border border-zinc-200">XMLHttpRequest</code>로 S3 파일을 불러올 때 발생.
                  S3 버킷 CORS 설정(<code className="bg-white px-1 rounded border border-zinc-200">AllowedOrigins</code>)으로 해결 가능.
                </p>
              </div>
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                <p className="font-medium text-amber-900 mb-1">window.parent.API 접근 — 도메인 구조 문제</p>
                <p className="text-amber-800">
                  CORS 헤더로는 해결 불가. iframe과 parent가 다른 origin이면 JS 접근 자체가 차단됨.
                  위 섹션 2의 도메인 구조 전략으로 해결해야 함.
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
