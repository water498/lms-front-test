// Domain: media — 미디어 자산, SCORM SCO

export type UploadStatus =
  | "PENDING"
  | "VALIDATING"
  | "PROCESSING"
  | "ACTIVE"
  | "ERROR";
export type AssetType = "VIDEO" | "PDF" | "IMAGE" | "SCORM";

export interface MediaAsset {
  id: string;
  displayName: string;
  originalName: string;
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
  tags: string[];
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
