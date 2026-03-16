export default function ScormCdnArchPage() {
  return (
    <main className="min-h-screen bg-zinc-50 p-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-xs text-zinc-400 mb-1">Research Note</p>
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">미디어 자산 CDN 아키텍처</h1>
          <p className="text-zinc-500 text-sm">
            LMS 미디어 자산(Video, PDF, SCORM 등) 저장 구조, 업로드 파이프라인, cross-origin 이슈 정리
          </p>
        </div>

        <div className="flex flex-col gap-8">

          {/* Section 1 — Asset Storage Model */}
          <section className="rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="font-semibold text-zinc-900 mb-6">1. 자산 저장 구조</h2>

            {/* 1-A. Flat storage */}
            <div className="mb-6">
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-3">S3 경로 — 모든 자산 공통</p>
              <div className="rounded-lg bg-zinc-50 border border-zinc-200 p-4 text-sm font-mono text-zinc-700 space-y-1">
                <p><span className="text-zinc-400">// Video, PDF, Image</span></p>
                <p>media/<span className="text-blue-600">{"{assetId}"}</span>/file.mp4</p>
                <p className="pt-1"><span className="text-zinc-400">// SCORM — zip 압축 해제 후 폴더째 업로드</span></p>
                <p>media/<span className="text-blue-600">{"{assetId}"}</span>/imsmanifest.xml</p>
                <p>media/<span className="text-blue-600">{"{assetId}"}</span>/index.html</p>
                <p>media/<span className="text-blue-600">{"{assetId}"}</span>/data/...</p>
              </div>
              <p className="mt-2 text-xs text-zinc-400">
                모든 자산 타입이 동일한 <code className="bg-zinc-100 px-1 rounded">media/{"{assetId}"}/</code> 패턴을 사용한다.
                SCORM 내부 파일은 상대 경로로 서로 참조하므로, prefix가 무엇이든 동작함.
              </p>
            </div>

            {/* 1-B. DB Schema */}
            <div className="mb-6">
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-3">DB — media_assets 테이블</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-200">
                      <th className="text-left py-2 pr-4 text-zinc-500 font-medium">컬럼</th>
                      <th className="text-left py-2 pr-4 text-zinc-500 font-medium">타입</th>
                      <th className="text-left py-2 text-zinc-500 font-medium">설명</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-zinc-600">
                    {[
                      ["id", "UUID", "자산 식별자 (S3 경로 prefix)"],
                      ["asset_type", "ENUM", "VIDEO | PDF | IMAGE | SCORM"],
                      ["mime_type", "VARCHAR", "서버 감지값 (video/mp4, application/zip 등)"],
                      ["original_name", "VARCHAR", "업로드 원본 파일명"],
                      ["size_bytes", "BIGINT", "파일 크기"],
                      ["status", "ENUM", "PENDING | VALIDATING | PROCESSING | ACTIVE | ERROR"],
                      ["cdn_base_url", "VARCHAR", "ACTIVE 시 CDN base URL (media/{assetId}/)"],
                      ["launch_href", "VARCHAR", "SCORM 전용 — imsmanifest 파싱 결과"],
                      ["scorm_version", "VARCHAR", "SCORM 전용 — 1.2 | 2004"],
                      ["error_message", "TEXT", "ERROR 시 에러 메시지"],
                    ].map(([col, type, desc]) => (
                      <tr key={col}>
                        <td className="py-2 pr-4 font-mono text-xs text-zinc-800">{col}</td>
                        <td className="py-2 pr-4 font-mono text-xs text-violet-600">{type}</td>
                        <td className="py-2 text-xs">{desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 1-C. Reuse Model */}
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 text-sm">
              <p className="font-medium text-blue-900 mb-1">재사용 — activityResource → assetId 참조</p>
              <p className="text-blue-800">
                동일한 SCORM 패키지를 여러 과정의 ActivityResource에서 참조할 수 있다.
                S3에 중복 저장 없이 <code className="bg-blue-100 px-1 rounded">assetId</code>만 DB에서 공유.
                Course 구조(<code className="bg-blue-100 px-1 rounded">course → subject → activity → resource</code>)에서
                resource가 assetId를 FK로 가짐.
              </p>
            </div>
          </section>

          {/* Section 2 — Upload Flow */}
          <section className="rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="font-semibold text-zinc-900 mb-6">2. 업로드 파이프라인</h2>

            {/* 2-A. Upload Scenario Steps */}
            <div className="mb-6">
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-3">업로드 시나리오</p>
              <div className="flex flex-col gap-3">
                {[
                  {
                    label: "POST /media/assets",
                    desc: "관리자가 파일명·크기 전송 → DB에 media_asset 레코드 INSERT (status=PENDING) → assetId (UUID) 반환",
                  },
                  {
                    label: "PUT /media/assets/{assetId}/upload",
                    desc: "파일 multipart 업로드 → 서버가 임시 스토리지에 저장 → MIME type 감지 → DB status = VALIDATING",
                  },
                  {
                    label: "타입별 분기",
                    desc: "VIDEO / PDF / IMAGE → 파일 크기·포맷 체크 후 바로 PROCESSING. SCORM(.zip) → imsmanifest.xml 파싱, launchHref 확인 추가 수행.",
                  },
                  {
                    label: "S3 업로드",
                    desc: "검증 통과 → DB status = PROCESSING → media/{assetId}/ 경로로 S3 업로드 (SCORM은 zip 압축 해제 후 폴더째)",
                  },
                  {
                    label: "서빙 준비 완료",
                    desc: "업로드 완료 → DB status = ACTIVE, cdn_base_url 저장 → CloudFront가 S3 origin으로 자동 서빙",
                  },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-zinc-800 text-white text-xs flex items-center justify-center font-medium mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <code className="text-xs bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded">{step.label}</code>
                      <p className="text-zinc-600 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2-B. Type Detection */}
            <div className="mb-6">
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-3">서버 타입 감지</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-200">
                      <th className="text-left py-2 pr-4 text-zinc-500 font-medium">asset_type</th>
                      <th className="text-left py-2 pr-4 text-zinc-500 font-medium">감지 방법</th>
                      <th className="text-left py-2 text-zinc-500 font-medium">추가 처리</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-sm text-zinc-600">
                    <tr>
                      <td className="py-2.5 pr-4 font-medium text-zinc-800">VIDEO</td>
                      <td className="py-2.5 pr-4">MIME: <code className="bg-zinc-100 px-1 rounded text-xs">video/*</code></td>
                      <td className="py-2.5">없음 (직접 업로드)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 font-medium text-zinc-800">PDF</td>
                      <td className="py-2.5 pr-4">MIME: <code className="bg-zinc-100 px-1 rounded text-xs">application/pdf</code></td>
                      <td className="py-2.5">없음 (직접 업로드)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 font-medium text-zinc-800">SCORM</td>
                      <td className="py-2.5 pr-4">MIME: <code className="bg-zinc-100 px-1 rounded text-xs">application/zip</code> + zip 내 <code className="bg-zinc-100 px-1 rounded text-xs">imsmanifest.xml</code> 존재</td>
                      <td className="py-2.5">manifest 파싱 → version, launchHref 추출 → zip 압축 해제 후 업로드</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 font-medium text-zinc-800">IMAGE</td>
                      <td className="py-2.5 pr-4">MIME: <code className="bg-zinc-100 px-1 rounded text-xs">image/*</code></td>
                      <td className="py-2.5">없음 (직접 업로드)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-zinc-400">
                클라이언트가 선택한 타입은 힌트로만 사용. 서버에서 MIME + 파일 구조로 2중 검증.
              </p>
            </div>

            {/* 2-C. Status 이력 테이블 */}
            <div className="mb-6">
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-3">Status 이력</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-200">
                      <th className="text-left py-2 pr-6 text-zinc-500 font-medium">status</th>
                      <th className="text-left py-2 pr-6 text-zinc-500 font-medium">시점</th>
                      <th className="text-left py-2 text-zinc-500 font-medium">적용 타입</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {[
                      { status: "PENDING", color: "text-zinc-500 bg-zinc-100", desc: "DB 레코드 생성 직후", types: "전체" },
                      { status: "VALIDATING", color: "text-amber-700 bg-amber-50", desc: "타입 감지 & 검증 중", types: "전체 (SCORM은 manifest 파싱 포함)" },
                      { status: "PROCESSING", color: "text-blue-700 bg-blue-50", desc: "S3 업로드 중", types: "전체" },
                      { status: "ACTIVE", color: "text-green-700 bg-green-50", desc: "CDN 서빙 가능", types: "전체" },
                      { status: "ERROR", color: "text-red-700 bg-red-50", desc: "어느 단계에서든 실패", types: "전체" },
                    ].map(({ status, color, desc, types }) => (
                      <tr key={status}>
                        <td className="py-2.5 pr-6">
                          <span className={`inline-block text-xs font-mono font-medium px-2 py-0.5 rounded ${color}`}>
                            {status}
                          </span>
                        </td>
                        <td className="py-2.5 pr-6 text-zinc-600 text-sm">{desc}</td>
                        <td className="py-2.5 text-zinc-400 text-xs">{types}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2-D. SCORM 검증 항목 */}
            <div>
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-3">SCORM 추가 검증 항목</p>
              <ul className="flex flex-col gap-1.5 text-sm text-zinc-700">
                {[
                  "zip 내 imsmanifest.xml 존재 여부",
                  "manifest 파싱 → SCORM 버전 감지 (1.2 / 2004) → DB scorm_version 저장",
                  "launch href (<resource href=\"...\">) 파일이 실제로 zip 내에 존재하는지 확인 → DB launch_href 저장",
                  "파일 크기 상한 체크 (예: 500 MB)",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="shrink-0 text-violet-400 mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-zinc-400">
                검증 실패 시 → DB status = <code className="bg-zinc-100 px-1 rounded">ERROR</code>, error_message 저장, S3 업로드 안 함
              </p>
            </div>
          </section>

          {/* Section 3 — Cross-Origin */}
          <section className="rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="font-semibold text-zinc-900 mb-4">3. Cross-Origin 문제 &amp; 해결 방법</h2>
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

          {/* Section 4 — Supported Formats */}
          <section className="rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="font-semibold text-zinc-900 mb-4">4. 지원 형식 결정</h2>
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

          {/* Section 5 — CORS vs window.parent */}
          <section className="rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="font-semibold text-zinc-900 mb-4">5. S3 CORS 설정 vs window 접근 이슈 구분</h2>
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
