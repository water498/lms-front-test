"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  ClipboardList,
  HardDrive,
  Award,
  Users,
  Globe,
  BarChart2,
  CreditCard,
  Wallet,
  MessageSquare,
  Coins,
  Settings,
  Bell,
  Building2,
  ChevronDown,
  LogOut,
  User,
  Star,
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
      // Admin은 전부 허용
      if (isAdmin) return true;
      // Instructor 허용 목록
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

/* ── Navigation data ── */
const NAV_GROUPS: NavGroup[] = [
  {
    label: "",
    items: [
      { kind: "link", href: BASE, label: "대시보드", icon: LayoutDashboard },
    ],
  },
  {
    label: "콘텐츠",
    items: [
      {
        kind: "accordion", label: "과정 관리", icon: BookOpen,
        basePaths: [`${BASE}/courses`, `${BASE}/learning-paths`],
        children: [
          { href: `${BASE}/courses`, label: "과정 목록" },
          { href: `${BASE}/courses/categories`, label: "카테고리", permission: "course.manage" },
          { href: `${BASE}/learning-paths`, label: "학습 경로" },
        ],
      },
      {
        kind: "accordion", label: "평가 관리", icon: ClipboardList,
        basePaths: [`${BASE}/assessments`],
        children: [
          { href: `${BASE}/assessments/exams`, label: "시험" },
          { href: `${BASE}/assessments/assignments`, label: "과제" },
          { href: `${BASE}/assessments/surveys`, label: "설문" },
          { href: `${BASE}/assessments/question-bank`, label: "문항 뱅크" },
        ],
      },
      { kind: "link", href: `${BASE}/media`, label: "미디어 라이브러리", icon: HardDrive },
    ],
  },
  {
    label: "운영",
    items: [
      { kind: "link", href: `${BASE}/sessions`, label: "차수 현황", icon: GraduationCap },
      {
        kind: "accordion", label: "수강 관리", icon: GraduationCap,
        basePaths: [`${BASE}/enrollments`],
        children: [
          { href: `${BASE}/enrollments`, label: "수강 현황" },
          { href: `${BASE}/enrollments/assign`, label: "수강 배정", permission: "enrollment.manage" },
        ],
      },
      { kind: "link", href: `${BASE}/certificates/issued`, label: "수료증 발급", icon: Award },
      { kind: "link", href: `${BASE}/announcements`, label: "플랫폼 공지", icon: Bell },
    ],
  },
  {
    label: "조직/설정",
    permission: "user.view",
    items: [
      {
        kind: "accordion", label: "유저 관리", icon: Users,
        basePaths: [`${BASE}/org/users`],
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
      { kind: "link", href: `${BASE}/org/audit`, label: "감사 로그", icon: Settings },
      {
        kind: "accordion", label: "수료증 템플릿", icon: Award,
        basePaths: [`${BASE}/certificates/templates`],
        children: [
          { href: `${BASE}/certificates/templates`, label: "템플릿 관리" },
        ],
      },
    ],
  },
  {
    label: "정산",
    items: [
      { kind: "link", href: `${BASE}/payouts`, label: "강사 정산 관리", icon: Wallet, permission: "payout.manage" },
      { kind: "link", href: `${BASE}/payments`, label: "결제 내역", icon: CreditCard, permission: "payment.manage", featureFlag: "payments" },
      { kind: "link", href: `${BASE}/my-payouts`, label: "내 정산", icon: Wallet, permission: "payout.view_own" },
    ],
  },
  {
    label: "메시징",
    permission: "messaging.manage",
    items: [
      {
        kind: "accordion", label: "메시징", icon: MessageSquare,
        basePaths: [`${BASE}/messaging`],
        children: [
          { href: `${BASE}/messaging/sms`, label: "SMS" },
          { href: `${BASE}/messaging/kakao`, label: "알림톡" },
          { href: `${BASE}/messaging/email`, label: "이메일" },
        ],
      },
      { kind: "link", href: `${BASE}/credits`, label: "크레딧", icon: Coins },
    ],
  },
  {
    label: "리포트",
    items: [
      {
        kind: "accordion", label: "통계", icon: BarChart2,
        basePaths: [`${BASE}/reports`],
        children: [
          { href: `${BASE}/reports/completion`, label: "수료율 현황" },
          { href: `${BASE}/reports/org`, label: "조직별 학습 현황", featureFlag: "orgStructure" },
          { href: `${BASE}/reports/assessments`, label: "평가 점수 통계" },
        ],
      },
    ],
  },
  {
    label: "내 프로필",
    permission: "instructor_profile.manage_own",
    items: [
      { kind: "link", href: `${BASE}/profile`, label: "프로필 편집", icon: User },
      { kind: "link", href: `${BASE}/profile/bank`, label: "계좌 정보", icon: CreditCard },
      { kind: "link", href: `${BASE}/profile/reviews`, label: "내 리뷰", icon: Star },
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

export default function BackofficeSidebar() {
  const pathname = usePathname();
  const { role, user, tenantType } = useAuthStore();
  const { has, hasFlag } = useHasPermission();
  const { logout } = useAuthStore();

  const isActive = (href: string) => {
    if (href === BASE) return pathname === href;
    return pathname.startsWith(href);
  };

  // 메뉴 필터링
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

  const roleLabel = role === "ORG_ADMIN" ? "관리자" : role === "INSTRUCTOR" ? "강사" : role ?? "";
  const tenantLabel = tenantType === "B2B" ? "B2B" : "B2C";

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-slate-200 flex flex-col z-30 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-5 h-14 border-b border-slate-200 flex-shrink-0">
        <span className="text-sm font-bold text-slate-900">Backoffice</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-100 text-violet-600 font-medium">
          {roleLabel} · {tenantLabel}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 flex flex-col gap-4">
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

      {/* Bottom */}
      <div className="border-t border-slate-200 px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-semibold text-xs">
          {user?.name?.[0] ?? "?"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-800 truncate">{user?.name ?? "사용자"}</p>
          <p className="text-xs text-slate-400 truncate">{user?.email ?? ""}</p>
        </div>
        <button
          onClick={() => { logout(); window.location.href = "/login"; }}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <LogOut size={15} />
        </button>
      </div>
    </aside>
  );
}
