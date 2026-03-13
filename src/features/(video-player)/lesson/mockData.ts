type PlayerTab = "videojs-mp4" | "videojs-hls" | "native";

type Lesson = { id: string; title: string; duration: number };
type Section = { id: number; title: string; lessons: Lesson[] };

export const CURRICULUM: Section[] = [
  {
    id: 1,
    title: "섹션 1: LMS 개요",
    lessons: [
      { id: "1-1", title: "LMS란 무엇인가", duration: 15 },
      { id: "1-2", title: "학습 관리 시스템 구조", duration: 20 },
      { id: "1-3", title: "SCORM 표준 이해", duration: 18 },
    ],
  },
  {
    id: 2,
    title: "섹션 2: 콘텐츠 유형",
    lessons: [
      { id: "2-1", title: "비디오 콘텐츠", duration: 12 },
      { id: "2-2", title: "SCORM 패키지", duration: 25 },
      { id: "2-3", title: "퀴즈와 평가", duration: 10 },
    ],
  },
];

export const ALL_LESSONS = CURRICULUM.flatMap((s) => s.lessons);
export const VALID_LESSON_IDS = new Set(ALL_LESSONS.map((l) => l.id));

export const TAB_CONFIGS: Record<PlayerTab, { label: string; desc: string; src: string; mimeType: string }> = {
  "videojs-mp4": {
    label: "Video.js (MP4)",
    desc: "Video.js VHS — mp4 직접 재생, 크로스브라우저 컨트롤 UI 제공",
    src: "/sample-video.mp4",
    mimeType: "video/mp4",
  },
  "videojs-hls": {
    label: "Video.js (HLS)",
    desc: "Video.js 내장 VHS — m3u8 파싱·세그먼트 fetch·버퍼 관리 모두 JS에서 처리. ffmpeg으로 변환 필요",
    src: "/sample-hls/playlist.m3u8",
    mimeType: "application/x-mpegURL",
  },
  native: {
    label: "Native HTML5",
    desc: "브라우저 네이티브 <video> — Chrome은 HLS 미지원, mp4만 재생",
    src: "/sample-video.mp4",
    mimeType: "video/mp4",
  },
};
