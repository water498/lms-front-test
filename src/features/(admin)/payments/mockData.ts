export type { PaymentStatus, Payment } from "@/lib/models";
import type { Payment } from "@/lib/models";

export const payments: Payment[] = [
  { id: "p1", orderNumber: "ORD-20250314-001", learner: "김민준", course: "React 기초",        amount: 99000,  status: "PAID",      paidAt: "2025-03-14" },
  { id: "p2", orderNumber: "ORD-20250313-005", learner: "이서연", course: "TypeScript 심화",   amount: 129000, status: "PAID",      paidAt: "2025-03-13" },
  { id: "p3", orderNumber: "ORD-20250312-003", learner: "최유진", course: "AWS 클라우드 입문", amount: 159000, status: "PAID",      paidAt: "2025-03-12" },
  { id: "p4", orderNumber: "ORD-20250310-002", learner: "정하은", course: "React 기초",        amount: 99000,  status: "REFUNDED",  paidAt: "2025-03-10" },
  { id: "p5", orderNumber: "ORD-20250308-007", learner: "박지호", course: "Next.js 마스터",    amount: 149000, status: "PAID",      paidAt: "2025-03-08" },
  { id: "p6", orderNumber: "ORD-20250305-004", learner: "홍길동", course: "TypeScript 심화",   amount: 129000, status: "CANCELLED", paidAt: "2025-03-05" },
];
