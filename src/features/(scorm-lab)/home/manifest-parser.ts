/**
 * manifest-parser.ts
 * imsmanifest.xml 파싱 → SCORM 버전, 진입점, 타이틀, 식별자 추출
 */

export type ScormVersion = "1.2" | "2004";

export interface ManifestInfo {
  manifestId: string;
  title: string;
  version: ScormVersion;
  entryPath: string; // 패키지 루트 기준 상대 경로 (예: "res/index.html")
}

export function parseManifest(xmlText: string): ManifestInfo {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "application/xml");

  const parseError = doc.querySelector("parsererror");
  if (parseError) throw new Error("imsmanifest.xml 파싱 실패");

  // ── Identifier ────────────────────────────────────────────────────────
  const manifestEl = doc.querySelector("manifest");
  const manifestId =
    manifestEl?.getAttribute("identifier") ??
    `manifest_${Date.now()}`;

  // ── Title ─────────────────────────────────────────────────────────────
  const titleEl = doc.querySelector(
    "organizations > organization > title, organizations > organization > item > title"
  );
  const title = titleEl?.textContent?.trim() ?? "SCORM 패키지";

  // ── SCORM Version ─────────────────────────────────────────────────────
  // SCORM 1.2: <schemaversion>1.2</schemaversion>
  // SCORM 2004: <schemaversion>SCORM 2004 4th Edition</schemaversion> (iSpring)
  // XML 네임스페이스로 인해 querySelector("metadata > schemaversion")가 실패할 수 있음
  const schemaVer = (
    doc.querySelector("metadata > schemaversion") ??
    doc.querySelector("schemaversion") ??
    [...doc.getElementsByTagName("schemaversion")][0]
  )?.textContent?.trim() ?? "";
  const version: ScormVersion = schemaVer.includes("2004") ? "2004" : "1.2";

  // ── Entry Point ───────────────────────────────────────────────────────
  // adlcp:masteryScorede etc, but primarily href on the first SCO resource
  const resources = Array.from(doc.querySelectorAll("resources > resource"));
  let entryPath = "";

  for (const res of resources) {
    const type = res.getAttribute("type") ?? res.getAttribute("adlcp:scormtype") ?? "";
    const scormType =
      res.getAttribute("adlcp:scormtype") ??
      res.getAttribute("adlcp:scormType") ?? "";
    if (scormType.toLowerCase() === "sco" || type.toLowerCase().includes("sco")) {
      entryPath = res.getAttribute("href") ?? "";
      break;
    }
  }

  // Fallback: first resource with href
  if (!entryPath) {
    for (const res of resources) {
      const href = res.getAttribute("href");
      if (href) {
        entryPath = href;
        break;
      }
    }
  }

  // Fallback: common iSpring entry points
  if (!entryPath) {
    entryPath = "res/index.html";
  }

  return { manifestId, title, version, entryPath };
}
