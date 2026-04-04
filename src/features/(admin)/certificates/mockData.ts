export type { CertStatus, CertificateTemplate, CertVariableDef, IssuedCertificate } from "@/lib/models";
import type { CertificateTemplate, CertVariableDef, IssuedCertificate } from "@/lib/models";

export const certVariableDefs: CertVariableDef[] = [
  { key: "recipientName",  label: "수령인 이름",     source: "certificate.recipient" },
  { key: "courseName",     label: "과정명",          source: "enrollment.course.name" },
  { key: "orgName",        label: "조직명",          source: "tenant.name" },
  { key: "certNumber",     label: "수료증 번호",      source: "certificate.id" },
  { key: "issuedDate",     label: "발급일",          source: "certificate.issuedDate" },
  { key: "expiryDate",     label: "유효기간 만료일",  source: "certificate.expiryDate" },
  { key: "completionDate", label: "수료일",          source: "enrollment.completedAt" },
];

const T1_HTML = `<div style="box-sizing:border-box;width:100%;height:100%;padding:90px 110px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:26px;font-family:'Apple SD Gothic Neo','Noto Sans KR',sans-serif;color:#1a1a1a;background:linear-gradient(150deg,#faf7ff 0%,#ffffff 60%,#f3f0ff 100%);">
  <p style="font-size:12px;letter-spacing:.25em;color:#7c3aed;font-weight:600;text-transform:uppercase;">{{orgName}}</p>
  <div style="text-align:center;line-height:1.5;">
    <p style="font-size:10px;letter-spacing:.55em;color:#bbb;text-transform:uppercase;margin-bottom:12px;">Certificate of Completion</p>
    <p style="font-size:38px;font-weight:700;letter-spacing:.5em;color:#111;">수 료 증</p>
  </div>
  <div style="width:56px;height:3px;background:linear-gradient(90deg,#7c3aed,#c4b5fd);border-radius:2px;"></div>
  <p style="font-size:16px;text-align:center;line-height:2.1;color:#333;">
    <strong style="font-size:22px;color:#111;display:block;margin-bottom:4px;">{{recipientName}}</strong>
    님이 <strong>{{courseName}}</strong> 과정을<br>성공적으로 이수하였음을 증명합니다.
  </p>
  <div style="text-align:center;font-size:12px;color:#999;line-height:2.2;margin-top:4px;">
    <p>수료일 &nbsp;&nbsp; {{completionDate}}</p>
    <p>발급일 &nbsp;&nbsp; {{issuedDate}}</p>
    <p>유효기간 만료일 &nbsp;&nbsp; {{expiryDate}}</p>
  </div>
  <p style="font-size:11px;color:#ccc;">No. {{certNumber}}</p>
  <div style="display:flex;gap:120px;margin-top:28px;padding-top:24px;border-top:1px solid #ede9fe;width:80%;justify-content:center;">
    <div style="text-align:center;"><div style="width:90px;border-top:1px solid #d8d0f0;padding-top:8px;font-size:11px;color:#bbb;">대표자 서명</div></div>
    <div style="text-align:center;"><div style="width:90px;border-top:1px solid #d8d0f0;padding-top:8px;font-size:11px;color:#bbb;">직인 날인</div></div>
  </div>
</div>`;

const T2_HTML = `<div style="box-sizing:border-box;width:100%;height:100%;padding:80px 100px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;font-family:Georgia,'Apple SD Gothic Neo',serif;color:#1a1209;background:#fffef8;border:28px solid #f5f0e0;">
  <div style="text-align:center;">
    <p style="font-size:9px;letter-spacing:.6em;color:#b08d3a;text-transform:uppercase;margin-bottom:14px;">This is to certify that</p>
    <p style="font-size:34px;font-weight:700;color:#7a5c1e;letter-spacing:.08em;">{{recipientName}}</p>
  </div>
  <p style="font-size:13px;text-align:center;line-height:2;color:#5a4a2a;max-width:460px;">
    has successfully completed all requirements of<br>
    <strong style="font-size:16px;color:#3d2a00;">{{courseName}}</strong><br>
    and is hereby awarded this certificate of professional qualification.
  </p>
  <div style="width:80px;height:1px;background:#c9a84c;margin:4px 0;"></div>
  <div style="text-align:center;font-size:11px;color:#9a7d3a;line-height:2.4;">
    <p>수료증 번호 {{certNumber}}</p>
    <p>수료일 {{completionDate}} &nbsp;·&nbsp; 발급일 {{issuedDate}}</p>
    <p style="font-size:12px;font-weight:600;color:#7a5c1e;margin-top:4px;">{{orgName}}</p>
  </div>
  <div style="display:flex;gap:100px;margin-top:32px;padding-top:24px;border-top:1px solid #e8d9a0;width:80%;justify-content:center;">
    <div style="text-align:center;"><div style="width:90px;border-top:1px solid #c9a84c;padding-top:8px;font-size:11px;color:#b08d3a;">대표자 서명</div></div>
    <div style="text-align:center;"><div style="width:90px;border-top:1px solid #c9a84c;padding-top:8px;font-size:11px;color:#b08d3a;">직인 날인</div></div>
  </div>
</div>`;

