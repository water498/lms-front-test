import type { Order, OrderItem, OrderStatus } from "@/lib/models";

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING:   "결제 대기",
  PAID:      "결제 완료",
  CANCELLED: "취소",
  REFUNDED:  "환불",
};

const STATUS_CLASS: Record<OrderStatus, string> = {
  PENDING:   "bg-amber-900/40 text-amber-400",
  PAID:      "bg-emerald-900/40 text-emerald-400",
  CANCELLED: "bg-zinc-800 text-zinc-500",
  REFUNDED:  "bg-rose-900/40 text-rose-400",
};

const ordersMock: (Order & { items: (OrderItem & { courseTitle: string })[] })[] = [
  {
    id: "ord1", orderNumber: "OK-20260228-A1B2", userId: "u1",
    subtotalAmount: 89000, discountAmount: 0, totalAmount: 89000,
    status: "PAID", createdAt: "2026-02-28", paidAt: "2026-02-28",
    items: [{ id: "oi1", orderId: "ord1", courseId: "c1", courseTitle: "실무 중심 AI·머신러닝 완성 과정", unitPrice: 89000, discountAmount: 0, finalPrice: 89000 }],
  },
  {
    id: "ord2", orderNumber: "OK-20260110-C3D4", userId: "u1",
    subtotalAmount: 69000, discountAmount: 0, totalAmount: 69000,
    status: "PAID", createdAt: "2026-01-10", paidAt: "2026-01-10",
    items: [{ id: "oi2", orderId: "ord2", courseId: "c2", courseTitle: "React + TypeScript 실전 프로젝트", unitPrice: 69000, discountAmount: 0, finalPrice: 69000 }],
  },
  {
    id: "ord3", orderNumber: "OK-20251205-E5F6", userId: "u1",
    subtotalAmount: 49000, discountAmount: 0, totalAmount: 49000,
    status: "PAID", createdAt: "2025-12-05", paidAt: "2025-12-05",
    items: [{ id: "oi3", orderId: "ord3", courseId: "c3", courseTitle: "SQL 마스터: 데이터 분석 실무", unitPrice: 49000, discountAmount: 0, finalPrice: 49000 }],
  },
  {
    id: "ord4", orderNumber: "OK-20251101-G7H8", userId: "u1",
    subtotalAmount: 29000, discountAmount: 0, totalAmount: 29000,
    status: "PAID", createdAt: "2025-11-01", paidAt: "2025-11-01",
    items: [{ id: "oi4", orderId: "ord4", courseId: "c4", courseTitle: "JavaScript 핵심 개념", unitPrice: 29000, discountAmount: 0, finalPrice: 29000 }],
  },
  {
    id: "ord5", orderNumber: "OK-20250915-I9J0", userId: "u1",
    subtotalAmount: 89000, discountAmount: 0, totalAmount: 89000,
    status: "REFUNDED", createdAt: "2025-09-15", paidAt: "2025-09-15",
    items: [{ id: "oi5", orderId: "ord5", courseId: "c5", courseTitle: "Docker & Kubernetes 실전", unitPrice: 89000, discountAmount: 0, finalPrice: 89000 }],
  },
];

export function OrdersTab() {
  return (
    <div className="flex flex-col gap-4">
      {ordersMock.map((order) => (
        <div key={order.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          {/* Order header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800/60">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-zinc-500">{order.orderNumber}</span>
              <span className="text-xs text-zinc-600">{order.createdAt}</span>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${STATUS_CLASS[order.status]}`}>
              {STATUS_LABEL[order.status]}
            </span>
          </div>

          {/* Order items */}
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between px-5 py-4">
              <span className="text-sm text-zinc-200 font-medium">{item.courseTitle}</span>
              <div className="flex items-center gap-3 shrink-0">
                {item.discountAmount > 0 && (
                  <span className="text-xs text-zinc-500 line-through">
                    ₩{item.unitPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-sm text-zinc-300 font-semibold">
                  ₩{item.finalPrice.toLocaleString()}
                </span>
              </div>
            </div>
          ))}

          {/* Order footer */}
          {(order.discountAmount > 0 || order.items.length > 1) && (
            <div className="flex justify-end items-center gap-2 px-5 py-3 border-t border-zinc-800/60 bg-zinc-950/40">
              {order.discountAmount > 0 && (
                <span className="text-xs text-violet-400">
                  쿠폰 −₩{order.discountAmount.toLocaleString()}
                </span>
              )}
              <span className="text-sm font-bold text-white">
                합계 ₩{order.totalAmount.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
