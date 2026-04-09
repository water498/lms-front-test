import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * feature-description.md 조회 API.
 *
 * URL pathname → src/features/ 하위 feature-description.md 매핑.
 * 예: /experiments/admin/courses → src/features/(admin)/courses/feature-description.md
 *
 * dev: fs로 직접 읽기 (실시간 반영)
 * prod: 빌드 타임 생성된 JSON에서 조회
 */

// 역할 URL prefix → features 디렉토리명 매핑
const ROLE_MAP: Record<string, string> = {
  admin: "(admin)",
  instructor: "(instructor)",
  "platform-admin": "(platform-admin)",
  student: "(student)",
};

// 역할 루트 페이지 (대시보드) 매핑
const ROOT_FEATURES = new Set(["admin-dashboard", "student-dashboard", "instructor-dashboard", "platform-dashboard", "home", "dashboard"]);

// URL 패턴 → feature 디렉토리 역매핑 (앱 라우트와 feature 디렉토리명이 다른 경우)
const URL_TO_FEATURE: { role: string; urlSegments: string[]; featurePath: string }[] = [
  // ── Admin: 목록/단순 페이지 (URL path ≠ feature 디렉토리명) ──
  { role: "admin", urlSegments: ["courses"], featurePath: "course-list" },
  { role: "admin", urlSegments: ["courses", "categories"], featurePath: "course-categories" },
  { role: "admin", urlSegments: ["sessions"], featurePath: "course-session-list" },
  { role: "admin", urlSegments: ["users"], featurePath: "user-list" },
  { role: "admin", urlSegments: ["users", "groups"], featurePath: "user-group-list" },
  { role: "admin", urlSegments: ["users", "access-logs"], featurePath: "user-access-log-list" },
  { role: "admin", urlSegments: ["enrollments"], featurePath: "enrollment-list" },
  { role: "admin", urlSegments: ["payments"], featurePath: "payment-list" },
  { role: "admin", urlSegments: ["payouts"], featurePath: "instructor-payout-list" },
  { role: "admin", urlSegments: ["credits"], featurePath: "messaging-credit" },
  { role: "admin", urlSegments: ["learning-paths"], featurePath: "learning-path-list" },
  { role: "admin", urlSegments: ["media"], featurePath: "media-library" },
  { role: "admin", urlSegments: ["announcements"], featurePath: "org-announcement-list" },
  { role: "admin", urlSegments: ["certificates"], featurePath: "certificate-template-list" },
  { role: "admin", urlSegments: ["certificates", "templates"], featurePath: "certificate-template-list" },
  { role: "admin", urlSegments: ["certificates", "issued"], featurePath: "certificate-issued-list" },
  { role: "admin", urlSegments: ["assessments"], featurePath: "assessment-exam-list" },
  { role: "admin", urlSegments: ["assessments", "exams"], featurePath: "assessment-exam-list" },
  { role: "admin", urlSegments: ["assessments", "surveys"], featurePath: "assessment-survey-list" },
  { role: "admin", urlSegments: ["assessments", "assignments"], featurePath: "assessment-assignment-list" },
  { role: "admin", urlSegments: ["assessments", "question-bank"], featurePath: "assessment-question-bank" },
  { role: "admin", urlSegments: ["assessments", "exam", "*"], featurePath: "assessment-exam-editor" },
  { role: "admin", urlSegments: ["assessments", "survey", "*"], featurePath: "assessment-survey-editor" },
  { role: "admin", urlSegments: ["assessments", "assignment", "*"], featurePath: "assessment-assignment-editor" },
  { role: "admin", urlSegments: ["messaging", "email"], featurePath: "messaging-automation" },
  { role: "admin", urlSegments: ["messaging", "sms"], featurePath: "messaging-automation" },
  { role: "admin", urlSegments: ["messaging", "kakao"], featurePath: "messaging-automation" },
  { role: "admin", urlSegments: ["portal", "info"], featurePath: "portal-info" },
  { role: "admin", urlSegments: ["portal", "theme"], featurePath: "portal-theme" },
  { role: "admin", urlSegments: ["portal", "banners"], featurePath: "portal-banners" },
  { role: "admin", urlSegments: ["portal", "legal"], featurePath: "portal-legal" },
  { role: "admin", urlSegments: ["portal", "announcements"], featurePath: "portal-announcement-editor" },
  { role: "admin", urlSegments: ["settings"], featurePath: "settings-layout" },
  // ── Admin: course tabs ──
  { role: "admin", urlSegments: ["courses", "*", "info"], featurePath: "course-info" },
  { role: "admin", urlSegments: ["courses", "*", "curriculum"], featurePath: "course-curriculum" },
  { role: "admin", urlSegments: ["courses", "*", "sessions"], featurePath: "course-sessions" },
  { role: "admin", urlSegments: ["courses", "*", "reviews"], featurePath: "course-reviews" },
  { role: "admin", urlSegments: ["courses", "*", "enrollees"], featurePath: "course-enrollees" },
  { role: "admin", urlSegments: ["courses", "*", "offline"], featurePath: "course-offline" },
  // ── Admin: session layout + tabs ──
  { role: "admin", urlSegments: ["sessions", "*"], featurePath: "session-layout" },
  { role: "admin", urlSegments: ["sessions", "*", "dashboard"], featurePath: "session-dashboard" },
  { role: "admin", urlSegments: ["sessions", "*", "info"], featurePath: "session-info" },
  { role: "admin", urlSegments: ["sessions", "*", "enrollees"], featurePath: "session-enrollees" },
  { role: "admin", urlSegments: ["sessions", "*", "grading"], featurePath: "session-grading" },
  { role: "admin", urlSegments: ["sessions", "*", "qna"], featurePath: "session-qna" },
  { role: "admin", urlSegments: ["sessions", "*", "history"], featurePath: "session-history" },
  { role: "admin", urlSegments: ["sessions", "*", "resources"], featurePath: "session-resources" },
  { role: "admin", urlSegments: ["sessions", "*", "offline"], featurePath: "session-offline" },
  { role: "admin", urlSegments: ["sessions", "*", "waitlist"], featurePath: "session-waitlist" },
  // ── Admin: user layout + tabs ──
  { role: "admin", urlSegments: ["users", "*"], featurePath: "user-layout" },
  { role: "admin", urlSegments: ["users", "*", "profile"], featurePath: "user-profile" },
  { role: "admin", urlSegments: ["users", "*", "enrollments"], featurePath: "user-enrollments" },
  { role: "admin", urlSegments: ["users", "*", "activity"], featurePath: "user-activity" },
  { role: "admin", urlSegments: ["users", "*", "sessions"], featurePath: "user-sessions" },
  { role: "admin", urlSegments: ["users", "*", "access-logs"], featurePath: "user-access-log-list" },
  { role: "admin", urlSegments: ["users", "*", "instructor-courses"], featurePath: "user-instructor-courses" },
  { role: "admin", urlSegments: ["users", "*", "instructor-reviews"], featurePath: "user-instructor-reviews" },
  { role: "admin", urlSegments: ["users", "*", "instructor-payouts"], featurePath: "user-instructor-payouts" },
  { role: "admin", urlSegments: ["users", "*", "instructor-bank"], featurePath: "user-instructor-bank" },
  // ── Admin: settings tabs ──
  { role: "admin", urlSegments: ["settings", "general"], featurePath: "settings-general" },
  { role: "admin", urlSegments: ["settings", "org"], featurePath: "settings-org" },
  { role: "admin", urlSegments: ["settings", "access"], featurePath: "settings-access" },
  { role: "admin", urlSegments: ["settings", "audit"], featurePath: "settings-audit" },
  // ── Student: course layout + tabs ──
  { role: "student", urlSegments: ["courses", "*"], featurePath: "course-layout" },
  { role: "student", urlSegments: ["courses", "*", "intro"], featurePath: "course-intro" },
  { role: "student", urlSegments: ["courses", "*", "curriculum"], featurePath: "course-curriculum" },
  { role: "student", urlSegments: ["courses", "*", "instructor"], featurePath: "course-instructor" },
  { role: "student", urlSegments: ["courses", "*", "reviews"], featurePath: "course-reviews" },
  // ── Student: course-session layout + tabs ──
  { role: "student", urlSegments: ["sessions", "*"], featurePath: "course-session-layout" },
  { role: "student", urlSegments: ["sessions", "*", "home"], featurePath: "course-session-home" },
  { role: "student", urlSegments: ["sessions", "*", "announcements"], featurePath: "course-session-notice-list" },
  { role: "student", urlSegments: ["sessions", "*", "resources"], featurePath: "course-session-resources" },
  { role: "student", urlSegments: ["sessions", "*", "qna"], featurePath: "course-session-qna" },
  // ── Student: other ──
  { role: "student", urlSegments: ["learn", "*", "*"], featurePath: "classroom" },
  { role: "student", urlSegments: ["search"], featurePath: "course-search" },
  { role: "student", urlSegments: ["wishlist"], featurePath: "wishlist" },
  { role: "student", urlSegments: ["cart"], featurePath: "shopping-cart" },
  { role: "student", urlSegments: ["checkout"], featurePath: "payment-checkout" },
  { role: "student", urlSegments: ["ai-chat"], featurePath: "ai-chatbot" },
  { role: "student", urlSegments: ["announcements"], featurePath: "student-notice-list" },
  { role: "student", urlSegments: ["terms"], featurePath: "legal-terms" },
  { role: "student", urlSegments: ["my"], featurePath: "mypage-layout" },
  { role: "student", urlSegments: ["my", "learning"], featurePath: "mypage-learning" },
  { role: "student", urlSegments: ["my", "certificates"], featurePath: "mypage-certificate-list" },
  { role: "student", urlSegments: ["my", "orders"], featurePath: "mypage-order-list" },
  { role: "student", urlSegments: ["my", "reviews"], featurePath: "mypage-review-list" },
  { role: "student", urlSegments: ["my", "notifications"], featurePath: "mypage-notification-list" },
  { role: "student", urlSegments: ["my", "profile"], featurePath: "mypage-profile" },
  // ── Instructor ──
  { role: "instructor", urlSegments: ["sessions"], featurePath: "my-course-session-list" },
  { role: "instructor", urlSegments: ["sessions", "*"], featurePath: "course-session-layout" },
  { role: "instructor", urlSegments: ["sessions", "*", "students"], featurePath: "course-session-student-list" },
  { role: "instructor", urlSegments: ["sessions", "*", "attendance"], featurePath: "course-session-attendance" },
  { role: "instructor", urlSegments: ["sessions", "*", "grading"], featurePath: "course-session-grading" },
  { role: "instructor", urlSegments: ["sessions", "*", "qna"], featurePath: "course-session-qna" },
  { role: "instructor", urlSegments: ["sessions", "*", "resources"], featurePath: "course-session-resources" },
  { role: "instructor", urlSegments: ["reviews"], featurePath: "review-list" },
  { role: "instructor", urlSegments: ["payouts"], featurePath: "payout-list" },
  { role: "instructor", urlSegments: ["bank"], featurePath: "bank-account" },
  { role: "instructor", urlSegments: ["profile"], featurePath: "profile" },
  // ── Platform-admin: list pages ──
  { role: "platform-admin", urlSegments: ["tenants"], featurePath: "tenant-list" },
  { role: "platform-admin", urlSegments: ["announcements"], featurePath: "platform-announcement-list" },
  { role: "platform-admin", urlSegments: ["settings"], featurePath: "settings-layout" },
  // ── Platform-admin: tenant layout + tabs ──
  { role: "platform-admin", urlSegments: ["tenants", "*"], featurePath: "tenant-layout" },
  { role: "platform-admin", urlSegments: ["tenants", "*", "overview"], featurePath: "tenant-overview" },
  { role: "platform-admin", urlSegments: ["tenants", "*", "sso"], featurePath: "tenant-sso" },
  { role: "platform-admin", urlSegments: ["tenants", "*", "credits"], featurePath: "tenant-credits" },
  { role: "platform-admin", urlSegments: ["tenants", "*", "infra"], featurePath: "tenant-infra" },
  // ── Platform-admin: settings tabs ──
  { role: "platform-admin", urlSegments: ["settings", "general"], featurePath: "platform-settings-general" },
  { role: "platform-admin", urlSegments: ["settings", "audit"], featurePath: "platform-settings-audit" },
];

