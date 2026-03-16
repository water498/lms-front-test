export default function ScormSessionArchPage() {
  return (
    <main className="min-h-screen bg-zinc-50 p-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-xs text-zinc-400 mb-1">Research Note</p>
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">SCORM 세션 아키텍처</h1>
          <p className="text-zinc-500 text-sm">
            어댑터 레이어 · Redis 세션 버퍼 · 정규화 모델
          </p>
        </div>

        <div className="flex flex-col gap-8">

          {/* Section 1 — 왜 어댑터 레이어가 필요한가 */}
          <section className="rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="font-semibold text-zinc-900 mb-4">1. 왜 어댑터 레이어가 필요한가</h2>

            {/* 문제 테이블 */}
            <div className="mb-6">
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-3">SCORM 1.2 vs 2004 API 차이</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-200">
                      <th className="text-left py-2 pr-4 text-zinc-500 font-medium">항목</th>
                      <th className="text-left py-2 pr-4 text-zinc-500 font-medium">SCORM 1.2</th>
                      <th className="text-left py-2 text-zinc-500 font-medium">SCORM 2004</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-zinc-600 text-sm">
                    {[
                      ["전역 객체", "window.API", "window.API_1484_11"],
                      ["초기화", 'LMSInitialize("")', 'Initialize("")'],
                      ["완료 상태", "lesson_status 단일 6값", "completion_status + success_status 분리"],
                      ["시간 형식", "HH:MM:SS", "PT1H2M3S (ISO 8601)"],
                      ["점수", "score.raw only", "score.raw + score.scaled (−1~1)"],
                      ["위치", "cmi.core.lesson_location", "cmi.location"],
                      ["일시중단", "cmi.suspend_data", "cmi.suspend_data"],
                    ].map(([item, v12, v2004]) => (
                      <tr key={item}>
                        <td className="py-2.5 pr-4 font-medium text-zinc-800">{item}</td>
                        <td className="py-2.5 pr-4 font-mono text-xs text-violet-600">{v12}</td>
                        <td className="py-2.5 font-mono text-xs text-blue-600">{v2004}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 어댑터 데이터 흐름 다이어그램 */}
            <div>
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-3">어댑터 데이터 흐름</p>
              <div className="rounded-lg bg-zinc-50 border border-zinc-200 p-4 text-xs font-mono text-zinc-700 leading-relaxed whitespace-pre">
{`SCORM 1.2 콘텐츠        SCORM 2004 콘텐츠
 window.API              window.API_1484_11
      ↓                        ↓
      └──────────┬─────────────┘
                 ↓
         ScormAdapter
    (버전 감지 + 필드 정규화)
                 ↓
         SessionManager
    { completionStatus, successStatus,
      scoreRaw, scoreScaled, location,
      totalTimeSeconds, suspendData }
                 ↓
          Redis / DB`}
              </div>
            </div>
          </section>

          {/* Section 2 — 정규화 매핑표 */}
          <section className="rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="font-semibold text-zinc-900 mb-4">2. 정규화 매핑표</h2>
            <p className="text-sm text-zinc-500 mb-4">
              버전별 필드를 내부 통합 필드로 매핑하여 수료 판단·집계 로직을 단일화한다.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200">
                    <th className="text-left py-2 pr-4 text-zinc-500 font-medium">내부 필드</th>
                    <th className="text-left py-2 pr-4 text-zinc-500 font-medium">SCORM 1.2</th>
                    <th className="text-left py-2 text-zinc-500 font-medium">SCORM 2004</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-sm">
                  {[
                    ["completionStatus", "cmi.core.lesson_status (completed/incomplete/…)", "cmi.completion_status"],
                    ["successStatus", "cmi.core.lesson_status (passed/failed)", "cmi.success_status"],
                    ["scoreRaw", "cmi.core.score.raw", "cmi.score.raw"],
                    ["scoreScaled", "— (없음)", "cmi.score.scaled"],
                    ["totalTimeSeconds", "cmi.core.total_time HH:MM:SS 파싱", "cmi.total_time ISO 8601 파싱"],
                    ["location", "cmi.core.lesson_location", "cmi.location"],
                    ["suspendData", "cmi.suspend_data", "cmi.suspend_data"],
                  ].map(([field, v12, v2004]) => (
                    <tr key={field}>
                      <td className="py-2.5 pr-4 font-mono text-xs font-medium text-zinc-900">{field}</td>
                      <td className="py-2.5 pr-4 font-mono text-xs text-violet-600">{v12}</td>
                      <td className="py-2.5 font-mono text-xs text-blue-600">{v2004}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3 — Redis 세션 버퍼 */}
          <section className="rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="font-semibold text-zinc-900 mb-4">3. Redis 세션 버퍼</h2>

            {/* 경고 박스 */}
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm mb-6">
              <p className="font-medium text-amber-900 mb-1">API 호출 빈도 문제</p>
              <ul className="text-amber-800 flex flex-col gap-1 mt-1">
                <li>iSpring 등 콘텐츠는 <code className="bg-amber-100 px-1 rounded">cmi.suspend_data</code>를 1초마다 SetValue</li>
                <li>60분 과정 = 3,600회 SetValue → DB에 직접 쓰면 초당 1회 write</li>
              </ul>
            </div>

            {/* 3계층 처리 구조 */}
            <div className="mb-6">
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-3">3계층 처리 구조</p>
              <div className="rounded-lg bg-zinc-50 border border-zinc-200 p-4 text-xs font-mono text-zinc-700 leading-relaxed whitespace-pre">
{`LMSSetValue (1초마다)
  → Redis HSET session:{id} field value   ← < 1ms, 부하 없음

LMSCommit ("")  ← "저장해줘" 명시 의도
  → Redis 스냅샷 → DB upsert              ← 슬라이드 이동마다 (분당 ~1회)

LMSFinish ("")  ← 세션 종료
  → DB 최종 write + session 완료 마킹
  → Redis TTL 1h 연장 (크래시 복구 보험)`}
              </div>
            </div>

            {/* 크래시 대비 복구 흐름 */}
            <div>
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-3">크래시 대비 복구 흐름</p>
              <div className="rounded-lg bg-zinc-50 border border-zinc-200 p-4 text-xs font-mono text-zinc-700 leading-relaxed whitespace-pre">
{`브라우저 강제 종료 시:
  Redis에 마지막 Commit 상태 보존 (TTL 24h)
  백그라운드 워커: TTL 만료 전 스냅샷 → DB flush
  최대 손실 = 마지막 Commit 이후 (슬라이드 1개 분량)`}
              </div>
            </div>
          </section>

          {/* Section 4 — DB 스키마 */}
          <section className="rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="font-semibold text-zinc-900 mb-4">4. DB 스키마 — ScormSession</h2>

            <div className="rounded-lg bg-zinc-50 border border-zinc-200 p-4 text-xs font-mono text-zinc-700 leading-relaxed whitespace-pre mb-4">
{`ScormSession {
  id                String   -- 세션 UUID
  enrollmentId      String   -- 수강 FK
  scormVersion      String   -- "1.2" | "2004"

  -- 정규화 필드 (수료 판단 · 집계용)
  completionStatus  String   -- "not_attempted" | "incomplete" | "completed"
  successStatus     String   -- "unknown" | "passed" | "failed"
  scoreRaw          Float?
  scoreScaled       Float?   -- -1 ~ 1 (2004만)
  totalTimeSeconds  Int
  location          String   -- 북마크

  -- 원본 보존 (복구 · 디버깅용)
  suspendData       Text     -- opaque blob, 서버는 읽지 않음
  rawDataJson       Json     -- 전체 cmi 스냅샷

  startedAt         DateTime
  lastCommittedAt   DateTime
  finishedAt        DateTime?
}`}
            </div>

            <div className="flex flex-col gap-3 text-sm">
              <div className="rounded-lg bg-zinc-50 border border-zinc-200 p-4">
                <p className="font-medium text-zinc-800 mb-1">
                  <code className="text-violet-600">suspendData</code>
                </p>
                <p className="text-zinc-600">
                  서버는 읽지 않고 콘텐츠에 그대로 반환 (이어보기용). opaque blob으로 처리.
                </p>
              </div>
              <div className="rounded-lg bg-zinc-50 border border-zinc-200 p-4">
                <p className="font-medium text-zinc-800 mb-1">
                  <code className="text-violet-600">rawDataJson</code>
                </p>
                <p className="text-zinc-600">
                  디버깅·감사 로그용. 비정규화 원본 전체를 보존하여 필드 파싱 오류 추적에 활용.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 — HTML 추적 대비 SCORM 신뢰성 */}
          <section className="rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="font-semibold text-zinc-900 mb-4">5. HTML 이벤트 추적 vs SCORM 신뢰성</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200">
                    <th className="text-left py-2 pr-4 text-zinc-500 font-medium">비교 항목</th>
                    <th className="text-left py-2 pr-4 text-zinc-500 font-medium">HTML 이벤트 추적</th>
                    <th className="text-left py-2 text-zinc-500 font-medium">SCORM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-sm text-zinc-600">
                  {[
                    ["완료 신호 방식", "XHR/beacon, 유실 가능", "LMSFinish 핸드셰이크"],
                    ["저장 확인", "없음", 'Commit → "true" 반환'],
                    ["이어보기", "별도 구현 필요", "suspend_data 표준화"],
                    ["브라우저 종료 대비", "beforeunload (불안정)", "Redis TTL 보험"],
                    ["표준화", "❌ LMS마다 다름", "✅ SCORM 스펙"],
                  ].map(([item, html, scorm]) => (
                    <tr key={item}>
                      <td className="py-2.5 pr-4 font-medium text-zinc-800">{item}</td>
                      <td className="py-2.5 pr-4 text-zinc-500">{html}</td>
                      <td className="py-2.5 text-zinc-700">{scorm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
