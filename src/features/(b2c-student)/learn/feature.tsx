"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Lock,
  Play,
  FileQuestion,
  PenLine,
  X,
  BookOpen,
} from "lucide-react";
import "video.js/dist/video-js.css";

import { VideoJsPlayer } from "@/features/(video-player)/lesson/components/video-js-player";
import { mergeRanges, totalWatched } from "@/features/(video-player)/lesson/utils";
import { courseDetails, defaultCourseDetail } from "../courses/mockData";
import { allCourses, inProgressCourses } from "../home/mockData";
import type { CourseSubject } from "@/lib/models";

// ── Types ───────────────────────────────────────────────────────────────────

type Range = [number, number];

interface FlatActivity {
  id: string;
  title: string;
  type: string;
  duration?: number;
  questionCount?: number;
  subjectTitle: string;
  subjectId: string;
  index: number; // global index
}

// ── Module-level completion state ─────────────────────────────────────────

let _completed = new Set<string>();

// ── Flat activity list builder ────────────────────────────────────────────

function flattenActivities(subjects: CourseSubject[]): FlatActivity[] {
  const result: FlatActivity[] = [];
  let idx = 0;
  for (const subject of subjects) {
    for (const activity of subject.activities) {
      result.push({
        id: activity.id,
        title: activity.title,
        type: activity.type,
        duration: activity.duration,
        questionCount: activity.questionCount,
        subjectTitle: subject.title,
        subjectId: subject.id,
        index: idx++,
      });
    }
  }
  return result;
}

// ── Props ────────────────────────────────────────────────────────────────

interface Props {
  courseId: string;
  activityId: string;
}

// ── Main ──────────────────────────────────────────────────────────────────

