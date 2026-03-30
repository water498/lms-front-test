type PlayerTab = "videojs-mp4" | "videojs-hls" | "native";

type Lesson = { id: string; title: string; duration: number };
type Section = { id: number; title: string; lessons: Lesson[] };

export const CURRICULUM: Section[] = [
  {
    id: 1,
    title: "섹션 1: 안전보건관리체계 기초",
    lessons: [
      { id: "1-1", title: "안전보건관리체계란 무엇인가", duration: 15 },
      { id: "1-2", title: "10대 필수 안전수칙 개요", duration: 20 },
      { id: "1-3", title: "조직 내 안전 역할과 책임", duration: 18 },
    ],
  },
  {
    id: 2,
    title: "섹션 2: 현장 안전수칙 실천",
    lessons: [
      { id: "2-1", title: "개인보호장구 착용 및 관리", duration: 14 },
      { id: "2-2", title: "위험구역 식별과 통제 방법", duration: 22 },
      { id: "2-3", title: "작업 전 안전점검(TBM) 운영법", duration: 12 },
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
