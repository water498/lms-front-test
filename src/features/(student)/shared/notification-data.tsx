"use client";

import {
  BookOpen,
  Award,
  MessageCircle,
  Megaphone,
  Settings,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

export interface NotifItem {
  id: string;
  type:
    | "ENROLLMENT"
    | "CERT_ISSUED"
    | "QNA_ANSWERED"
    | "ANNOUNCEMENT"
    | "SYSTEM";
  title: string;
  body: string;
  time: string;
  read: boolean;
  linkUrl?: string;
}

export type NotifType = NotifItem["type"];

// ── Icon mapping ─────────────────────────────────────────────────────────────

export const NOTIF_ICON: Record<NotifType, React.ReactNode> = {
  ENROLLMENT: <BookOpen className="w-4 h-4 text-violet-400" />,
  CERT_ISSUED: <Award className="w-4 h-4 text-amber-400" />,
  QNA_ANSWERED: <MessageCircle className="w-4 h-4 text-sky-400" />,
  ANNOUNCEMENT: <Megaphone className="w-4 h-4 text-emerald-400" />,
  SYSTEM: <Settings className="w-4 h-4 text-zinc-400" />,
};

export const NOTIF_TYPE_LABEL: Record<NotifType, string> = {
  ENROLLMENT: "수강",
  CERT_ISSUED: "수료증",
  QNA_ANSWERED: "Q&A",
  ANNOUNCEMENT: "공지",
  SYSTEM: "시스템",
};

// ── Mock data ────────────────────────────────────────────────────────────────

export const MOCK_NOTIFS: NotifItem[] = [
  {
    id: "n1",
    type: "QNA_ANSWERED",
    title: "Q&A 답변 도착",
    body: '"랜덤 포레스트 n_estimators 파라미터" 질문에 강사님이 답변했습니다.',
    time: "2분 전",
    read: false,
    linkUrl: "/experiments/student/courses/c1?tab=qna",
  },
  {
    id: "n2",
    type: "CERT_ISSUED",
    title: "수료증 발급 완료",
    body: "JavaScript 핵심 개념 과정의 수료증이 발급되었습니다.",
    time: "1시간 전",
    read: false,
    linkUrl: "/experiments/student/my/certificates",
  },
  {
    id: "n3",
    type: "ANNOUNCEMENT",
    title: "봄맞이 전 강의 30% 할인",
    body: "3월 31일까지 모든 강의를 30% 할인된 가격으로 수강하세요.",
    time: "2일 전",
    read: true,
    linkUrl: "/experiments/student/announcements",
  },
  {
    id: "n4",
    type: "ENROLLMENT",
    title: "수강 등록 완료",
    body: "React + TypeScript 실전 프로젝트 강의 수강 등록이 완료되었습니다.",
    time: "3일 전",
    read: true,
    linkUrl: "/experiments/student/courses/c2",
  },
  {
    id: "n5",
    type: "SYSTEM",
    title: "프로필 정보 업데이트 안내",
    body: "2026년 4월 1일부터 프로필 사진 형식 정책이 변경됩니다.",
    time: "1주 전",
    read: true,
  },
  {
    id: "n6",
    type: "QNA_ANSWERED",
    title: "Q&A 답변 도착",
    body: '"Docker 컨테이너 네트워크 설정" 질문에 강사님이 답변했습니다.',
    time: "1주 전",
    read: true,
    linkUrl: "/experiments/student/courses/c3?tab=qna",
  },
  {
    id: "n7",
    type: "ENROLLMENT",
    title: "수강 등록 완료",
    body: "Python 데이터 분석 입문 강의 수강 등록이 완료되었습니다.",
    time: "2주 전",
    read: true,
    linkUrl: "/experiments/student/courses/c4",
  },
  {
    id: "n8",
    type: "CERT_ISSUED",
    title: "수료증 발급 완료",
    body: "AWS 클라우드 아키텍처 과정의 수료증이 발급되었습니다.",
    time: "2주 전",
    read: true,
    linkUrl: "/experiments/student/my/certificates",
  },
  {
    id: "n9",
    type: "ANNOUNCEMENT",
    title: "신규 강의 오픈 안내",
    body: "Kubernetes 실전 운영 강의가 새로 오픈되었습니다. 지금 확인해보세요!",
    time: "3주 전",
    read: true,
    linkUrl: "/experiments/student/announcements",
  },
  {
    id: "n10",
    type: "QNA_ANSWERED",
    title: "Q&A 답변 도착",
    body: '"JWT 토큰 갱신 로직" 질문에 강사님이 답변했습니다.',
    time: "3주 전",
    read: true,
    linkUrl: "/experiments/student/courses/c1?tab=qna",
  },
  {
    id: "n11",
    type: "SYSTEM",
    title: "서비스 점검 안내",
    body: "3월 15일(토) 02:00~06:00 서버 점검이 예정되어 있습니다.",
    time: "1개월 전",
    read: true,
  },
  {
    id: "n12",
    type: "ENROLLMENT",
    title: "수강 등록 완료",
    body: "DevOps CI/CD 파이프라인 구축 강의 수강 등록이 완료되었습니다.",
    time: "1개월 전",
    read: true,
    linkUrl: "/experiments/student/courses/c5",
  },
];
