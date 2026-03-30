"use client";

import { usePathname, useRouter } from "next/navigation";
import { Bell, Info, LogOut } from "lucide-react";
import { useAdminAuthStore } from "../shared/auth-store";

const PAGE_TITLE_MAP: {
  prefix: string;
  label: string;
  description?: string;
}[] = [
  {
    prefix: "/experiments/admin/courses/categories",
    label: "카테고리 관리",
    description:
      "과정을 분류하는 대·중·소 3단계 태그 체계. 학습자 탐색 시 필터로 쓰이며, 과정당 카테고리는 하나입니다.",
  },
  {
    prefix: "/experiments/admin/courses/",
    label: "과정 상세",
    description: "선택한 과정의 콘텐츠·수강 조건·평가를 편집합니다.",
  },
  {
    prefix: "/experiments/admin/courses",
    label: "과정 관리",
    description:
      "플랫폼에 개설된 모든 과정을 관리합니다. 과정은 학습 콘텐츠의 기본 단위입니다.",
  },
  {
    prefix: "/experiments/admin/sessions",
    label: "과정 운영",
    description:
      "과정 운영(Session)은 동일 과정을 기간·정원을 달리해 반복 운영하는 단위입니다. 기업 교육의 '기수'에 해당합니다.",
  },
  {
    prefix: "/experiments/admin/users/access-logs",
    label: "접속 이력",
    description:
      "플랫폼 로그인·로그아웃·세션만료·자동로그인 이벤트를 시간순으로 조회합니다.",
  },
  {
    prefix: "/experiments/admin/users/",
    label: "유저 상세",
    description: "선택한 학습자의 프로필·수강 이력·인증 방식을 확인합니다.",
  },
  {
    prefix: "/experiments/admin/users",
    label: "유저 관리",
    description: "플랫폼에 등록된 모든 학습자 계정을 조회하고 관리합니다.",
  },
  {
    prefix: "/experiments/admin/enrollments",
    label: "수강 관리",
    description:
      "학습자가 특정 과정에 등록(Enrollment)된 이력과 진도율을 관리합니다.",
  },
  {
    prefix: "/experiments/admin/assessments/exams",
    label: "시험",
    description:
      "객관식·주관식 문항으로 구성된 채점형 평가. 합격 기준을 설정하면 수료 조건으로 활용할 수 있습니다.",
  },
  {
    prefix: "/experiments/admin/assessments/assignments",
    label: "과제",
    description:
      "학습자가 파일·텍스트를 제출하면 관리자·강사가 심사하는 평가 유형입니다.",
  },
  {
    prefix: "/experiments/admin/assessments/surveys",
    label: "설문",
    description: "학습 경험에 대한 의견을 수집하는 비채점형 응답 양식입니다.",
  },
  {
    prefix: "/experiments/admin/assessments",
    label: "평가 관리",
    description: "과정에 포함되는 시험·과제·설문을 통합 관리하는 영역입니다.",
  },
  {
    prefix: "/experiments/admin/certificates/templates",
    label: "수료증 템플릿",
    description:
      "수료 시 발급되는 증명서의 디자인과 기재 항목 형식을 정의합니다.",
  },
  {
    prefix: "/experiments/admin/certificates/issued",
    label: "발급 내역",
    description:
      "수강생에게 실제 발급된 수료증 목록을 조회하고 재발급·취소를 처리합니다.",
  },
  {
    prefix: "/experiments/admin/certificates",
    label: "수료증",
    description:
      "수료 기준을 충족한 학습자에게 자동 또는 수동으로 발급되는 완료 증명서입니다.",
  },
  {
    prefix: "/experiments/admin/announcements",
    label: "공지·메시지",
    description:
      "수강생 전체 또는 특정 그룹에게 보내는 공지사항과 개별 메시지를 관리합니다.",
  },
  {
    prefix: "/experiments/admin/messaging",
    label: "메시지 발송",
    description:
      "템플릿 기반 대량 발송, 이벤트 트리거 자동화, 예약 발송을 설정합니다.",
  },
  {
    prefix: "/experiments/admin/media",
    label: "콘텐츠 라이브러리",
    description:
      "과정 콘텐츠에 사용할 영상·문서·이미지를 업로드하고 관리하는 중앙 저장소입니다.",
  },
  {
    prefix: "/experiments/admin/payments",
    label: "결제 내역(B2C)",
    description:
      "학습자의 과정 구매·환불 트랜잭션 이력을 조회합니다. (B2C 전용)",
  },
  {
    prefix: "/experiments/admin/settings",
    label: "설정",
    description:
      "플랫폼 기본 정보, 브랜딩(로고·색상), 조직 구조 등 운영 환경 전반을 설정합니다.",
  },
  { prefix: "/experiments/admin", label: "대시보드" },
];

export default function Topbar({
  isImpersonating = false,
}: {
  isImpersonating?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAdminAuthStore();
  const match = PAGE_TITLE_MAP.find((m) => pathname.startsWith(m.prefix));
  const title = match?.label ?? "관리자";
  const description = match?.description;

  function handleLogout() {
    logout();
    router.push("/experiments/admin/login");
  }

  return (
    <header
      className={`fixed left-60 right-0 h-14 bg-white border-b border-slate-200 flex items-center px-6 gap-4 z-20 ${isImpersonating ? "top-9" : "top-0"}`}
    >
      <div className="flex items-center gap-1.5 flex-1">
        <h1 className="text-sm font-semibold text-slate-700">{title}</h1>
        {description && (
          <div className="relative group">
            <Info
              size={13}
              className="text-slate-400 cursor-help hover:text-slate-600 transition-colors"
            />
            <div className="absolute left-0 top-full mt-2 w-72 bg-slate-800 text-white text-xs leading-relaxed rounded-lg px-3 py-2.5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
              {description}
              <div className="absolute -top-1 left-1.5 w-2 h-2 bg-slate-800 rotate-45" />
            </div>
          </div>
        )}
      </div>
      <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
        <Bell size={18} />
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-violet-500 rounded-full" />
      </button>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-semibold text-xs">
          관
        </div>
        <span className="text-sm text-slate-700 font-medium">관리자</span>
        <button onClick={handleLogout} className="ml-1 text-slate-400 hover:text-slate-600 transition-colors">
          <LogOut size={15} />
        </button>
      </div>
    </header>
  );
}