let descriptionsMap: Record<string, string> | null = null;

async function getDescriptionsMap(): Promise<Record<string, string>> {
  if (descriptionsMap) return descriptionsMap;

  try {
    const data = await import("@/generated/feature-descriptions.json");
    descriptionsMap = data.default as Record<string, string>;
    return descriptionsMap;
  } catch {
    return {};
  }
}

function findContent(
  map: Record<string, string>,
  urlPath: string
): string | undefined {
  if (map[urlPath] !== undefined) return map[urlPath];

  // dynamic segment 폴백
  const segments = urlPath.split("/").filter(Boolean);
  const keys = Object.keys(map);

  for (const key of keys) {
    const keySegments = key.split("/").filter(Boolean);
    if (keySegments.length !== segments.length) continue;

    const match = keySegments.every(
      (ks, i) => ks === segments[i] || (ks.startsWith("[") && ks.endsWith("]"))
    );
    if (match) return map[key];
  }

  return undefined;
}

export async function GET(request: NextRequest) {
  const urlPath = request.nextUrl.searchParams.get("path") || "/";

  // dev 환경: fs로 직접 읽기
  if (process.env.NODE_ENV === "development") {
    try {
      const fs = await import("fs");
      const path = await import("path");
      const content = readFromFs(fs.default, path.default, urlPath);
      return NextResponse.json({ content });
    } catch {
      // fs 사용 불가 시 JSON 폴백
    }
  }

  const map = await getDescriptionsMap();
  const content = findContent(map, urlPath) || "";
  return NextResponse.json({ content });
}

