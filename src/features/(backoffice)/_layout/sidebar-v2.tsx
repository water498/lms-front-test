"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  HardDrive,
  FolderTree,
  Route,
  Award,
  Users,
  Globe,
  Building2,
  Settings,
  MessageSquare,
  Coins,
  CreditCard,
  Wallet,
  User,
  Star,
  ChevronDown,
  Bell,
  FileText,
} from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";

const BASE = "/backoffice";

/* ── Types ── */
type NavChild = { href: string; label: string; permission?: string; featureFlag?: string };
type NavLink = { kind: "link"; href: string; label: string; icon: React.ElementType; permission?: string; featureFlag?: string };
type NavAccordion = { kind: "accordion"; label: string; icon: React.ElementType; basePaths: string[]; children: NavChild[]; permission?: string };
type NavItem = NavLink | NavAccordion;
type NavGroup = { label: string; items: NavItem[]; permission?: string };

/* ── Permission check helpers (프로토타입: role 기반 단순 체크) ── */
function useHasPermission() {
  const { role, tenantType } = useAuthStore();
  const isAdmin = role === "ORG_ADMIN" || role === "SUPER_ADMIN";
  const isInstructor = role === "INSTRUCTOR";

  return {
    has: (perm?: string) => {
      if (!perm) return true;
      if (isAdmin) return true;
      const instructorPerms = [
        "backoffice.access", "course.view", "session.view", "session.grade",
        "session.attendance", "enrollment.view", "assessment.view",
        "question_bank.view", "media.view", "certificate.view_issued",
        "payout.view_own", "report.view", "announcement.view",
        "instructor_profile.manage_own", "notification.send",
      ];
      return instructorPerms.includes(perm);
    },
    hasFlag: (flag?: string) => {
      if (!flag) return true;
      if (tenantType === "B2B") return ["orgStructure", "sso", "mandatoryCourses"].includes(flag);
      if (tenantType === "B2C") return ["payments", "cart"].includes(flag);
      return false;
    },
    isAdmin,
    isInstructor,
  };
}

/* ── Navigation data (v2: 5개 도메인) ── */
const NAV_GROUPS: NavGroup[] = [
  {
    label: "",
    items: [
      { kind: "link", href: BASE, label: "대시보드", icon: LayoutDashboard },
    ],
  },
  {
    label: "과정",
    items: [
      { kind: "link", href: `${BASE}/courses`, label: "과정 목록", icon: BookOpen },
    ],
  },
  {
    label: "리소스",
    items: [
      {
        kind: "accordion", label: "평가 관리", icon: ClipboardList,
        basePaths: [`${BASE}/resources/assessments`],
        children: [
          { href: `${BASE}/resources/assessments/exams`, label: "시험" },
          { href: `${BASE}/resources/assessments/assignments`, label: "과제" },
          { href: `${BASE}/resources/assessments/surveys`, label: "설문" },
          { href: `${BASE}/resources/assessments/question-bank`, label: "문항 뱅크" },
        ],
      },
      { kind: "link", href: `${BASE}/resources/media`, label: "미디어 라이브러리", icon: HardDrive },
      { kind: "link", href: `${BASE}/resources/categories`, label: "카테고리", icon: FolderTree, permission: "course.manage" },
      // { kind: "link", href: `${BASE}/resources/learning-paths`, label: "학습 경로", icon: Route }, // MVP 이후 활성화
    ],
  },
  {
    label: "조직",
    permission: "user.view",
    items: [
      {
        kind: "accordion", label: "사용자", icon: Users,
        basePaths: [`${BASE}/org/users`, `${BASE}/org/groups`, `${BASE}/org/access-logs`],
        children: [
          { href: `${BASE}/org/users`, label: "유저 목록" },
          { href: `${BASE}/org/groups`, label: "그룹 관리" },
          { href: `${BASE}/org/access-logs`, label: "접속 이력" },
        ],
      },
      {
        kind: "accordion", label: "포털 관리", icon: Globe,
        basePaths: [`${BASE}/org/portal`],
        children: [
          { href: `${BASE}/org/portal/info`, label: "포털 정보" },
          { href: `${BASE}/org/portal/theme`, label: "테마" },
          { href: `${BASE}/org/portal/banners`, label: "배너 · 팝업" },
          { href: `${BASE}/org/portal/announcements`, label: "공지사항" },
          { href: `${BASE}/org/portal/legal`, label: "약관 · 개인정보" },
        ],
      },
      { kind: "link", href: `${BASE}/org/structure`, label: "조직 구조", icon: Building2, featureFlag: "orgStructure" },
      { kind: "link", href: `${BASE}/org/sso`, label: "SSO 설정", icon: Settings, featureFlag: "sso" },
      {
        kind: "accordion", label: "수료증 관리", icon: Award,
        basePaths: [`${BASE}/org/certificates`],
        children: [
          { href: `${BASE}/org/certificates`, label: "수료증 템플릿" },
          { href: `${BASE}/org/certificates/issued`, label: "발급 내역" },
        ],
      },
      {
        kind: "accordion", label: "메시징", icon: MessageSquare,
        permission: "messaging.manage",
        basePaths: [`${BASE}/org/messaging`],
        children: [
          { href: `${BASE}/org/messaging/sms`, label: "SMS" },
          { href: `${BASE}/org/messaging/kakao`, label: "알림톡" },
          { href: `${BASE}/org/messaging/email`, label: "이메일" },
        ],
      },
      { kind: "link", href: `${BASE}/org/credits`, label: "크레딧 관리", icon: Coins },
      { kind: "link", href: `${BASE}/org/audit`, label: "감사 로그", icon: FileText },
      { kind: "link", href: `${BASE}/org/announcements`, label: "플랫폼 공지", icon: Bell },
    ],
  },
  {
    label: "재무",
    items: [
      { kind: "link", href: `${BASE}/finance/payouts`, label: "강사 정산 관리", icon: Wallet, permission: "payout.manage" },
      { kind: "link", href: `${BASE}/finance/my-payouts`, label: "내 정산", icon: Wallet, permission: "payout.view_own" },
      { kind: "link", href: `${BASE}/finance/payments`, label: "결제 내역", icon: CreditCard, permission: "payment.manage", featureFlag: "payments" },
    ],
  },
];

