"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter, redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Lock } from "lucide-react";
import "video.js/dist/video-js.css";

import { CURRICULUM, ALL_LESSONS, VALID_LESSON_IDS, TAB_CONFIGS } from "./mockData";
import { mergeRanges, totalWatched, fmtTime } from "./utils";
import { VideoJsPlayer } from "./components/video-js-player";
import { NativePlayer } from "./components/native-player";
import { ContextPanel } from "./sections/context-panel";

// ── Types ──────────────────────────────────────────────────────────────────

type PlayerTab = "videojs-mp4" | "videojs-hls" | "native";
type Range = [number, number];

interface PlayerCallbacks {
  onDurationChange: (d: number) => void;
  onTimeUpdate: (t: number) => void;
  onEvent: (e: string) => void;
  onEnded: () => void;
}

// ── Module-level completed lessons (survives soft navigation) ──────────────

let _completedLessons = new Set<string>(["1-1"]);

// ── Main Page ──────────────────────────────────────────────────────────────

export default function VideoPlayerLessonFeature() {
  const params = useParams<{ lessonId: string }>();
  const router = useRouter();
  const lessonId = params.lessonId;

  // Redirect invalid lessonIds
  if (!VALID_LESSON_IDS.has(lessonId)) {
    redirect("/experiments/video-player/1-2");
  }

  const currentLesson = lessonId;

  const [activeTab, setActiveTab] = useState<PlayerTab>("videojs-mp4");
  const [restrictMode, setRestrictMode] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [maxWatched, setMaxWatched] = useState(0);
  const [watchedRanges, setWatchedRanges] = useState<Range[]>([]);
  const [eventLog, setEventLog] = useState<string[]>([]);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(_completedLessons);

  const lastTimeRef = useRef(0);
  const maxWatchedRef = useRef(0);

  const addEvent = useCallback((e: string) => {
    const ts = new Date().toLocaleTimeString("ko-KR", { hour12: false });
    setEventLog((prev) => [`${ts}  ${e}`, ...prev].slice(0, 50));
  }, []);

  const handleDurationChange = useCallback((d: number) => setDuration(d), []);

  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time);
    const last = lastTimeRef.current;
    if (time > last && time - last < 2) {
      setWatchedRanges((prev) => mergeRanges(prev, [last, time]));
    }
    lastTimeRef.current = time;
    if (time > maxWatchedRef.current) {
      maxWatchedRef.current = time;
      setMaxWatched(time);
    }
  }, []);

  const handleEnded = useCallback(() => {
    addEvent("ended");
  }, [addEvent]);

  const resetPlayerState = useCallback(() => {
    setDuration(0);
    setCurrentTime(0);
    setMaxWatched(0);
    setWatchedRanges([]);
    setEventLog([]);
    lastTimeRef.current = 0;
    maxWatchedRef.current = 0;
  }, []);

  // Reset player state on lesson change (URL-driven)
  useEffect(() => {
    resetPlayerState();
  }, [lessonId, resetPlayerState]);

  const updateCompleted = useCallback((id: string) => {
    _completedLessons = new Set([..._completedLessons, id]);
    setCompletedLessons(_completedLessons);
  }, []);

  const handleTabChange = (tab: PlayerTab) => {
    setActiveTab(tab);
    resetPlayerState();
  };

  const handleLessonClick = (targetLessonId: string) => {
    if (targetLessonId === currentLesson) return;
    const lessonIdx = ALL_LESSONS.findIndex((l) => l.id === targetLessonId);
    const currentIdx = ALL_LESSONS.findIndex((l) => l.id === currentLesson);
    const isCompleted = completedLessons.has(targetLessonId);
    const isNext =
      lessonIdx === currentIdx + 1 &&
      (!restrictMode || completedLessons.has(currentLesson));
    if (!isCompleted && !isNext) return;
    router.push(`/experiments/video-player/${targetLessonId}`);
  };

  // Completion check
  useEffect(() => {
    if (duration > 0 && !completedLessons.has(currentLesson)) {
      const ratio = totalWatched(watchedRanges) / duration;
      if (ratio >= 0.8) {
        updateCompleted(currentLesson);
        addEvent("✓ 완료! 80% 이상 시청");
      }
    }
  }, [watchedRanges, duration, currentLesson, completedLessons, updateCompleted, addEvent]);

  const callbacks: PlayerCallbacks = {
    onDurationChange: handleDurationChange,
    onTimeUpdate: handleTimeUpdate,
    onEvent: addEvent,
    onEnded: handleEnded,
  };

  const tabConfig = TAB_CONFIGS[activeTab];
  const watchedSecs = totalWatched(watchedRanges);
  const completionRatio = duration > 0 ? watchedSecs / duration : 0;
  const currentLessonCompleted = completedLessons.has(currentLesson);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-zinc-800 shrink-0">
        <Link href="/" className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm">
          ← 홈
        </Link>
        <div className="w-px h-4 bg-zinc-700" />
        <h1 className="font-semibold text-sm">Video Player 실험</h1>
        {restrictMode && (
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-amber-900/50 text-amber-300 font-medium">
            ⚠ 법정의무교육 모드
          </span>
        )}
      </header>

      <ContextPanel />

      {/* Main layout */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left: Player + Controls */}
        <div className="flex-1 flex flex-col overflow-y-auto p-5 gap-4">
          {/* Tab bar */}
          <div className="flex gap-1 bg-zinc-900 rounded-xl p-1 shrink-0">
            {(Object.keys(TAB_CONFIGS) as PlayerTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-zinc-700 text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {TAB_CONFIGS[tab].label}
              </button>
            ))}
          </div>
          <p className="text-xs text-zinc-500 -mt-2 shrink-0">{tabConfig.desc}</p>

          {/* Player */}
          <div className="rounded-xl overflow-hidden bg-black shrink-0">
            {activeTab === "native" ? (
              <NativePlayer
                key={`native-${currentLesson}`}
                src={tabConfig.src}
                restrictMode={restrictMode}
                maxWatched={maxWatched}
                callbacks={callbacks}
              />
            ) : (
              <VideoJsPlayer
                key={`${activeTab}-${currentLesson}`}
                src={tabConfig.src}
                mimeType={tabConfig.mimeType}
                restrictMode={restrictMode}
                maxWatched={maxWatched}
                callbacks={callbacks}
              />
            )}
          </div>

          {/* Legal mode toggle */}
          <div className="flex items-center justify-between bg-zinc-900 rounded-xl px-4 py-3 shrink-0">
            <div>
              <p className="text-sm font-medium text-zinc-200">법정의무교육 모드</p>
              <p className="text-xs text-zinc-500 mt-0.5">
                {restrictMode
                  ? "앞으로 건너뛰기 차단 · 배속 1x 고정 · 순차 이수만 가능"
                  : "자유 탐색 · 배속 변경 · 레슨 자유 이동"}
              </p>
            </div>
            <button
              onClick={() => setRestrictMode(!restrictMode)}
              className={`relative w-12 h-6 rounded-full transition-colors shrink-0 ${
                restrictMode ? "bg-amber-500" : "bg-zinc-700"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  restrictMode ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Progress visualization */}
          <div className="bg-zinc-900 rounded-xl px-4 py-3 flex flex-col gap-3 shrink-0">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-zinc-400">시청 진행 상태</p>
              <div
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  currentLessonCompleted
                    ? "bg-emerald-900/50 text-emerald-300"
                    : "bg-zinc-800 text-zinc-400"
                }`}
              >
                {currentLessonCompleted
                  ? "✓ 완료"
                  : `${Math.round(completionRatio * 100)}% (80% 이상 필요)`}
              </div>
            </div>

            {/* Watched range bar */}
            <div className="relative h-3 bg-zinc-800 rounded-full overflow-hidden">
              {duration > 0 &&
                watchedRanges.map(([s, e], i) => (
                  <div
                    key={i}
                    className="absolute h-full bg-emerald-500/70 rounded-full"
                    style={{
                      left: `${(s / duration) * 100}%`,
                      width: `${Math.max(0.5, ((e - s) / duration) * 100)}%`,
                    }}
                  />
                ))}
              {duration > 0 && (
                <div
                  className="absolute h-full w-0.5 bg-white/80"
                  style={{ left: `${Math.min((currentTime / duration) * 100, 99.5)}%` }}
                />
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>시청 구간: {fmtTime(watchedSecs)} / {fmtTime(duration)}</span>
              <span>현재: {fmtTime(currentTime)}</span>
            </div>

            {/* Event log */}
            <div>
              <p className="text-xs text-zinc-600 mb-1.5">플레이어 이벤트</p>
              <div className="bg-zinc-950 rounded-lg p-2.5 h-28 overflow-y-auto font-mono text-xs space-y-0.5">
                {eventLog.length === 0 ? (
                  <p className="text-zinc-700 text-center pt-4">재생을 시작하면 이벤트가 표시됩니다</p>
                ) : (
                  eventLog.map((e, i) => (
                    <p key={i} className="text-zinc-400 leading-5">{e}</p>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Curriculum */}
        <div className="w-72 shrink-0 border-l border-zinc-800 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-800 shrink-0">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">커리큘럼</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {CURRICULUM.map((section) => (
              <div key={section.id}>
                <div className="px-4 py-2.5 bg-zinc-900/50 sticky top-0">
                  <p className="text-xs font-semibold text-zinc-500">{section.title}</p>
                </div>
                {section.lessons.map((lesson) => {
                  const lessonIdx = ALL_LESSONS.findIndex((l) => l.id === lesson.id);
                  const currentIdx = ALL_LESSONS.findIndex((l) => l.id === currentLesson);
                  const isDone = completedLessons.has(lesson.id);
                  const isCurrent = lesson.id === currentLesson;
                  const isNext =
                    lessonIdx === currentIdx + 1 &&
                    (!restrictMode || completedLessons.has(currentLesson));
                  const isAccessible = isDone || isCurrent || isNext;

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => handleLessonClick(lesson.id)}
                      disabled={!isAccessible || isCurrent}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors border-b border-zinc-800/50 ${
                        isCurrent
                          ? "bg-zinc-800 border-l-2 border-l-violet-500"
                          : isAccessible
                          ? "hover:bg-zinc-900 cursor-pointer"
                          : "opacity-40 cursor-not-allowed"
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {isDone ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                        ) : !isAccessible ? (
                          <Lock className="w-4 h-4 text-zinc-600" />
                        ) : isCurrent ? (
                          <div className="w-4 h-4 rounded-full border-2 border-violet-400 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-zinc-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-xs font-medium leading-tight ${
                            isCurrent
                              ? "text-white"
                              : isDone
                              ? "text-zinc-400"
                              : "text-zinc-300"
                          }`}
                        >
                          {lesson.id}. {lesson.title}
                        </p>
                        <p className="text-xs text-zinc-600 mt-0.5">{lesson.duration}분</p>
                        {isCurrent && duration > 0 && (
                          <div className="mt-1.5 h-1 bg-zinc-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-violet-500 rounded-full transition-all"
                              style={{ width: `${Math.round(completionRatio * 100)}%` }}
                            />
                          </div>
                        )}
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
