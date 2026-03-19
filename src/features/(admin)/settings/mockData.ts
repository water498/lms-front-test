export const orgSettings = {
  name: "ACME Corp",
  portalName: "ACME Corp LMS",
  contactEmail: "lms-admin@acme.com",
  brandColor: "#7C3AED",
  subdomain: "acme",
  logoUrl: null as string | null,
  faviconUrl: null as string | null,
};

export interface PortalBanner {
  id: string;
  title: string;
  imageUrl: string | null;
  linkUrl: string | null;
  active: boolean;
  startDate: string;
  endDate: string;
  order: number;
}

export const PORTAL_BANNERS: PortalBanner[] = [
  {
    id: "bn-001",
    title: "2026년 상반기 법정의무교육 수강 안내",
    imageUrl: null,
    linkUrl: null,
    active: true,
    startDate: "2026-03-01",
    endDate: "2026-06-30",
    order: 1,
  },
  {
    id: "bn-002",
    title: "신규 직무 과정 오픈 이벤트",
    imageUrl: null,
    linkUrl: null,
    active: true,
    startDate: "2026-03-15",
    endDate: "2026-04-15",
    order: 2,
  },
  {
    id: "bn-003",
    title: "2025년 하반기 우수 학습자 시상식",
    imageUrl: null,
    linkUrl: null,
    active: false,
    startDate: "2025-12-01",
    endDate: "2025-12-31",
    order: 3,
  },
];

export const PORTAL_POPUPS: PortalBanner[] = [
  {
    id: "pp-001",
    title: "개인정보처리방침 개정 안내",
    imageUrl: null,
    linkUrl: null,
    active: true,
    startDate: "2026-03-01",
    endDate: "2026-03-31",
    order: 1,
  },
];

export const legalSettings = {
  termsUpdatedAt: "2025-01-01",
  privacyUpdatedAt: "2025-06-01",
  termsContent: `제1조 (목적)\n이 약관은 ACME Corp(이하 "회사")이 운영하는 LMS 서비스(이하 "서비스")의 이용 조건 및 절차, 회사와 이용자의 권리·의무 및 책임 사항을 규정함을 목적으로 합니다.\n\n제2조 (정의)\n"서비스"란 회사가 제공하는 온라인 학습 관리 시스템을 의미합니다.\n\n제3조 (약관의 효력 및 변경)\n① 이 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력을 발생합니다.`,
  privacyContent: `1. 개인정보의 처리 목적\nACME Corp는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.\n\n2. 개인정보의 처리 및 보유 기간\n학습 이력 및 계정 정보는 서비스 탈퇴 후 3개월간 보관됩니다.\n\n3. 개인정보의 제3자 제공\n회사는 정보주체의 개인정보를 제1조(목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조에 해당하는 경우에만 제3자에게 제공합니다.`,
};