/* ── Components ── */

function bestChildMatch(pathname: string, children: NavChild[]): string | null {
  return (
    children
      .filter((c) => pathname.startsWith(c.href))
      .sort((a, b) => b.href.length - a.href.length)[0]?.href ?? null
  );
}

function AccordionItem({ label, icon: Icon, basePaths, children }: NavAccordion) {
  const pathname = usePathname();
  const isInSection = basePaths.some((p) => pathname.startsWith(p));
  const [open, setOpen] = useState(isInSection);

  useEffect(() => { if (isInSection) setOpen(true); }, [isInSection]);

  const activeHref = bestChildMatch(pathname, children);

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          isInSection ? "bg-violet-50 text-violet-600" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        }`}
      >
        <Icon size={16} />
        <span className="flex-1 text-left">{label}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="mt-0.5 ml-3 flex flex-col gap-0.5 border-l border-slate-100 pl-3">
          {children.map(({ href, label: childLabel }) => (
            <Link
              key={href}
              href={href}
              className={`py-1.5 text-sm transition-colors ${
                activeHref === href ? "text-violet-600 font-medium" : "text-slate-500 hover:text-slate-800"
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

function InstructorProfile() {
  const { user } = useAuthStore();
  const { isInstructor } = useHasPermission();
  const pathname = usePathname();

  if (!isInstructor) return null;

  const links = [
    { href: `${BASE}/account`, label: "프로필 편집" },
    { href: `${BASE}/account/bank`, label: "계좌 정보" },
    { href: `${BASE}/account/reviews`, label: "내 리뷰" },
  ];

  return (
    <div className="px-4 py-4 border-b border-slate-200 shrink-0">
      <Link href={`${BASE}/account`} className="flex items-center gap-3 mb-3 hover:opacity-80 transition-opacity">
        <div className="w-11 h-11 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-semibold text-sm shrink-0">
          {user?.name?.[0] ?? "?"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800 truncate">{user?.name ?? "사용자"}</p>
          <p className="text-xs text-slate-400">강사</p>
        </div>
      </Link>
      <div className="flex flex-col gap-0.5 ml-1">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`py-1 text-xs transition-colors ${
              pathname.startsWith(href) ? "text-violet-600 font-medium" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function BackofficeSidebarV2() {
  const pathname = usePathname();
  const { has, hasFlag } = useHasPermission();

  const isActive = (href: string) => {
    if (href === BASE) return pathname === href;
    return pathname.startsWith(href);
  };

  const visibleGroups = NAV_GROUPS
    .filter((g) => has(g.permission))
    .map((g) => ({
      ...g,
      items: g.items.filter((item) => {
        if (!has(item.permission)) return false;
        if ("featureFlag" in item && !hasFlag(item.featureFlag)) return false;
        if (item.kind === "accordion") {
          item = { ...item, children: item.children.filter((c) => has(c.permission) && hasFlag(c.featureFlag)) };
          return item.children.length > 0;
        }
        return true;
      }),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <aside className="fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-60 bg-white border-r border-slate-200 flex flex-col z-20 overflow-y-auto">
      {/* Instructor profile at top */}
      <InstructorProfile />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 flex flex-col gap-4 overflow-y-auto">
        {visibleGroups.map((group) => (
          <div key={group.label || "top"}>
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
                )
              )}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
