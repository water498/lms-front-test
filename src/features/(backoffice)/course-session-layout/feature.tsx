"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Users, CalendarCheck, ClipboardList, MessageCircle, FileText } from "lucide-react";
import { instructorCourses, CURRENT_INSTRUCTOR_ID } from "../shared/mockData";

const TABS = [
  { id: "students",   label: "수강생",  icon: Users,           href: (base: string) => `${base}/students` },
  { id: "attendance", label: "출결",    icon: CalendarCheck,   href: (base: string) => `${base}/attendance` },
  { id: "grading",    label: "채점",    icon: ClipboardList,   href: (base: string) => `${base}/grading` },
  { id: "qna",        label: "Q&A",     icon: MessageCircle,   href: (base: string) => `${base}/qna` },
  { id: "resources",  label: "자료",    icon: FileText,        href: (base: string) => `${base}/resources` },
];

export default function SessionShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ sessionId: string }>();
  const sessionId = params.sessionId;

  const courses = instructorCourses[CURRENT_INSTRUCTOR_ID] ?? [];
  const course = courses.find((c) => c.sessionId === sessionId);

  const base = `/backoffice/sessions/${sessionId}`;

  if (!course) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p className="text-sm">세션을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="p-8 flex flex-col gap-6">
      {/* 헤더 */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors shrink-0 mt-0.5"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{course.courseTitle}</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {course.sessionName} · {course.enrolleeCount}명 수강 ·{" "}
            <span className={`font-medium ${course.role === "PRIMARY" ? "text-violet-600" : "text-slate-500"}`}>
              {course.role === "PRIMARY" ? "주 강사" : "보조 강사"}
            </span>
          </p>
        </div>
      </div>

      {/* 탭 + 콘텐츠 */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {/* 탭 헤더 */}
        <div className="flex border-b border-slate-200">
          {TABS.map(({ id, label, icon: Icon, href }) => {
            const tabHref = href(base);
            const isActive = pathname === tabHref;
            return (
              <Link
                key={id}
                href={tabHref}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-colors border-b-2 ${
                  isActive
                    ? "text-slate-900 border-violet-500"
                    : "text-slate-400 border-transparent hover:text-slate-700"
                }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
        </div>

        {/* 탭 콘텐츠 */}
        <div>{children}</div>
      </div>
    </div>
  );
}
