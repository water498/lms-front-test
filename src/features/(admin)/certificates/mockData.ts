export interface CertTemplate {
  id: string;
  name: string;
  linkedCourses: number;
  active: boolean;
  completionRate: number; // 발급 조건: 완료율 %
  requireExam: boolean;
}

export interface IssuedCert {
  id: string;
  certNumber: string;
  recipient: string;
  course: string;
  issuedAt: string;
}

export const certTemplates: CertTemplate[] = [
  { id: "t1", name: "기술 교육 수료증",     linkedCourses: 6, active: true,  completionRate: 80, requireExam: false },
  { id: "t2", name: "전문 자격 수료증",     linkedCourses: 2, active: true,  completionRate: 100, requireExam: true },
  { id: "t3", name: "기본 수강 확인증",     linkedCourses: 0, active: false, completionRate: 60, requireExam: false },
];

export const issuedCerts: IssuedCert[] = [
  { id: "ic1", certNumber: "CERT-2025-0042", recipient: "박지호",  course: "Next.js 마스터",    issuedAt: "2025-03-14" },
  { id: "ic2", certNumber: "CERT-2025-0041", recipient: "이서연",  course: "React 기초",        issuedAt: "2025-03-12" },
  { id: "ic3", certNumber: "CERT-2025-0040", recipient: "김민준",  course: "AWS 클라우드 입문", issuedAt: "2025-03-10" },
  { id: "ic4", certNumber: "CERT-2025-0039", recipient: "최유진",  course: "React 기초",        issuedAt: "2025-03-08" },
  { id: "ic5", certNumber: "CERT-2025-0038", recipient: "정하은",  course: "TypeScript 심화",   issuedAt: "2025-03-05" },
];
