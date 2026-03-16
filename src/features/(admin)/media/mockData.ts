export type UploadStatus = "PENDING" | "VALIDATING" | "PROCESSING" | "ACTIVE" | "ERROR";
export type AssetType = "VIDEO" | "PDF" | "IMAGE" | "SCORM";

export interface MediaAsset {
  id: string;
  displayName: string;     // 사람이 읽는 제목 (primary)
  originalName: string;    // 업로드된 파일명 (secondary)
  mimeType: string;
  assetType: AssetType;
  size: string;
  uploadedAt: string;
  status: UploadStatus;
  cdnBaseUrl: string | null;
  launchHref: string | null;
  scormVersion: "1.2" | "2004" | null;
  errorMessage: string | null;
  linkedCourses: string[];
}

export const mediaAssets: MediaAsset[] = [
  {
    id: "ma1", displayName: "React 기초 — 인트로 강의",       originalName: "react_intro.mp4",
    mimeType: "video/mp4", assetType: "VIDEO",
    size: "245.3 MB", uploadedAt: "2025-01-05", status: "ACTIVE",
    cdnBaseUrl: "cdn.acme.com/media/ma1", launchHref: null, scormVersion: null, errorMessage: null,
    linkedCourses: ["React 기초"],
  },
  {
    id: "ma2", displayName: "useState 완전 정복 튜토리얼",    originalName: "usestate_tutorial.mp4",
    mimeType: "video/mp4", assetType: "VIDEO",
    size: "182.7 MB", uploadedAt: "2025-01-06", status: "ACTIVE",
    cdnBaseUrl: "cdn.acme.com/media/ma2", launchHref: null, scormVersion: null, errorMessage: null,
    linkedCourses: ["React 기초"],
  },
  {
    id: "ma3", displayName: "TypeScript 제네릭 심화",         originalName: "typescript_generics.mp4",
    mimeType: "video/mp4", assetType: "VIDEO",
    size: "310.1 MB", uploadedAt: "2025-01-15", status: "ACTIVE",
    cdnBaseUrl: "cdn.acme.com/media/ma3", launchHref: null, scormVersion: null, errorMessage: null,
    linkedCourses: ["TypeScript 심화"],
  },
  {
    id: "ma4", displayName: "컴포넌트 설계 가이드",           originalName: "component_guide.pdf",
    mimeType: "application/pdf", assetType: "PDF",
    size: "2.4 MB", uploadedAt: "2025-01-07", status: "ACTIVE",
    cdnBaseUrl: "cdn.acme.com/media/ma4", launchHref: null, scormVersion: null, errorMessage: null,
    linkedCourses: ["React 기초"],
  },
  {
    id: "ma5", displayName: "TypeScript 공식 핸드북",         originalName: "typescript_handbook.pdf",
    mimeType: "application/pdf", assetType: "PDF",
    size: "5.8 MB", uploadedAt: "2025-01-16", status: "ACTIVE",
    cdnBaseUrl: "cdn.acme.com/media/ma5", launchHref: null, scormVersion: null, errorMessage: null,
    linkedCourses: ["TypeScript 심화"],
  },
  {
    id: "ma6", displayName: "AWS 클라우드 기초 (SCORM)",      originalName: "aws_fundamentals.zip",
    mimeType: "application/zip", assetType: "SCORM",
    size: "48.2 MB", uploadedAt: "2025-02-10", status: "ACTIVE",
    cdnBaseUrl: "cdn.acme.com/media/ma6", launchHref: "cdn.acme.com/media/ma6/index.html", scormVersion: "1.2", errorMessage: null,
    linkedCourses: ["AWS 클라우드 입문"],
  },
  {
    id: "ma7", displayName: "React 기초 코스 썸네일",         originalName: "course_thumbnail_react.png",
    mimeType: "image/png", assetType: "IMAGE",
    size: "0.8 MB", uploadedAt: "2025-01-04", status: "ACTIVE",
    cdnBaseUrl: "cdn.acme.com/media/ma7", launchHref: null, scormVersion: null, errorMessage: null,
    linkedCourses: ["React 기초"],
  },
  {
    id: "ma8", displayName: "Next.js 앱 라우터 강의",         originalName: "nextjs_appdir.mp4",
    mimeType: "video/mp4", assetType: "VIDEO",
    size: "278.9 MB", uploadedAt: "2025-03-16", status: "PROCESSING",
    cdnBaseUrl: null, launchHref: null, scormVersion: null, errorMessage: null,
    linkedCourses: [],
  },
  {
    id: "ma9", displayName: "Docker 기초 실습 (SCORM)",       originalName: "docker_basics.zip",
    mimeType: "application/zip", assetType: "SCORM",
    size: "35.6 MB", uploadedAt: "2025-03-16", status: "VALIDATING",
    cdnBaseUrl: null, launchHref: null, scormVersion: null, errorMessage: null,
    linkedCourses: [],
  },
  {
    id: "ma10", displayName: "SQL 핵심 정리 슬라이드",        originalName: "sql_slides.pdf",
    mimeType: "application/pdf", assetType: "PDF",
    size: "3.1 MB", uploadedAt: "2025-03-15", status: "ERROR",
    cdnBaseUrl: null, launchHref: null, scormVersion: null,
    errorMessage: "파일 검증 실패: PDF 구조가 손상되었습니다.",
    linkedCourses: ["SQL 마스터"],
  },
];
