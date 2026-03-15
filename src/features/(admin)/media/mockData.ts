export type MediaType = "VIDEO" | "DOCUMENT" | "SCORM" | "OTHER";

export interface MediaFile {
  id: string;
  name: string;
  type: MediaType;
  size: string;
  uploadedAt: string;
  url: string;
  linkedCourses: string[];
}

export const mediaFiles: MediaFile[] = [
  { id: "mf1",  name: "react_intro.mp4",           type: "VIDEO",    size: "245.3 MB", uploadedAt: "2025-01-05", url: "cdn.acme.com/media/mf1",  linkedCourses: ["React 기초"] },
  { id: "mf2",  name: "usestate_tutorial.mp4",      type: "VIDEO",    size: "182.7 MB", uploadedAt: "2025-01-06", url: "cdn.acme.com/media/mf2",  linkedCourses: ["React 기초"] },
  { id: "mf3",  name: "typescript_generics.mp4",    type: "VIDEO",    size: "310.1 MB", uploadedAt: "2025-01-15", url: "cdn.acme.com/media/mf3",  linkedCourses: ["TypeScript 심화"] },
  { id: "mf4",  name: "component_guide.pdf",        type: "DOCUMENT", size: "2.4 MB",   uploadedAt: "2025-01-07", url: "cdn.acme.com/media/mf4",  linkedCourses: ["React 기초"] },
  { id: "mf5",  name: "typescript_handbook.pdf",    type: "DOCUMENT", size: "5.8 MB",   uploadedAt: "2025-01-16", url: "cdn.acme.com/media/mf5",  linkedCourses: ["TypeScript 심화"] },
  { id: "mf6",  name: "aws_fundamentals.scorm",     type: "SCORM",    size: "48.2 MB",  uploadedAt: "2025-02-10", url: "cdn.acme.com/media/mf6",  linkedCourses: ["AWS 클라우드 입문"] },
  { id: "mf7",  name: "docker_basics.scorm",        type: "SCORM",    size: "35.6 MB",  uploadedAt: "2025-03-02", url: "cdn.acme.com/media/mf7",  linkedCourses: ["Docker & Kubernetes"] },
  { id: "mf8",  name: "nextjs_appdir.mp4",          type: "VIDEO",    size: "278.9 MB", uploadedAt: "2025-02-01", url: "cdn.acme.com/media/mf8",  linkedCourses: ["Next.js 마스터"] },
  { id: "mf9",  name: "course_thumbnail_react.png", type: "OTHER",    size: "0.8 MB",   uploadedAt: "2025-01-04", url: "cdn.acme.com/media/mf9",  linkedCourses: ["React 기초"] },
  { id: "mf10", name: "sql_slides.pdf",             type: "DOCUMENT", size: "3.1 MB",   uploadedAt: "2024-08-20", url: "cdn.acme.com/media/mf10", linkedCourses: ["SQL 마스터"] },
];
