/**
 * 빌드 타임에 모든 feature-description.md 파일을 하나의 JSON 맵으로 생성.
 * Vercel 서버리스 환경에서 fs 없이 md 내용을 제공하기 위함.
 *
 * 탐색 대상: src/features/(admin|instructor|platform-admin|student)/
 * 출력: src/generated/feature-descriptions.json
 * 형태: { "/experiments/admin/courses": "# 과정 관리\n...", ... }
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const FEATURES_DIR = path.join(ROOT, "src", "features");
const OUT_DIR = path.join(ROOT, "src", "generated");
const OUT_FILE = path.join(OUT_DIR, "feature-descriptions.json");

// 역할 그룹 → URL prefix 매핑
const ROLE_MAP = {
  "(admin)": "/experiments/admin",
  "(instructor)": "/experiments/instructor",
  "(platform-admin)": "/experiments/platform-admin",
  "(student)": "/experiments/student",
};

// feature 디렉토리 → 실제 URL 경로 오버라이드
// feature 디렉토리명과 앱 라우트가 다른 경우 여기에 추가
const URL_OVERRIDE = {
  // ── Dashboard (역할 루트) ──
  "(admin)/admin-dashboard": "/experiments/admin",
  "(student)/student-dashboard": "/experiments/student",
  "(instructor)/instructor-dashboard": "/experiments/instructor",
  "(platform-admin)/platform-dashboard": "/experiments/platform-admin",

  // ── Admin: 목록/단순 페이지 ──
  "(admin)/course-list": "/experiments/admin/courses",
  "(admin)/course-categories": "/experiments/admin/courses/categories",
  "(admin)/course-session-list": "/experiments/admin/sessions",
  "(admin)/user-list": "/experiments/admin/users",
  "(admin)/user-group-list": "/experiments/admin/users/groups",
  "(admin)/enrollment-list": "/experiments/admin/enrollments",
  "(admin)/payment-list": "/experiments/admin/payments",
  "(admin)/instructor-payout-list": "/experiments/admin/payouts",
  "(admin)/messaging-credit": "/experiments/admin/credits",
  "(admin)/learning-path-list": "/experiments/admin/learning-paths",
  "(admin)/media-library": "/experiments/admin/media",
  "(admin)/org-announcement-list": "/experiments/admin/announcements",
  "(admin)/certificate-template-list": "/experiments/admin/certificates/templates",
  "(admin)/certificate-issued-list": "/experiments/admin/certificates/issued",
  "(admin)/assessment-exam-list": "/experiments/admin/assessments/exams",
  "(admin)/assessment-survey-list": "/experiments/admin/assessments/surveys",
  "(admin)/assessment-assignment-list": "/experiments/admin/assessments/assignments",
  "(admin)/assessment-question-bank": "/experiments/admin/assessments/question-bank",
  "(admin)/assessment-exam-editor": "/experiments/admin/assessments/exam/[id]",
  "(admin)/assessment-survey-editor": "/experiments/admin/assessments/survey/[id]",
  "(admin)/assessment-assignment-editor": "/experiments/admin/assessments/assignment/[id]",
  "(admin)/messaging-automation": "/experiments/admin/messaging/email",
  "(admin)/portal-info": "/experiments/admin/portal/info",
  "(admin)/portal-theme": "/experiments/admin/portal/theme",
  "(admin)/portal-banners": "/experiments/admin/portal/banners",
  "(admin)/portal-legal": "/experiments/admin/portal/legal",
  "(admin)/portal-announcement-editor": "/experiments/admin/portal/announcements",
  "(admin)/settings-layout": "/experiments/admin/settings",

  // ── Admin: course tabs ──
  "(admin)/course-info": "/experiments/admin/courses/[courseId]/info",
  "(admin)/course-curriculum": "/experiments/admin/courses/[courseId]/curriculum",
  "(admin)/course-sessions": "/experiments/admin/courses/[courseId]/sessions",
  "(admin)/course-reviews": "/experiments/admin/courses/[courseId]/reviews",
  "(admin)/course-enrollees": "/experiments/admin/courses/[courseId]/enrollees",
  "(admin)/course-offline": "/experiments/admin/courses/[courseId]/offline",

  // ── Admin: session layout + tabs ──
  "(admin)/session-layout": "/experiments/admin/sessions/[sessionId]",
  "(admin)/session-dashboard": "/experiments/admin/sessions/[sessionId]/dashboard",
  "(admin)/session-info": "/experiments/admin/sessions/[sessionId]/info",
  "(admin)/session-enrollees": "/experiments/admin/sessions/[sessionId]/enrollees",
  "(admin)/session-grading": "/experiments/admin/sessions/[sessionId]/grading",
  "(admin)/session-qna": "/experiments/admin/sessions/[sessionId]/qna",
  "(admin)/session-history": "/experiments/admin/sessions/[sessionId]/history",
  "(admin)/session-resources": "/experiments/admin/sessions/[sessionId]/resources",
  "(admin)/session-offline": "/experiments/admin/sessions/[sessionId]/offline",
  "(admin)/session-waitlist": "/experiments/admin/sessions/[sessionId]/waitlist",

  // ── Admin: user layout + tabs ──
  "(admin)/user-layout": "/experiments/admin/users/[userId]",
  "(admin)/user-profile": "/experiments/admin/users/[userId]/profile",
  "(admin)/user-enrollments": "/experiments/admin/users/[userId]/enrollments",
  "(admin)/user-activity": "/experiments/admin/users/[userId]/activity",
  "(admin)/user-sessions": "/experiments/admin/users/[userId]/sessions",
  "(admin)/user-access-log-list": "/experiments/admin/users/[userId]/access-logs",
  "(admin)/user-instructor-courses": "/experiments/admin/users/[userId]/instructor-courses",
  "(admin)/user-instructor-reviews": "/experiments/admin/users/[userId]/instructor-reviews",
  "(admin)/user-instructor-payouts": "/experiments/admin/users/[userId]/instructor-payouts",
  "(admin)/user-instructor-bank": "/experiments/admin/users/[userId]/instructor-bank",

  // ── Admin: settings tabs ──
  "(admin)/settings-general": "/experiments/admin/settings/general",
  "(admin)/settings-org": "/experiments/admin/settings/org",
  "(admin)/settings-access": "/experiments/admin/settings/access",
  "(admin)/settings-audit": "/experiments/admin/settings/audit",

  // ── Student: course layout + tabs ──
  "(student)/course-layout": "/experiments/student/courses/[courseId]",
  "(student)/course-intro": "/experiments/student/courses/[courseId]/intro",
  "(student)/course-curriculum": "/experiments/student/courses/[courseId]/curriculum",
  "(student)/course-instructor": "/experiments/student/courses/[courseId]/instructor",
  "(student)/course-reviews": "/experiments/student/courses/[courseId]/reviews",

  // ── Student: session layout + tabs ──
  "(student)/session-layout": "/experiments/student/sessions/[sessionId]",
  "(student)/session-home": "/experiments/student/sessions/[sessionId]/home",
  "(student)/session-announcements": "/experiments/student/sessions/[sessionId]/announcements",
  "(student)/session-resources": "/experiments/student/sessions/[sessionId]/resources",
  "(student)/course-qna": "/experiments/student/sessions/[sessionId]/qna",

  // ── Student: other ──
  "(student)/learning-player": "/experiments/student/learn/[courseId]/[activityId]",
  "(student)/course-search": "/experiments/student/search",
  "(student)/course-wishlist": "/experiments/student/wishlist",
  "(student)/shopping-cart": "/experiments/student/cart",
  "(student)/payment-checkout": "/experiments/student/checkout",
  "(student)/ai-learning-chat": "/experiments/student/ai-chat",
  "(student)/student-announcement-list": "/experiments/student/announcements",
  "(student)/legal-terms": "/experiments/student/terms",
  "(student)/my-page-layout": "/experiments/student/my",

  // ── Instructor ──
  "(instructor)/instructor-session-list": "/experiments/instructor/sessions",
  "(instructor)/session-layout": "/experiments/instructor/sessions/[sessionId]",
  "(instructor)/instructor-review-list": "/experiments/instructor/reviews",
  "(instructor)/instructor-payout-list": "/experiments/instructor/payouts",
  "(instructor)/instructor-bank-account": "/experiments/instructor/bank",
  "(instructor)/instructor-profile": "/experiments/instructor/profile",

  // ── Platform-admin: list pages ──
  "(platform-admin)/tenant-list": "/experiments/platform-admin/tenants",
  "(platform-admin)/platform-announcement-list": "/experiments/platform-admin/announcements",
  "(platform-admin)/settings-layout": "/experiments/platform-admin/settings",

  // ── Platform-admin: tenant layout + tabs ──
  "(platform-admin)/tenant-layout": "/experiments/platform-admin/tenants/[tenantId]",
  "(platform-admin)/tenant-overview": "/experiments/platform-admin/tenants/[tenantId]/overview",
  "(platform-admin)/tenant-sso": "/experiments/platform-admin/tenants/[tenantId]/sso",
  "(platform-admin)/tenant-credits": "/experiments/platform-admin/tenants/[tenantId]/credits",
  "(platform-admin)/tenant-infra": "/experiments/platform-admin/tenants/[tenantId]/infra",

  // ── Platform-admin: settings tabs ──
  "(platform-admin)/platform-settings-general": "/experiments/platform-admin/settings/general",
  "(platform-admin)/platform-settings-audit": "/experiments/platform-admin/settings/audit",
};

/**
 * features 경로를 URL pathname으로 변환.
 * 예: src/features/(admin)/courses/feature-description.md → /experiments/admin/courses
 * 예: src/features/(student)/home/feature-description.md → /experiments/student
 */
