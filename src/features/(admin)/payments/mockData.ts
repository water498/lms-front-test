export type { PaymentStatus, Payment, Order, OrderItem, OrderStatus } from "@/lib/models";
import type { Payment, Order, OrderItem } from "@/lib/models";

export const orders: Order[] = [
  { id: "ord1", orderNumber: "OK-20260314-A1B2", userId: "u1", subtotalAmount: 99000,  discountAmount: 0,     totalAmount: 99000,  status: "PAID",      createdAt: "2026-03-14", paidAt: "2026-03-14" },
  { id: "ord2", orderNumber: "OK-20260313-C3D4", userId: "u2", subtotalAmount: 169000, discountAmount: 40000, totalAmount: 129000, status: "PAID",      createdAt: "2026-03-13", paidAt: "2026-03-13", couponId: "cp1" },
  { id: "ord3", orderNumber: "OK-20260312-E5F6", userId: "u3", subtotalAmount: 159000, discountAmount: 0,     totalAmount: 159000, status: "PAID",      createdAt: "2026-03-12", paidAt: "2026-03-12" },
  { id: "ord4", orderNumber: "OK-20260310-G7H8", userId: "u4", subtotalAmount: 99000,  discountAmount: 0,     totalAmount: 99000,  status: "REFUNDED",  createdAt: "2026-03-10", paidAt: "2026-03-10" },
  { id: "ord5", orderNumber: "OK-20260308-I9J0", userId: "u5", subtotalAmount: 149000, discountAmount: 0,     totalAmount: 149000, status: "PAID",      createdAt: "2026-03-08", paidAt: "2026-03-08" },
  { id: "ord6", orderNumber: "OK-20260305-K1L2", userId: "u6", subtotalAmount: 129000, discountAmount: 0,     totalAmount: 129000, status: "CANCELLED", createdAt: "2026-03-05" },
];

export const orderItems: OrderItem[] = [
  { id: "oi1",  orderId: "ord1", courseId: "c1", unitPrice: 99000,  discountAmount: 0,     finalPrice: 99000  },
  { id: "oi2a", orderId: "ord2", courseId: "c2", unitPrice: 99000,  discountAmount: 20000, finalPrice: 79000  },
  { id: "oi2b", orderId: "ord2", courseId: "c3", unitPrice: 70000,  discountAmount: 20000, finalPrice: 50000  },
  { id: "oi3",  orderId: "ord3", courseId: "c4", unitPrice: 159000, discountAmount: 0,     finalPrice: 159000 },
  { id: "oi4",  orderId: "ord4", courseId: "c1", unitPrice: 99000,  discountAmount: 0,     finalPrice: 99000  },
  { id: "oi5",  orderId: "ord5", courseId: "c5", unitPrice: 149000, discountAmount: 0,     finalPrice: 149000 },
  { id: "oi6",  orderId: "ord6", courseId: "c2", unitPrice: 129000, discountAmount: 0,     finalPrice: 129000 },
];

export const payments: Payment[] = [
  { id: "p1", orderId: "ord1", amount: 99000,  status: "PAID",      paidAt: "2026-03-14", pgProvider: "TOSS",    paymentMethod: "CARD" },
  { id: "p2", orderId: "ord2", amount: 129000, status: "PAID",      paidAt: "2026-03-13", pgProvider: "TOSS",    paymentMethod: "KAKAO_PAY" },
  { id: "p3", orderId: "ord3", amount: 159000, status: "PAID",      paidAt: "2026-03-12", pgProvider: "IAMPORT", paymentMethod: "CARD" },
  { id: "p4", orderId: "ord4", amount: 99000,  status: "REFUNDED",  paidAt: "2026-03-10", pgProvider: "TOSS",    paymentMethod: "CARD" },
  { id: "p5", orderId: "ord5", amount: 149000, status: "PAID",      paidAt: "2026-03-08", pgProvider: "KCP",     paymentMethod: "CARD" },
  { id: "p6", orderId: "ord6", amount: 129000, status: "CANCELLED", paidAt: "2026-03-05" },
];

export const learnerNames: Record<string, string> = {
  u1: "김민준", u2: "이서연", u3: "최유진", u4: "정하은", u5: "박지호", u6: "홍길동",
};

export const courseTitles: Record<string, string> = {
  c1: "React 기초", c2: "TypeScript 심화", c3: "AWS 클라우드 입문",
  c4: "Next.js 마스터", c5: "Docker & Kubernetes 실전",
};
