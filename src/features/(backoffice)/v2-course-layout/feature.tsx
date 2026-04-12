"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  Play,
  Save,
  Send,
  Check,
  AlertTriangle,
} from "lucide-react";
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
    matchPrefixes: (base) => [
      `${base}/info`,
      `${base}/curriculum`,
      `${base}/certificate`,
    ],
    defaultHref: (base) => `${base}/info`,
  },
  {
    id: "operation",
    label: "운영",
    icon: Play,
    matchPrefixes: (base) => [
      `${base}/sessions`,
      `${base}/reviews`,
      `${base}/statistics`,
    ],
    defaultHref: (base) => `${base}/sessions`,
  },
];

/* ── Layer 2: 서브 메뉴 ── */
type Layer2Item = { id: string; label: string; href: (base: string) => string };

const DESIGN_MENU: Layer2Item[] = [
  { id: "info", label: "기본정보", href: (base) => `${base}/info` },
  { id: "curriculum", label: "커리큘럼", href: (base) => `${base}/curriculum` },
  {
    id: "certificate",
    label: "수료설정",
    href: (base) => `${base}/certificate`,
  },
];

const OPERATION_MENU: Layer2Item[] = [
  {
    id: "statistics",
    label: "과정 통계",
    href: (base) => `${base}/statistics`,
  },
  { id: "sessions", label: "차수 관리", href: (base) => `${base}/sessions` },
  { id: "reviews", label: "과정 리뷰", href: (base) => `${base}/reviews` },
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
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[status] ?? "bg-slate-100 text-slate-600"}`}
    >
      {labels[status] ?? status}
    </span>
  );
}

/* ── Publish confirmation modal ── */
function PublishModal({
  courseName,
  onConfirm,
  onClose,
}: {
  courseName: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
            <Send size={18} className="text-violet-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              과정 게시
            </h3>
            <p className="text-sm text-slate-500">
              게시하면 차수를 생성하고 수강 신청을 받을 수 있습니다.
            </p>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-5">
          <div className="flex items-start gap-2">
            <AlertTriangle
              size={14}
              className="text-amber-600 mt-0.5 shrink-0"
            />
            <p className="text-xs text-amber-700">
              게시 후에는 커리큘럼 구조 변경이 제한됩니다. 진행 중인 차수가
              있으면 수료 기준도 수정할 수 없습니다.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors"
          >
            게시하기
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Course Header ── */
function CourseHeader({
  course,
}: {
  course: { title: string; status?: string; category?: string; mode?: string };
}) {
  const router = useRouter();
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const [showPublishModal, setShowPublishModal] = useState(false);

  const handleSave = () => {
    setSaveState("saving");
    setTimeout(() => {
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
    }, 800);
  };

  const handlePublish = () => {
    setShowPublishModal(false);
    // TODO: API call
  };

  return (
    <>
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-5 shrink-0">
        {/* Left: back + title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => router.push("/backoffice/courses")}
            className="text-slate-400 hover:text-violet-600 transition-colors shrink-0"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-sm font-bold text-slate-900 truncate">
            {course.title}
          </h1>
          <StatusBadge status={course.status ?? "DRAFT"} />
          <div className="hidden lg:flex items-center gap-3 ml-3 text-xs text-slate-400">
            {course.category && <span>{course.category}</span>}
            {course.mode && <span>· {course.mode}</span>}
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleSave}
            disabled={saveState === "saving"}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              saveState === "saved"
                ? "text-emerald-600 bg-emerald-50"
                : saveState === "saving"
                  ? "text-slate-400 bg-slate-50 cursor-wait"
                  : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {saveState === "saved" ? <Check size={14} /> : <Save size={14} />}
            {saveState === "saving"
              ? "저장 중..."
              : saveState === "saved"
                ? "저장됨"
                : "저장"}
          </button>
          {(course.status === "DRAFT" || !course.status) && (
            <button
              onClick={() => setShowPublishModal(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors"
            >
              <Send size={14} />
              게시하기
            </button>
          )}
        </div>
      </header>
      {showPublishModal && (
        <PublishModal
          courseName={course.title}
          onConfirm={handlePublish}
          onClose={() => setShowPublishModal(false)}
        />
      )}
    </>
  );
}

/* ── Main Layout ── */
export default function CourseDetailShellV2({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams<{ courseId: string }>();
  const courseId = params.courseId;
  const course = getCourse(courseId);
  const base = `/backoffice/courses/${courseId}`;

  if (!course) {
    return <p className="p-8 text-slate-500">과정을 찾을 수 없습니다.</p>;
  }

  // Active layer 1
  const activeL1 =
    LAYER1.find((item) =>
      item.matchPrefixes(base).some((prefix) => pathname.startsWith(prefix)),
    ) ?? LAYER1[0];

  // Layer 2 menu
  const layer2 = activeL1.id === "design" ? DESIGN_MENU : OPERATION_MENU;

  return (
    <CourseDetailProvider courseId={courseId}>
      <div className="flex flex-col h-[calc(100vh-3.5rem)]">
        {/* Course-specific header */}
        <CourseHeader course={course} />

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
                const isActive =
                  pathname === href || pathname.startsWith(href + "/");
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
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </div>
      </div>
    </CourseDetailProvider>
  );
}
