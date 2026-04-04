// Domain: media — 미디어 자산, 폴더, SCORM SCO

export type UploadStatus =
  | "PENDING"
  | "VALIDATING"
  | "PROCESSING"
  | "ACTIVE"
  | "ERROR";
export type AssetType = "VIDEO" | "PDF" | "IMAGE" | "SCORM";

export interface MediaFolder {
  id: string;
  tenantId: string;
  name: string;
  parentId?: string; // null = 최상위 폴더. self-ref 트리 구조 (3단계 권장)
  order: number;
  createdAt: string;
}

export interface MediaAsset {
  id: string;
  folderId?: string; // FK → MediaFolder. null = 미분류
  displayName: string;
  originalName: string;
  mimeType: string;
  assetType: AssetType;
  sizeBytes: number; // 파일 크기 (bytes)
  uploadedAt: string;
  status: UploadStatus;
  cdnBaseUrl: string | null;
  launchHref: string | null; // SCORM 전용
  scormVersion: "1.2" | "2004" | null;
  errorMessage: string | null;
  tags: string[]; // [UI convenience] backend는 String(500) comma-separated
  linkedCourses: string[]; // [UI-only] CourseActivity.media_asset_id JOIN 결과
}

export interface ScormSco {
  id: string;
  mediaAssetId: string; // SCORM MediaAsset
  identifier: string;
  title: string;
  launchHref: string;
  scormVersion: "1.2" | "2004";
  order: number;
}
