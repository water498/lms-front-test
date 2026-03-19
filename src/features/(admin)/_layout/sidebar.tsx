"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  Settings,
  LogOut,
  Building2,
  ClipboardList,
  Award,
  Megaphone,
  CreditCard,
  HardDrive,
  MessageSquare,
  ChevronDown,
  BarChart2,
  Globe,
} from "lucide-react";

const BASE = "/experiments/admin";

type NavChild = { href: string; label: string };
type NavLink = {
  kind: "link";
  href: string;
  label: string;
  icon: React.ElementType;
};
type NavAccordion = {
  kind: "accordion";
  label: string;
  icon: React.ElementType;
  basePaths: string[];
  children: NavChild[];
};
type NavItem = NavLink | NavAccordion;
type NavGroup = { label: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    label: "",
    items: [
      {
        kind: "link",
        href: `${BASE}`,
        label: "대시보드",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "학습 관리",
    items: [
      {
        kind: "accordion",
        label: "과정 관리",
        icon: BookOpen,
        basePaths: [`${BASE}/courses`, `${BASE}/sessions`],
        children: [
          { href: `${BASE}/courses`, label: "과정 목록" },
          { href: `${BASE}/sessions`, label: "과정 운영(차수)" },
          { href: `${BASE}/courses/categories`, label: "카테고리" },
        ],
      },
      {
        kind: "accordion",
        label: "수강 관리",
        icon: GraduationCap,
        basePaths: [`${BASE}/enrollments`],
        children: [
          { href: `${BASE}/enrollments`, label: "수강 현황" },
          { href: `${BASE}/enrollments/assign`, label: "수강 배정" },
          { href: `${BASE}/enrollments/progress`, label: "학습 진도" },
        ],
      },
      {
        kind: "accordion",
        label: "평가 관리",
        icon: ClipboardList,
        basePaths: [`${BASE}/assessments`],
        children: [
          { href: `${BASE}/assessments/exams`, label: "시험" },
          { href: `${BASE}/assessments/assignments`, label: "과제" },
          { href: `${BASE}/assessments/surveys`, label: "설문" },
          { href: `${BASE}/assessments/question-bank`, label: "문항 뱅크" },
        ],
      },
      {
        kind: "accordion",
        label: "수료증",
        icon: Award,
        basePaths: [`${BASE}/certificates`],
        children: [
          { href: `${BASE}/certificates/templates`, label: "템플릿" },
          { href: `${BASE}/certificates/issued`, label: "발급 내역" },
        ],
      },
      {
        kind: "link",
        href: `${BASE}/media`,
        label: "미디어 라이브러리",
        icon: HardDrive,
      },
    ],
  },
  {
    label: "포털 관리",
    items: [
      {
        kind: "accordion",
        label: "포털 관리",
        icon: Globe,
        basePaths: [`${BASE}/portal`],
        children: [
          { href: `${BASE}/portal/info`,          label: "포털 정보" },
          { href: `${BASE}/portal/theme`,         label: "테마" },
          { href: `${BASE}/portal/banners`,       label: "배너 · 팝업" },
          { href: `${BASE}/portal/announcements`, label: "공지사항" },
          { href: `${BASE}/portal/legal`,         label: "약관 · 개인정보" },
        ],
      },
    ],
  },
  {
    label: "사용자",
    items: [
      {
        kind: "accordion",
        label: "유저 관리",
        icon: Users,
        basePaths: [`${BASE}/users`],
        children: [
          { href: `${BASE}/users`, label: "유저 목록" },
          { href: `${BASE}/users/groups`, label: "그룹 관리" },
          { href: `${BASE}/users/access-logs`, label: "접속 이력" },
        ],
      },
    ],
  },
  {
    label: "운영",
    items: [
      {
        kind: "accordion",
        label: "통계",
        icon: BarChart2,
        basePaths: [`${BASE}/statistics`],
        children: [
          { href: `${BASE}/statistics/completion`, label: "수료율 현황" },
          { href: `${BASE}/statistics/org`, label: "조직별 학습 현황" },
          { href: `${BASE}/statistics/assessments`, label: "평가 점수 통계" },
        ],
      },
      {
        kind: "link",
        href: `${BASE}/payments`,
        label: "결제 내역",
        icon: CreditCard,
      },
      {
        kind: "accordion",
        label: "메시징",
        icon: MessageSquare,
        basePaths: [`${BASE}/messaging`],
        children: [
          { href: `${BASE}/messaging/sms`,   label: "SMS" },
          { href: `${BASE}/messaging/kakao`, label: "알림톡" },
          { href: `${BASE}/messaging/email`, label: "이메일" },
        ],
      },
      { kind: "link", href: `${BASE}/settings`, label: "설정", icon: Settings },
    ],
  },
];

/** Returns the href of the most-specific child that matches pathname. */
function bestChildMatch(pathname: string, children: NavChild[]): string | null {
  return (
    children
      .filter((c) => pathname.startsWith(c.href))
      .sort((a, b) => b.href.length - a.href.length)[0]?.href ?? null
  );
}

function AccordionItem({
  label,
  icon: Icon,
  basePaths,
  children,
}: NavAccordion) {
  const pathname = usePathname();
  const isInSection = basePaths.some((p) => pathname.startsWith(p));
  const [open, setOpen] = useState(isInSection);

  useEffect(() => {
    if (isInSection) setOpen(true);
  }, [isInSection]);

  const activeHref = bestChildMatch(pathname, children);

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          isInSection
            ? "bg-violet-50 text-violet-600"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        }`}
      >
        <Icon size={16} />
        <span className="flex-1 text-left">{label}</span>
        <ChevronDown
          size={14}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="mt-0.5 ml-3 flex flex-col gap-0.5 border-l border-slate-100 pl-3">
          {children.map(({ href, label: childLabel }) => (
            <Link
              key={href}
              href={href}
              className={`py-1.5 text-sm transition-colors ${
                activeHref === href
                  ? "text-violet-600 font-medium"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {childLabel}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({
  isImpersonating = false,
}: {
  isImpersonating?: boolean;
}) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === `${BASE}`) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`fixed left-0 h-screen w-60 bg-white border-r border-slate-200 flex flex-col z-30 overflow-y-auto ${isImpersonating ? "top-9" : "top-0"}`}
    >
      {/* Org logo + name */}
      <div className="flex items-center gap-3 px-5 h-14 border-b border-slate-200 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
          <Building2 size={16} className="text-white" />
        </div>
        <span className="font-semibold text-slate-800 text-sm">ACME Corp</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 flex flex-col gap-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            {group.label && (
              <p className="px-3 mb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {group.label}
              </p>
            )}
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) =>
                item.kind === "accordion" ? (
                  <AccordionItem key={item.label} {...item} />
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "bg-violet-50 text-violet-600"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <item.icon size={16} />
                    {item.label}
                  </Link>
                ),
              )}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom user info */}
      <div className="border-t border-slate-200 px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-semibold text-xs">
          관
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-800 truncate">관리자</p>
          <p className="text-xs text-slate-400 truncate">admin@acme.com</p>
        </div>
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <LogOut size={15} />
        </button>
      </div>
    </aside>
  );
}
