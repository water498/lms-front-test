import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

function resolveFeatureDescriptionPath(urlPath: string): string | null {
  const appDir = path.join(process.cwd(), "src", "app");
  const segments = urlPath.split("/").filter(Boolean);

  function walk(dir: string, idx: number): string | null {
    const mdPath = path.join(dir, "feature-description.md");

    // 모든 세그먼트를 소진한 경우 — 현재 디렉토리에서 md 파일 탐색
    if (idx >= segments.length) {
      if (fs.existsSync(mdPath)) return mdPath;
      // route group 안에 있을 수 있음 — (xxx) 디렉토리 탐색
      return walkRouteGroups(dir);
    }

    const segment = segments[idx];

    // 1) 정확한 디렉토리 매치
    const exactDir = path.join(dir, segment);
    if (fs.existsSync(exactDir) && fs.statSync(exactDir).isDirectory()) {
      const result = walk(exactDir, idx + 1);
      if (result) return result;
    }

    // 2) route group (xxx) 디렉토리 탐색
    try {
      const entries = fs.readdirSync(dir);
      for (const entry of entries) {
        if (entry.startsWith("(") && entry.endsWith(")")) {
          const groupDir = path.join(dir, entry);
          if (fs.statSync(groupDir).isDirectory()) {
            const result = walk(groupDir, idx);
            if (result) return result;
          }
        }
      }
    } catch {
      // ignore
    }

    // 3) dynamic segment [paramName] 매치
    try {
      const entries = fs.readdirSync(dir);
      for (const entry of entries) {
        if (entry.startsWith("[") && entry.endsWith("]")) {
          const dynDir = path.join(dir, entry);
          if (fs.statSync(dynDir).isDirectory()) {
            const result = walk(dynDir, idx + 1);
            if (result) return result;
          }
        }
      }
    } catch {
      // ignore
    }

    return null;
  }

  // 세그먼트를 모두 소진했지만 md가 없을 때 — route group 하위 탐색
  function walkRouteGroups(dir: string): string | null {
    const mdPath = path.join(dir, "feature-description.md");
    if (fs.existsSync(mdPath)) return mdPath;

    try {
      const entries = fs.readdirSync(dir);
      for (const entry of entries) {
        if (entry.startsWith("(") && entry.endsWith(")")) {
          const groupDir = path.join(dir, entry);
          if (fs.statSync(groupDir).isDirectory()) {
            const result = walkRouteGroups(groupDir);
            if (result) return result;
          }
        }
      }
    } catch {
      // ignore
    }
    return null;
  }

  return walk(appDir, 0);
}

export async function GET(request: NextRequest) {
  const urlPath = request.nextUrl.searchParams.get("path") || "/";

  const filePath = resolveFeatureDescriptionPath(urlPath);

  if (!filePath) {
    return NextResponse.json({ content: "" });
  }

  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return NextResponse.json({ content });
  } catch {
    return NextResponse.json({ content: "" });
  }
}
