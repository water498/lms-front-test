// Domain: payment — 결제, 주문, 쿠폰, 장바구니, 위시리스트

export type OrderStatus = "PENDING" | "PAID" | "CANCELLED" | "REFUNDED";

export interface Order {
  id: string;
  tenantId: string;
  orderNumber: string;        // 사람이 읽는 주문번호 (e.g. OK-20260320-A4F2)
  userId: string;             // FK → User
  couponId?: string;          // FK → Coupon (적용된 쿠폰)
  originalPrice: number;      // 할인 전 금액 (KRW)
  discountAmount: number;     // 쿠폰 등 할인액
  finalPrice: number;         // 실 결제 금액
  status: OrderStatus;
  createdAt: string;
  paidAt?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;            // FK → Order
  courseId: string;           // FK → Course
  unitPrice: number;          // 결제 시점 가격 (이후 가격 변경 불영향)
  discountAmount: number;     // 해당 아이템 할인액
  finalPrice: number;         // unitPrice - discountAmount
}

export type PgProvider = "TOSS" | "IAMPORT" | "KCP" | "NICEPAY";
export type PaymentMethod = "CARD" | "BANK_TRANSFER" | "KAKAO_PAY" | "NAVER_PAY";

export interface Payment {
  id: string;
  tenantId: string;
  orderId: string;            // FK → Order (UNIQUE)
  userId: string;             // FK → User
  amount: number; // KRW
  status: "PAID" | "REFUNDED" | "CANCELLED";
  pgProvider?: PgProvider;
  pgTid?: string; // PG사 거래번호
  paymentMethod?: PaymentMethod;
  receiptUrl?: string;
  paidAt: string;
}

export interface PaymentRefund {
  id: string;
  paymentId: string;
  amount: number;
  reason: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  refundedAt?: string;
  failedReason?: string;
}

export interface Coupon {
  id: string;
  tenantId: string;
  code: string;
  discountType: "AMOUNT" | "PERCENT";
  discountValue: number;
  maxUses: number | null; // null = 무제한
  usedCount: number;
  expiresAt: string | null;
  applicableCourseIds: string[]; // [UI convenience] backend는 String(2000) comma-separated. 빈 배열 = 전체 적용
  createdAt: string;
}

// Cart — composite PK (userId, courseSessionId)
export interface CartItem {
  userId: string;
  courseSessionId: string;   // FK → CourseSession
  addedAt: string;
}

// Wishlist — composite PK (userId, courseId)
export interface WishItem {
  userId: string;
  courseId: string;
  addedAt: string;
}
