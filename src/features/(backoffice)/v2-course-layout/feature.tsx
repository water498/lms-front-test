"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Play, Save, Send } from "lucide-react";
import { getCourse } from "../course-layout/mockData";
import { CourseDetailProvider } from "./context";

/* ── Layer 1: 아이콘 사이드바 (설계 / 운영) ── */
type Layer1Item = {
  id: string;
  label: string;
  icon: React.ElementType;
  matchPrefixes: (base: string) => string[];
  defaultHref: (base: string) => string;
};

const LAYER1: Layer1Item[] = [
  {
    id: "design",
    label: "설계",
    icon: Pencil,
    matchPrefixes: (base) => [`${base}/info`, `${base}/curriculum`, `${base}/certificate`],
    defaultHref: (base) => `${base}/info`,
  },
  {
    id: "operation",
    label: "운영",
    icon: Play,
    matchPrefixes: (base) => [`${base}/sessions`, `${base}/reviews`],
    defaultHref: (base) => `${base}/sessions`,
  },
];

/* ── Layer 2: 서브 메뉴 ── */
type Layer2Item = { id: string; label: string; href: (base: string) => string };

const DESIGN_MENU: Layer2Item[] = [
  { id: "info",        label: "기본정보",   href: (base) => `${base}/info` },
  { id: "curriculum",  label: "커리큘럼",   href: (base) => `${base}/curriculum` },
  { id: "certificate", label: "수료설정",   href: (base) => `${base}/certificate` },
];

const OPERATION_MENU: Layer2Item[] = [
  { id: "sessions", label: "차수 관리", href: (base) => `${base}/sessions` },
  { id: "reviews",  label: "과정 리뷰", href: (base) => `${base}/reviews` },
];

/* ── Status badge ── */
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    DRAFT: "bg-slate-100 text-slate-600",
    PUBLISHED: "bg-emerald-50 text-emerald-700",
    ARCHIVED: "bg-amber-50 text-amber-700",
  };
  const labels: Record<string, string> = {
    DRAFT: "초안",
    PUBLISHED: "게시됨",
    ARCHIVED: "보관됨",
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[status] ?? "bg-slate-100 text-slate-600"}`}>
      {labels[status] ?? status}
    </span>
  );
}

/* ── Course Header ── */
function CourseHeader({ course, base }: { course: { title: string; status?: string; category?: string; mode?: string }; base: string }) {
  const router = useRouter();

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-5 shrink-0">
      {/* Left: back + title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => router.push("/backoffice/courses")}
          className="text-slate-400 hover:text-violet-600 transition-colors shrink-0"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-sm font-bold text-slate-900 truncate">{course.title}</h1>
        <StatusBadge status={course.status ?? "DRAFT"} />
        <div className="hidden lg:flex items-center gap-3 ml-3 text-xs text-slate-400">
          {course.category && <span>{course.category}</span>}
          {course.mode && <span>· {course.mode}</span>}
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          <Save size={14} />
          저장
        </button>
        {(course.status === "DRAFT" || !course.status) && (
          <button className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors">
            <Send size={14} />
            게시하기
          </button>
        )}
      </div>
    </header>
  );
}

/* ── Main Layout ── */
export default function CourseDetailShellV2({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams<{ courseId: string }>();
  const courseId = params.courseId;
  const course = getCourse(courseId);
  const base = `/backoffice/courses/${courseId}`;

  if (!course) {
    return <p className="p-8 text-slate-500">과정을 찾을 수 없습니다.</p>;
  }

  // Active layer 1
  const activeL1 = LAYER1.find((item) =>
    item.matchPrefixes(base).some((prefix) => pathname.startsWith(prefix))
  ) ?? LAYER1[0];

  // Layer 2 menu
  const layer2 = activeL1.id === "design" ? DESIGN_MENU : OPERATION_MENU;

  return (
    <CourseDetailProvider courseId={courseId}>
      <div className="flex flex-col h-[calc(100vh-3.5rem)]">
        {/* Course-specific header */}
        <CourseHeader course={course} base={base} />

        <div className="flex flex-1 min-h-0">
          {/* Layer 1: icon sidebar */}
          <div className="w-16 bg-slate-50 border-r border-slate-200 flex flex-col items-center py-4 gap-2 shrink-0">
            {LAYER1.map((item) => {
              const isActive = item.id === activeL1.id;
              return (
                <Link
                  key={item.id}
                  href={item.defaultHref(base)}
                  className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-colors ${
                    isActive
                      ? "bg-violet-100 text-violet-600"
                      : "text-slate-400 hover:bg-slate-200 hover:text-slate-600"
                  }`}
                  title={item.label}
                >
                  <item.icon size={18} />
                  <span className="text-[9px] font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Layer 2: sub menu */}
          <div className="w-44 bg-white border-r border-slate-200 flex flex-col py-4 shrink-0">
            <p className="px-4 mb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              {activeL1.label}
            </p>
            <div className="flex flex-col gap-0.5 px-2">
              {layer2.map((item) => {
                const href = item.href(base);
                const isActive = pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link
                    key={item.id}
                    href={href}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? "bg-violet-50 text-violet-600"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Content area */}
          <div className="flex-1 overflow-y-auto p-6">
            {children}
          </div>
        </div>
      </div>
    </CourseDetailProvider>
  );
}