export default function LearnFeature({ courseId, activityId }: Props) {
  const router = useRouter();

  const allCoursesList = [...allCourses, ...inProgressCourses];
  const course = allCoursesList.find((c) => c.id === courseId);
  const detail = courseDetails[courseId] ?? defaultCourseDetail;
  const activities = flattenActivities(detail.subjects);

  const current = activities.find((a) => a.id === activityId) ?? activities[0];
  const prevActivity = current ? activities[current.index - 1] : undefined;
  const nextActivity = current ? activities[current.index + 1] : undefined;

  // Player state
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [watchedRanges, setWatchedRanges] = useState<Range[]>([]);
  const [completed, setCompleted] = useState<Set<string>>(new Set(_completed));
  const lastTimeRef = useRef(0);
  const maxWatchedRef = useRef(0);

  const updateCompleted = useCallback((id: string) => {
    _completed = new Set([..._completed, id]);
    setCompleted(new Set(_completed));
  }, []);

  const resetPlayerState = useCallback(() => {
    setDuration(0);
    setCurrentTime(0);
    setWatchedRanges([]);
    lastTimeRef.current = 0;
    maxWatchedRef.current = 0;
  }, []);

  useEffect(() => {
    resetPlayerState();
  }, [activityId, resetPlayerState]);

  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time);
    const last = lastTimeRef.current;
    if (time > last && time - last < 2) {
      setWatchedRanges((prev) => mergeRanges(prev, [last, time]));
    }
    lastTimeRef.current = time;
    if (time > maxWatchedRef.current) {
      maxWatchedRef.current = time;
    }
  }, []);

  // Completion check
  useEffect(() => {
    if (current && current.type === "VIDEO" && duration > 0 && !completed.has(current.id)) {
      const ratio = totalWatched(watchedRanges) / duration;
      if (ratio >= 0.8) updateCompleted(current.id);
    }
  }, [watchedRanges, duration, current, completed, updateCompleted]);

  const completedCount = activities.filter((a) => completed.has(a.id)).length;
  const progressPct = activities.length > 0 ? Math.round((completedCount / activities.length) * 100) : 0;
  const isCurrentCompleted = current ? completed.has(current.id) : false;

  if (!course) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">강의를 찾을 수 없습니다.</p>
          <Link href="/experiments/b2c-student" className="text-violet-400 hover:text-violet-300 text-sm">
            홈으로
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Header */}
      <header className="shrink-0 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/60 z-40">
        <div className="h-14 px-4 flex items-center gap-3">
          {/* Back */}
          <button
            onClick={() => router.push(`/experiments/b2c-student/courses/${courseId}`)}
            className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">강의 정보</span>
          </button>

          <div className="w-px h-4 bg-zinc-700" />

          {/* Course title */}
          <p className="text-sm font-medium text-zinc-200 truncate flex-1">{course.title}</p>

          {/* Progress */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <div className="w-32 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-500 rounded-full transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-xs text-zinc-500">{completedCount}/{activities.length}</span>
          </div>

          <Link
            href="/experiments/b2c-student"
            className="shrink-0 p-1.5 text-zinc-500 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Content area */}
        <div className="flex-1 overflow-y-auto">
          {/* Video / placeholder */}
          <div className="bg-black w-full">
            {current?.type === "VIDEO" ? (
              <div className="max-w-5xl mx-auto w-full aspect-video">
                <VideoJsPlayer
                  key={`player-${activityId}`}
                  src="/sample-video.mp4"
                  mimeType="video/mp4"
                  restrictMode={false}
                  maxWatched={maxWatchedRef.current}
                  callbacks={{
                    onDurationChange: setDuration,
                    onTimeUpdate: handleTimeUpdate,
                    onEvent: () => {},
                    onEnded: () => { if (current) updateCompleted(current.id); },
                  }}
                />
              </div>
            ) : current?.type === "QUIZ" ? (
              <div className="max-w-5xl mx-auto w-full aspect-video flex items-center justify-center">
                <div className="text-center flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                    <FileQuestion className="w-8 h-8 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white mb-1">퀴즈</p>
                    <p className="text-sm text-zinc-400">{current.questionCount}문제</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-5xl mx-auto w-full aspect-video flex items-center justify-center">
                <div className="text-center flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center">
                    <PenLine className="w-8 h-8 text-sky-400" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white mb-1">과제</p>
                    <p className="text-sm text-zinc-400">{current?.questionCount}개 항목</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Lesson info */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-4">
            {/* Title + completion */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-zinc-500 mb-1">{current?.subjectTitle}</p>
                <h1 className="text-lg font-bold text-white leading-snug">{current?.title}</h1>
              </div>
              {isCurrentCompleted && (
                <div className="flex items-center gap-1.5 text-sm text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                  완료
                </div>
              )}
            </div>

            {/* QUIZ/ASSIGNMENT action area */}
            {current?.type === "QUIZ" && (
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <FileQuestion className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-white">퀴즈 — {current.questionCount}문제</p>
                    <p className="text-xs text-zinc-500 mt-0.5">각 문제를 풀고 80% 이상 정답 시 완료 처리됩니다</p>
                  </div>
                </div>
                <button
                  onClick={() => updateCompleted(current.id)}
                  className="self-start px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm rounded-xl transition-colors"
                >
                  퀴즈 시작 (데모: 즉시 완료)
                </button>
              </div>
            )}

            {current?.type === "ASSIGNMENT" && (
              <div className="bg-sky-500/5 border border-sky-500/20 rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <PenLine className="w-5 h-5 text-sky-400 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-white">과제 — {current.questionCount}개 항목</p>
                    <p className="text-xs text-zinc-500 mt-0.5">과제를 제출하면 강사가 피드백을 제공합니다</p>
                  </div>
                </div>
                <button
                  onClick={() => updateCompleted(current.id)}
                  className="self-start px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-black font-semibold text-sm rounded-xl transition-colors"
                >
                  과제 제출 (데모: 즉시 완료)
                </button>
              </div>
            )}

            {/* Prev / Next navigation */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
              {prevActivity ? (
                <Link
                  href={`/experiments/b2c-student/learn/${courseId}/${prevActivity.id}`}
                  className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors group"
                >
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                  <div className="text-left">
                    <p className="text-xs text-zinc-600">이전</p>
                    <p className="line-clamp-1 max-w-[160px]">{prevActivity.title}</p>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {nextActivity ? (
                <Link
                  href={`/experiments/b2c-student/learn/${courseId}/${nextActivity.id}`}
                  className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors group text-right"
                >
                  <div>
                    <p className="text-xs text-zinc-600">다음</p>
                    <p className="line-clamp-1 max-w-[160px]">{nextActivity.title}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ) : (
                <div className="flex items-center gap-2 text-sm text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  강의 완료!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Curriculum sidebar */}
        <div className="hidden lg:flex w-72 xl:w-80 shrink-0 border-l border-zinc-800 flex-col overflow-hidden">
          {/* Sidebar header */}
          <div className="px-4 py-3 border-b border-zinc-800 shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-zinc-500" />
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">커리큘럼</span>
            </div>
            <span className="text-xs text-zinc-500">{progressPct}% 완료</span>
          </div>

          {/* Lesson list */}
          <div className="flex-1 overflow-y-auto">
            {detail.subjects.map((subject) => (
              <div key={subject.id}>
                {/* Section title */}
                <div className="px-4 py-2.5 bg-zinc-900/60 sticky top-0 z-10 border-b border-zinc-800/50">
                  <p className="text-xs font-semibold text-zinc-500 leading-tight">{subject.title}</p>
                </div>

                {/* Activities */}
                {subject.activities.map((activity) => {
                  const isDone = completed.has(activity.id);
                  const isCurrent = activity.id === activityId;
                  const flatAct = activities.find((a) => a.id === activity.id);
                  const prevIdx = flatAct ? flatAct.index - 1 : -1;
                  const prevAct = prevIdx >= 0 ? activities[prevIdx] : undefined;
                  const isAccessible = isDone || isCurrent || !prevAct || completed.has(prevAct.id);

                  return (
                    <button
                      key={activity.id}
                      onClick={() => {
                        if (isAccessible && !isCurrent)
                          router.push(`/experiments/b2c-student/learn/${courseId}/${activity.id}`);
                      }}
                      disabled={!isAccessible || isCurrent}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left border-b border-zinc-800/40 transition-colors ${
                        isCurrent
                          ? "bg-zinc-800 border-l-2 border-l-violet-500"
                          : isAccessible
                          ? "hover:bg-zinc-900/60 cursor-pointer"
                          : "opacity-40 cursor-not-allowed"
                      }`}
                    >
                      {/* Status icon */}
                      <div className="shrink-0 mt-0.5">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : !isAccessible ? (
                          <Lock className="w-4 h-4 text-zinc-600" />
                        ) : isCurrent ? (
                          <div className="w-4 h-4 rounded-full border-2 border-violet-400 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                          </div>
                        ) : activity.type === "VIDEO" ? (
                          <Play className="w-4 h-4 text-zinc-500" />
                        ) : activity.type === "QUIZ" ? (
                          <FileQuestion className="w-4 h-4 text-amber-500/70" />
                        ) : (
                          <PenLine className="w-4 h-4 text-sky-500/70" />
                        )}
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium leading-snug ${
                          isCurrent ? "text-white" : isDone ? "text-zinc-500" : "text-zinc-300"
                        }`}>
                          {activity.title}
                        </p>
                        <p className="text-xs text-zinc-600 mt-0.5">
                          {activity.type === "VIDEO"
                            ? `${activity.duration}분`
                            : activity.type === "QUIZ"
                            ? `퀴즈 · ${activity.questionCount}문제`
                            : `과제 · ${activity.questionCount}항목`}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
