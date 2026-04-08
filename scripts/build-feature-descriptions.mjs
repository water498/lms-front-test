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
  "(admin)/course-detail": "/experiments/admin/courses/[courseId]",
  "(admin)/session-detail": "/experiments/admin/courses/[courseId]/sessions/[sessionId]",
  "(admin)/users/user-detail": "/experiments/admin/users/[userId]",
  "(instructor)/session-detail": "/experiments/instructor/sessions/[sessionId]",
  "(student)/courses": "/experiments/student/courses/[courseId]",
  "(student)/session-workspace": "/experiments/student/sessions/[sessionId]",
  "(student)/learn": "/experiments/student/learn/[courseId]/[activityId]",
  "(platform-admin)/tenants/tenant-detail": "/experiments/platform-admin/tenants/[tenantId]",
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

  // "home" 은 역할의 루트 페이지 → prefix만 반환
  if (featureSegments.length === 1 && featureSegments[0] === "home") {
    return prefix;
  }
  // "dashboard" (instructor) 도 루트 페이지
  if (featureSegments.length === 1 && featureSegments[0] === "dashboard") {
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