/**
 * dev 전용: URL pathname → features 디렉토리에서 직접 읽기.
 *
 * URL 구조: /experiments/{role}/{featurePath...}
 * 매핑: src/features/({role})/{featurePath}/feature-description.md
 *
 * 역할 루트 (e.g. /experiments/admin) → home/feature-description.md
 */
function readFromFs(
  fs: typeof import("fs"),
  pathMod: typeof import("path"),
  urlPath: string
): string {
  const featuresDir = pathMod.join(process.cwd(), "src", "features");
  const segments = urlPath.split("/").filter(Boolean);

  // URL: /experiments/{role}/{...featurePath}
  // segments[0] = "experiments", segments[1] = role, segments[2..] = feature path
  if (segments.length < 2 || segments[0] !== "experiments") return "";

  const role = segments[1];
  const roleDir = ROLE_MAP[role];
  if (!roleDir) return "";

  const featureSegments = segments.slice(2);
  const baseDir = pathMod.join(featuresDir, roleDir);

  // 역할 루트 페이지 → home 또는 dashboard
  if (featureSegments.length === 0) {
    for (const rootFeature of ROOT_FEATURES) {
      const mdPath = pathMod.join(
        baseDir,
        rootFeature,
        "feature-description.md"
      );
      if (fs.existsSync(mdPath)) {
        return fs.readFileSync(mdPath, "utf-8");
      }
    }
    return "";
  }

  // URL→feature 역매핑 확인 (앱 라우트와 feature 디렉토리명이 다른 경우)
  for (const mapping of URL_TO_FEATURE) {
    if (mapping.role !== role) continue;
    if (mapping.urlSegments.length !== featureSegments.length) continue;
    const match = mapping.urlSegments.every(
      (seg, i) => seg === "*" || seg === featureSegments[i]
    );
    if (match) {
      const mdPath = pathMod.join(baseDir, mapping.featurePath, "feature-description.md");
      if (fs.existsSync(mdPath)) {
        try { return fs.readFileSync(mdPath, "utf-8"); } catch { /* fall through */ }
      }
    }
  }

  // feature path에서 feature-description.md 탐색
  const mdPath = resolveFeatureMd(fs, pathMod, baseDir, featureSegments);
  if (!mdPath) return "";

  try {
    return fs.readFileSync(mdPath, "utf-8");
  } catch {
    return "";
  }
}

/** feature 세그먼트를 따라 feature-description.md 탐색 */
function resolveFeatureMd(
  fs: typeof import("fs"),
  pathMod: typeof import("path"),
  dir: string,
  segments: string[]
): string | null {
  if (segments.length === 0) {
    const mdPath = pathMod.join(dir, "feature-description.md");
    return fs.existsSync(mdPath) ? mdPath : null;
  }

  const [current, ...rest] = segments;

  // 정확한 매치
  const exactDir = pathMod.join(dir, current);
  if (fs.existsSync(exactDir) && fs.statSync(exactDir).isDirectory()) {
    const result = resolveFeatureMd(fs, pathMod, exactDir, rest);
    if (result) return result;
  }

  // dynamic segment 매치 (feature 디렉토리에는 없을 수 있지만 안전장치)
  try {
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      if (entry.startsWith("[") && entry.endsWith("]")) {
        const dynDir = pathMod.join(dir, entry);
        if (fs.statSync(dynDir).isDirectory()) {
          const result = resolveFeatureMd(fs, pathMod, dynDir, rest);
          if (result) return result;
        }
      }
    }
  } catch {
    /* ignore */
  }

  return null;
}
