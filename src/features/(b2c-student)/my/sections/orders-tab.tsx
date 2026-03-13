const ordersMock = [
  { id: "ord-1", courseTitle: "실무 중심 AI·머신러닝 완성 과정", amount: 89000, date: "2026-02-28", status: "완료" },
  { id: "ord-2", courseTitle: "React + TypeScript 실전 프로젝트", amount: 69000, date: "2026-01-10", status: "완료" },
  { id: "ord-3", courseTitle: "SQL 마스터: 데이터 분석 실무", amount: 49000, date: "2025-12-05", status: "완료" },
  { id: "ord-4", courseTitle: "JavaScript 핵심 개념", amount: 29000, date: "2025-11-01", status: "완료" },
  { id: "ord-5", courseTitle: "Docker & Kubernetes 실전", amount: 89000, date: "2025-09-15", status: "환불" },
];

export function OrdersTab() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-800">
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">강의</th>
            <th className="text-right px-5 py-3.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">금액</th>
            <th className="text-right px-5 py-3.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">날짜</th>
            <th className="text-right px-5 py-3.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">상태</th>
          </tr>
        </thead>
        <tbody>
          {ordersMock.map((order, i) => (
            <tr
              key={order.id}
              className={`border-b border-zinc-800/60 ${i === ordersMock.length - 1 ? "border-b-0" : ""}`}
            >
              <td className="px-5 py-4 text-zinc-200 font-medium">{order.courseTitle}</td>
              <td className="px-5 py-4 text-right text-zinc-300 whitespace-nowrap">
                ₩{order.amount.toLocaleString()}
              </td>
              <td className="px-5 py-4 text-right text-zinc-500 whitespace-nowrap text-xs">{order.date}</td>
              <td className="px-5 py-4 text-right whitespace-nowrap">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  order.status === "완료"
                    ? "bg-emerald-900/40 text-emerald-400"
                    : "bg-rose-900/40 text-rose-400"
                }`}>
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
