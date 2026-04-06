/**
 * 빌드 타임에 모든 feature-description.md 파일을 하나의 JSON 맵으로 생성.
 * Vercel 서버리스 환경에서 fs 없이 md 내용을 제공하기 위함.
 *
 * 출력: src/generated/feature-descriptions.json
 * 형태: { "/experiments/admin": "# 기업 관리자 대시보드\n...", ... }
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const APP_DIR = path.join(ROOT, "src", "app");
const OUT_DIR = path.join(ROOT, "src", "generated");
const OUT_FILE = path.join(OUT_DIR, "feature-descriptions.json");

/**
 * 파일시스템 경로를 URL pathname으로 변환.
 * - route group (xxx) 제거
 * - dynamic segment [param] 유지
 */
function toUrlPath(fsPath) {
  // APP_DIR 기준 상대 경로
  let rel = path.relative(APP_DIR, path.dirname(fsPath));
  if (rel === ".") return "/";

  const segments = rel.split(path.sep).filter((seg) => {
    // route group 제거: (app), (fullscreen) 등
    return !(seg.startsWith("(") && seg.endsWith(")"));
  });

  return "/" + segments.join("/");
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

// 실행
const mdFiles = findAllMdFiles(APP_DIR);
const map = {};

for (const filePath of mdFiles) {
  const content = fs.readFileSync(filePath, "utf-8").trim();
  if (!content) continue; // 빈 파일 스킵

  const urlPath = toUrlPath(filePath);
  map[urlPath] = content;
}

// 출력 디렉토리 생성
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_FILE, JSON.stringify(map, null, 2));

console.log(
  `[feature-descriptions] Generated ${Object.keys(map).length} entries → src/generated/feature-descriptions.json`
);