function toUrlPath(fsPath) {
  const rel = path.relative(FEATURES_DIR, path.dirname(fsPath));
  const segments = rel.split(path.sep);

  // 첫 번째 세그먼트는 역할 그룹: (admin), (student) 등
  const roleGroup = segments[0];
  const prefix = ROLE_MAP[roleGroup];
  if (!prefix) return null; // 대상 역할이 아니면 스킵

  // 나머지 세그먼트 = feature 경로
  const featureSegments = segments.slice(1);

  // URL override 매핑 확인
  const overrideKey = roleGroup + "/" + featureSegments.join("/");
  if (URL_OVERRIDE[overrideKey]) {
    return URL_OVERRIDE[overrideKey];
  }

  // *-dashboard 는 역할 루트 페이지 → URL_OVERRIDE에서 처리됨
  // (home/dashboard 레거시 이름 폴백)
  if (featureSegments.length === 1 && (featureSegments[0] === "home" || featureSegments[0] === "dashboard")) {
    return prefix;
  }

  return prefix + "/" + featureSegments.join("/");
}

function findAllMdFiles(dir) {
  const results = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      results.push(...findAllMdFiles(fullPath));
    } else if (entry.name === "feature-description.md") {
      results.push(fullPath);
    }
  }

  return results;
}

// 실행 — 4개 역할 디렉토리만 탐색
const targetDirs = Object.keys(ROLE_MAP);
const map = {};

for (const roleDir of targetDirs) {
  const fullDir = path.join(FEATURES_DIR, roleDir);
  if (!fs.existsSync(fullDir)) continue;

  const mdFiles = findAllMdFiles(fullDir);

  for (const filePath of mdFiles) {
    const content = fs.readFileSync(filePath, "utf-8").trim();
    if (!content) continue;

    const urlPath = toUrlPath(filePath);
    if (urlPath) {
      map[urlPath] = content;
    }
  }
}

// 출력 디렉토리 생성
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_FILE, JSON.stringify(map, null, 2));

console.log(
  `[feature-descriptions] Generated ${Object.keys(map).length} entries → src/generated/feature-descriptions.json`
);
