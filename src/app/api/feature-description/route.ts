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

// home/dashboard는 역할 루트 페이지
const ROOT_FEATURES = new Set(["home", "dashboard"]);

// URL 패턴 → feature 디렉토리 역매핑 (앱 라우트와 feature 디렉토리명이 다른 경우)
// key: [role, ...urlSegments 패턴] (동적 세그먼트는 무시)
// value: feature 디렉토리 경로 (role 제외)
const URL_TO_FEATURE: { role: string; urlSegments: string[]; featurePath: string }[] = [
  // Admin course tabs (각 탭이 독립 feature)
  { role: "admin", urlSegments: ["courses", "*", "info"], featurePath: "course-info" },
  { role: "admin", urlSegments: ["courses", "*", "curriculum"], featurePath: "course-curriculum" },
  { role: "admin", urlSegments: ["courses", "*", "sessions"], featurePath: "course-sessions" },
  { role: "admin", urlSegments: ["courses", "*", "reviews"], featurePath: "course-reviews" },
  { role: "admin", urlSegments: ["courses", "*", "enrollees"], featurePath: "course-enrollees" },
  { role: "admin", urlSegments: ["courses", "*", "offline"], featurePath: "course-offline" },
  // Other detail pages
  { role: "admin", urlSegments: ["courses", "*", "sessions", "*"], featurePath: "session-detail" },
  { role: "admin", urlSegments: ["users", "*"], featurePath: "users/user-detail" },
  { role: "instructor", urlSegments: ["sessions", "*"], featurePath: "session-detail" },
  { role: "student", urlSegments: ["courses", "*"], featurePath: "courses" },
  { role: "student", urlSegments: ["sessions", "*"], featurePath: "session-workspace" },
  { role: "student", urlSegments: ["learn", "*", "*"], featurePath: "learn" },
  { role: "platform-admin", urlSegments: ["tenants", "*"], featurePath: "tenants/tenant-detail" },
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
