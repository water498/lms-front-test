import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * 빌드 타임에 생성된 JSON에서 feature description을 조회.
 * dev 환경에서는 fs 폴백으로 항상 최신 md를 읽음.
 */

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

/**
 * URL pathname에서 dynamic segment의 실제 값을 [param] 형태로 치환하여 매칭.
 * 예: /experiments/student/sessions/ss-3 → /experiments/student/sessions/[sessionId]
 */
function findContent(
  map: Record<string, string>,
  urlPath: string
): string | undefined {
  // 1) 정확한 매치
  if (map[urlPath] !== undefined) return map[urlPath];

  // 2) dynamic segment 폴백: 뒤에서부터 세그먼트를 [*]로 치환하며 탐색
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

  // dev 환경: fs로 직접 읽기 (md 수정 즉시 반영)
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

  // prod 환경: 빌드 타임 생성된 JSON에서 조회
  const map = await getDescriptionsMap();
  const content = findContent(map, urlPath) || "";
  return NextResponse.json({ content });
}

/** dev 전용: 파일시스템에서 직접 읽기 */
function readFromFs(
  fs: typeof import("fs"),
  pathMod: typeof import("path"),
  urlPath: string
): string {
  const appDir = pathMod.join(process.cwd(), "src", "app");
  const segments = urlPath.split("/").filter(Boolean);

  function walk(dir: string, idx: number): string | null {
    const mdPath = pathMod.join(dir, "feature-description.md");

    if (idx >= segments.length) {
      if (fs.existsSync(mdPath)) return mdPath;
      return walkRouteGroups(dir);
    }

    const segment = segments[idx];

    const exactDir = pathMod.join(dir, segment);
    if (fs.existsSync(exactDir) && fs.statSync(exactDir).isDirectory()) {
      const result = walk(exactDir, idx + 1);
      if (result) return result;
    }

    try {
      const entries = fs.readdirSync(dir);
      for (const entry of entries) {
        if (entry.startsWith("(") && entry.endsWith(")")) {
          const groupDir = pathMod.join(dir, entry);
          if (fs.statSync(groupDir).isDirectory()) {
            const result = walk(groupDir, idx);
            if (result) return result;
          }
        }
      }
    } catch {
      /* ignore */
    }

    try {
      const entries = fs.readdirSync(dir);
      for (const entry of entries) {
        if (entry.startsWith("[") && entry.endsWith("]")) {
          const dynDir = pathMod.join(dir, entry);
          if (fs.statSync(dynDir).isDirectory()) {
            const result = walk(dynDir, idx + 1);
            if (result) return result;
          }
        }
      }
    } catch {
      /* ignore */
    }

    return null;
  }

  function walkRouteGroups(dir: string): string | null {
    const mdPath = pathMod.join(dir, "feature-description.md");
    if (fs.existsSync(mdPath)) return mdPath;

    try {
      const entries = fs.readdirSync(dir);
      for (const entry of entries) {
        if (entry.startsWith("(") && entry.endsWith(")")) {
          const groupDir = pathMod.join(dir, entry);
          if (fs.statSync(groupDir).isDirectory()) {
            const result = walkRouteGroups(groupDir);
            if (result) return result;
          }
        }
      }
    } catch {
      /* ignore */
    }
    return null;
  }

  const filePath = walk(appDir, 0);
  if (!filePath) return "";

  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return "";
  }
}
