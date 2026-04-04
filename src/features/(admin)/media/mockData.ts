export type { UploadStatus, AssetType, MediaAsset, MediaFolder } from "@/lib/models";
import type { MediaAsset, MediaFolder } from "@/lib/models";

export const mediaFolders: MediaFolder[] = [
  { id: "f1", tenantId: "t1", name: "2025년 안전교육", parentId: undefined, order: 0, createdAt: "2025-01-01" },
  { id: "f2", tenantId: "t1", name: "공통 자료", parentId: undefined, order: 1, createdAt: "2025-01-01" },
  { id: "f3", tenantId: "t1", name: "동영상", parentId: "f1", order: 0, createdAt: "2025-02-01" },
  { id: "f4", tenantId: "t1", name: "문서", parentId: "f1", order: 1, createdAt: "2025-02-01" },
  { id: "f5", tenantId: "t1", name: "SCORM 패키지", parentId: "f2", order: 0, createdAt: "2025-03-01" },
];

export const mediaAssets: MediaAsset[] = [
  {
    id: "ma1", displayName: "React 기초 — 인트로 강의",       originalName: "react_intro.mp4",
    mimeType: "video/mp4", assetType: "VIDEO", folderId: "f3",
    sizeBytes: 257226547, uploadedAt: "2025-01-05", status: "ACTIVE",
    cdnBaseUrl: "cdn.acme.com/media/ma1", launchHref: null, scormVersion: null, errorMessage: null,
    linkedCourses: ["React 기초"],
    tags: ["React", "기초"],
  },
  {
    id: "ma2", displayName: "useState 완전 정복 튜토리얼",    originalName: "usestate_tutorial.mp4",
    mimeType: "video/mp4", assetType: "VIDEO", folderId: "f3",
    sizeBytes: 191614157, uploadedAt: "2025-01-06", status: "ACTIVE",
    cdnBaseUrl: "cdn.acme.com/media/ma2", launchHref: null, scormVersion: null, errorMessage: null,
    linkedCourses: ["React 기초"],
    tags: ["React", "Hook", "useState"],
  },
  {
    id: "ma3", displayName: "TypeScript 제네릭 심화",         originalName: "typescript_generics.mp4",
    mimeType: "video/mp4", assetType: "VIDEO",
    sizeBytes: 325165466, uploadedAt: "2025-01-15", status: "ACTIVE",
    cdnBaseUrl: "cdn.acme.com/media/ma3", launchHref: null, scormVersion: null, errorMessage: null,
    linkedCourses: ["TypeScript 심화"],
    tags: ["TypeScript", "타입시스템"],
  },
  {
    id: "ma4", displayName: "컴포넌트 설계 가이드",           originalName: "component_guide.pdf",
    mimeType: "application/pdf", assetType: "PDF", folderId: "f4",
    sizeBytes: 2516582, uploadedAt: "2025-01-07", status: "ACTIVE",
    cdnBaseUrl: "cdn.acme.com/media/ma4", launchHref: null, scormVersion: null, errorMessage: null,
    linkedCourses: ["React 기초"],
    tags: ["TypeScript", "심화"],
  },
  {
    id: "ma5", displayName: "TypeScript 공식 핸드북",         originalName: "typescript_handbook.pdf",
    mimeType: "application/pdf", assetType: "PDF", folderId: "f4",
    sizeBytes: 6081741, uploadedAt: "2025-01-16", status: "ACTIVE",
    cdnBaseUrl: "cdn.acme.com/media/ma5", launchHref: null, scormVersion: null, errorMessage: null,
    linkedCourses: ["TypeScript 심화"],
    tags: ["법정의무교육", "안전보건"],
  },
  {
    id: "ma6", displayName: "AWS 클라우드 기초 (SCORM)",      originalName: "aws_fundamentals.zip",
    mimeType: "application/zip", assetType: "SCORM", folderId: "f5",
    sizeBytes: 50542797, uploadedAt: "2025-02-10", status: "ACTIVE",
    cdnBaseUrl: "cdn.acme.com/media/ma6", launchHref: "cdn.acme.com/media/ma6/index.html", scormVersion: "1.2", errorMessage: null,
    linkedCourses: ["AWS 클라우드 입문"],
    tags: ["AWS", "클라우드", "SCORM"],
  },
  {
    id: "ma7", displayName: "React 기초 코스 썸네일",         originalName: "course_thumbnail_react.png",
    mimeType: "image/png", assetType: "IMAGE",
    sizeBytes: 838861, uploadedAt: "2025-01-04", status: "ACTIVE",
    cdnBaseUrl: "cdn.acme.com/media/ma7", launchHref: null, scormVersion: null, errorMessage: null,
    linkedCourses: ["React 기초"],
    tags: ["React", "이미지"],
  },
  {
    id: "ma8", displayName: "Next.js 앱 라우터 강의",         originalName: "nextjs_appdir.mp4",
    mimeType: "video/mp4", assetType: "VIDEO",
    sizeBytes: 292481843, uploadedAt: "2025-03-16", status: "PROCESSING",
    cdnBaseUrl: null, launchHref: null, scormVersion: null, errorMessage: null,
    linkedCourses: [],
    tags: ["Next.js", "앱라우터"],
  },
  {
    id: "ma9", displayName: "Docker 기초 실습 (SCORM)",       originalName: "docker_basics.zip",
    mimeType: "application/zip", assetType: "SCORM",
    sizeBytes: 37325414, uploadedAt: "2025-03-16", status: "VALIDATING",
    cdnBaseUrl: null, launchHref: null, scormVersion: null, errorMessage: null,
    linkedCourses: [],
    tags: ["Docker", "DevOps"],
  },
  {
    id: "ma10", displayName: "SQL 핵심 정리 슬라이드",        originalName: "sql_slides.pdf",
    mimeType: "application/pdf", assetType: "PDF",
    sizeBytes: 3250586, uploadedAt: "2025-03-15", status: "ERROR",
    cdnBaseUrl: null, launchHref: null, scormVersion: null,
    errorMessage: "파일 검증 실패: PDF 구조가 손상되었습니다.",
    linkedCourses: ["SQL 마스터"],
    tags: ["SQL", "데이터베이스"],
  },
];
