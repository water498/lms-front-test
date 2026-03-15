export default function ScormApiRefPage() {
  return (
    <main className="min-h-screen bg-zinc-50 p-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <p className="text-xs text-zinc-400 mb-1">Reference</p>
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">SCORM API 레퍼런스</h1>
          <p className="text-zinc-500 text-sm">SCORM 1.2 / 2004 API 함수 및 CMI 데이터 모델 정리</p>
        </div>

        <div className="flex flex-col gap-8">

          {/* Section 1 — API Functions */}
          <section className="rounded-xl border border-zinc-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="font-semibold text-zinc-900">1. API 함수 비교</h2>
              <div className="flex gap-2 text-xs">
                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">window.API</span>
                <span className="text-zinc-400">vs</span>
                <span className="bg-violet-50 text-violet-700 px-2 py-0.5 rounded-full font-medium">window.API_1484_11</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200">
                    <th className="text-left py-2 pr-4 text-zinc-500 font-medium w-24">역할</th>
                    <th className="text-left py-2 pr-4 text-blue-600 font-medium">SCORM 1.2</th>
                    <th className="text-left py-2 text-violet-600 font-medium">SCORM 2004</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {[
                    ["초기화",      'LMSInitialize("")',        'Initialize("")'],
                    ["종료",        'LMSFinish("")',            'Terminate("")'],
                    ["값 읽기",     "LMSGetValue(element)",     "GetValue(element)"],
                    ["값 쓰기",     "LMSSetValue(element, val)","SetValue(element, val)"],
                    ["커밋",        'LMSCommit("")',            'Commit("")'],
                    ["에러 코드",   "LMSGetLastError()",        "GetLastError()"],
                    ["에러 문자열", "LMSGetErrorString(code)",  "GetErrorString(code)"],
                    ["진단",        "LMSGetDiagnostic(code)",   "GetDiagnostic(code)"],
                  ].map(([role, v12, v2004]) => (
                    <tr key={role}>
                      <td className="py-2.5 pr-4 text-zinc-500">{role}</td>
                      <td className="py-2.5 pr-4">
                        <code className="bg-blue-50 text-blue-800 text-xs px-1.5 py-0.5 rounded">{v12}</code>
                      </td>
                      <td className="py-2.5">
                        <code className="bg-violet-50 text-violet-800 text-xs px-1.5 py-0.5 rounded">{v2004}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 2 — CMI Data Model */}
          <section className="rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="font-semibold text-zinc-900 mb-4">2. CMI 데이터 모델 비교</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200">
                    <th className="text-left py-2 pr-4 text-zinc-500 font-medium w-28">의미</th>
                    <th className="text-left py-2 pr-4 text-blue-600 font-medium">SCORM 1.2</th>
                    <th className="text-left py-2 text-violet-600 font-medium">SCORM 2004</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {[
                    ["학습자 ID",    "cmi.core.student_id",        "cmi.learner_id"],
                    ["학습자 이름",  "cmi.core.student_name",      "cmi.learner_name"],
                    ["이수 상태",    "cmi.core.lesson_status",     "cmi.completion_status"],
                    ["성공 여부",    "(lesson_status에 통합)",      "cmi.success_status"],
                    ["점수 (raw)",   "cmi.core.score.raw",         "cmi.score.raw"],
                    ["점수 (min)",   "cmi.core.score.min",         "cmi.score.min"],
                    ["점수 (max)",   "cmi.core.score.max",         "cmi.score.max"],
                    ["점수 (비율)",  "—",                           "cmi.score.scaled  (−1 ~ 1)"],
                    ["세션 시간",    "cmi.core.session_time  HH:MM:SS", "cmi.session_time  PT1H2M3S"],
                    ["현재 위치",    "cmi.core.lesson_location",   "cmi.location"],
                    ["중단 데이터",  "cmi.suspend_data",           "cmi.suspend_data"],
                    ["진입 유형",    "cmi.core.entry",             "cmi.entry"],
                    ["종료 유형",    "cmi.core.exit",              "cmi.exit"],
                  ].map(([meaning, v12, v2004]) => (
                    <tr key={meaning}>
                      <td className="py-2.5 pr-4 text-zinc-500">{meaning}</td>
                      <td className="py-2.5 pr-4">
                        {v12 === "—" || v12.startsWith("(")
                          ? <span className="text-zinc-400 text-xs">{v12}</span>
                          : <code className="bg-blue-50 text-blue-800 text-xs px-1.5 py-0.5 rounded">{v12}</code>}
                      </td>
                      <td className="py-2.5">
                        <code className="bg-violet-50 text-violet-800 text-xs px-1.5 py-0.5 rounded">{v2004}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3 — Status Values */}
          <section className="rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="font-semibold text-zinc-900 mb-4">3. 상태값 목록</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs font-semibold text-blue-600 mb-2">SCORM 1.2 — lesson_status</p>
                <div className="flex flex-col gap-1">
                  {["not attempted","incomplete","completed","passed","failed","browsed"].map(v => (
                    <code key={v} className="bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded">{v}</code>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-violet-600 mb-2">SCORM 2004 — completion_status</p>
                <div className="flex flex-col gap-1">
                  {["not attempted","incomplete","completed","unknown"].map(v => (
                    <code key={v} className="bg-violet-50 text-violet-800 text-xs px-2 py-1 rounded">{v}</code>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-violet-600 mb-2">SCORM 2004 — success_status</p>
                <div className="flex flex-col gap-1">
                  {["passed","failed","unknown"].map(v => (
                    <code key={v} className="bg-violet-50 text-violet-800 text-xs px-2 py-1 rounded">{v}</code>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
              <strong>1.2 주의:</strong> <code className="bg-amber-100 px-1 rounded">passed</code> / <code className="bg-amber-100 px-1 rounded">failed</code>는 퀴즈 결과를,
              <code className="bg-amber-100 px-1 rounded ml-1">completed</code>는 콘텐츠 열람 완료를 의미.
              도구(iSpring 등)마다 어떤 값을 쓰는지 다를 수 있으므로 로그 확인 필요.
            </div>
          </section>

          {/* Section 4 — Error Codes */}
          <section className="rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="font-semibold text-zinc-900 mb-4">4. 주요 에러 코드</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-semibold text-blue-600 mb-2">SCORM 1.2</p>
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-200">
                      <th className="text-left py-1.5 pr-3 text-zinc-400 font-medium">코드</th>
                      <th className="text-left py-1.5 text-zinc-400 font-medium">설명</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {[
                      ["0",   "No Error"],
                      ["101", "General Exception"],
                      ["201", "Invalid Argument Error"],
                      ["301", "Not Initialized"],
                      ["401", "Not Implemented Error"],
                      ["402", "Invalid Set Value (Keyword)"],
                      ["403", "Element is Read Only"],
                      ["404", "Element is Write Only"],
                      ["405", "Incorrect Data Type"],
                    ].map(([code, desc]) => (
                      <tr key={code}>
                        <td className="py-1.5 pr-3 font-mono text-blue-700">{code}</td>
                        <td className="py-1.5 text-zinc-600">{desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <p className="text-xs font-semibold text-violet-600 mb-2">SCORM 2004</p>
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-200">
                      <th className="text-left py-1.5 pr-3 text-zinc-400 font-medium">코드</th>
                      <th className="text-left py-1.5 text-zinc-400 font-medium">설명</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {[
                      ["0",   "No Error"],
                      ["103", "Already Initialized"],
                      ["104", "Content Instance Terminated"],
                      ["112", "Termination Before Initialization"],
                      ["122", "Retrieve Data Before Initialization"],
                      ["132", "Store Data Before Initialization"],
                      ["142", "Commit Before Initialization"],
                      ["201", "General Argument Error"],
                      ["301", "General Get Failure"],
                      ["351", "General Set Failure"],
                      ["391", "General Commit Failure"],
                      ["401", "Undefined Data Model Element"],
                      ["406", "Data Model Element Type Mismatch"],
                      ["408", "Data Model Dependency Not Established"],
                    ].map(([code, desc]) => (
                      <tr key={code}>
                        <td className="py-1.5 pr-3 font-mono text-violet-700">{code}</td>
                        <td className="py-1.5 text-zinc-600">{desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