const T3_HTML = `<div style="box-sizing:border-box;width:100%;height:100%;padding:80px 100px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;font-family:'Apple SD Gothic Neo','Noto Sans KR',sans-serif;color:#1a1a1a;background:#ffffff;">
  <p style="font-size:11px;letter-spacing:.3em;color:#94a3b8;text-transform:uppercase;">{{orgName}}</p>
  <div style="text-align:center;">
    <p style="font-size:9px;letter-spacing:.5em;color:#cbd5e1;text-transform:uppercase;margin-bottom:10px;">Certificate of Attendance</p>
    <p style="font-size:30px;font-weight:600;letter-spacing:.35em;color:#334155;">수 강 확 인 증</p>
  </div>
  <div style="width:40px;height:2px;background:#94a3b8;"></div>
  <p style="font-size:15px;text-align:center;line-height:2;color:#475569;">
    <strong style="font-size:19px;color:#1e293b;">{{recipientName}}</strong>님이<br>
    <strong>{{courseName}}</strong> 과정에<br>참여하였음을 확인합니다.
  </p>
  <div style="text-align:center;font-size:11px;color:#94a3b8;line-height:2.2;margin-top:8px;">
    <p>발급일 &nbsp;&nbsp; {{issuedDate}}</p>
    <p>유효기간 만료일 &nbsp;&nbsp; {{expiryDate}}</p>
  </div>
  <p style="font-size:10px;color:#cbd5e1;margin-top:4px;">No. {{certNumber}}</p>
</div>`;

export const certTemplates: CertificateTemplate[] = [
  { id: "t1", tenantId: "t1", name: "안전 교육 수료증",  active: true,  validityYears: 2,    backgroundImageUrl: null, htmlTemplate: T1_HTML },
  { id: "t2", tenantId: "t1", name: "전문 안전 자격증",  active: true,  validityYears: null, backgroundImageUrl: null, htmlTemplate: T2_HTML },
  { id: "t3", tenantId: "t1", name: "안전 교육 이수확인증", active: false, validityYears: 1,  backgroundImageUrl: null, htmlTemplate: T3_HTML },
];

export const initialIssuedCertificates: IssuedCertificate[] = [
  {
    id: "ic1", tenantId: "t1", certNumber: "CERT-2026-0042", publicToken: "a1b2c3d4-0042",
    userId: "u7", courseId: "c3", sessionId: "se1", recipient: "박지호",  course: "안전문화 주도 및 경영 역량",          templateId: "t1",
    status: "VALID",
    issuedAt: "2026-03-14", expiredAt: "2028-03-14", reissuedAt: null, revokedAt: null, revokedReason: null, revokedBy: null,
  },
  {
    id: "ic2", tenantId: "t1", certNumber: "CERT-2026-0041", publicToken: "b2c3d4e5-0041",
    userId: "u6", courseId: "c1", sessionId: "se1", recipient: "이서연",  course: "핵심안전수칙 이해",                  templateId: "t1",
    status: "VALID",
    issuedAt: "2026-03-12", expiredAt: "2028-03-12", reissuedAt: "2026-03-15", revokedAt: null, revokedReason: null, revokedBy: null,
  },
  {
    id: "ic3", tenantId: "t1", certNumber: "CERT-2026-0040", publicToken: "c3d4e5f6-0040",
    userId: "u5", courseId: "c4", sessionId: "se4", recipient: "김민준",  course: "위험관리실무",                       templateId: "t2",
    status: "VALID",
    issuedAt: "2026-03-10", expiredAt: null, reissuedAt: null, revokedAt: null, revokedReason: null, revokedBy: null,
  },
  {
    id: "ic4", tenantId: "t1", certNumber: "CERT-2026-0039", publicToken: "d4e5f6a7-0039",
    userId: "u8", courseId: "c1", sessionId: "se2", recipient: "최유진",  course: "핵심안전수칙 이해",                  templateId: "t1",
    status: "REVOKED",
    issuedAt: "2026-03-08", expiredAt: "2028-03-08", reissuedAt: null,
    revokedAt: "2026-03-20", revokedReason: "부정 수강 확인", revokedBy: "관리자",
  },
  {
    id: "ic5", tenantId: "t1", certNumber: "CERT-2026-0038", publicToken: "e5f6a7b8-0038",
    userId: "u9", courseId: "c2", sessionId: "se1", recipient: "정하은",  course: "안전보건관리체계와 10대 필수 안전수칙 이해", templateId: "t1",
    status: "VALID",
    issuedAt: "2026-03-05", expiredAt: "2028-03-05", reissuedAt: null, revokedAt: null, revokedReason: null, revokedBy: null,
  },
  {
    id: "ic6", tenantId: "t1", certNumber: "CERT-2024-0007", publicToken: "f6a7b8c9-0007",
    userId: "u2", courseId: "c3", sessionId: "se1", recipient: "홍길동",  course: "안전 교육 이수확인증",               templateId: "t3",
    status: "EXPIRED",
    issuedAt: "2024-01-15", expiredAt: "2025-01-15", reissuedAt: null, revokedAt: null, revokedReason: null, revokedBy: null,
  },
];
