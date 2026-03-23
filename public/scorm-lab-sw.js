/**
 * scorm-lab-sw.js — Service Worker for SCORM Lab
 *
 * Receives a file Map from the page via postMessage and intercepts
 * all fetch requests to /scorm-preview/* to serve them from memory.
 */

const SCOPE = "/scorm-preview/";

// packageId → Map<relativePath, Uint8Array>
const packages = new Map();

const MIME_TYPES = {
  html: "text/html; charset=utf-8",
  htm: "text/html; charset=utf-8",
  js: "application/javascript; charset=utf-8",
  mjs: "application/javascript; charset=utf-8",
  css: "text/css; charset=utf-8",
  json: "application/json; charset=utf-8",
  xml: "application/xml; charset=utf-8",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  svg: "image/svg+xml",
  webp: "image/webp",
  ico: "image/x-icon",
  mp4: "video/mp4",
  webm: "video/webm",
  mp3: "audio/mpeg",
  ogg: "audio/ogg",
  wav: "audio/wav",
  woff: "font/woff",
  woff2: "font/woff2",
  ttf: "font/ttf",
  otf: "font/otf",
  eot: "application/vnd.ms-fontobject",
  swf: "application/x-shockwave-flash",
  pdf: "application/pdf",
  zip: "application/zip",
};

function getMime(path) {
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  return MIME_TYPES[ext] ?? "application/octet-stream";
}

function makeResponse(data, mimeType, request) {
  const total = data.byteLength;
  const rangeHeader = request.headers.get("Range");
  if (rangeHeader) {
    const match = rangeHeader.match(/bytes=(\d+)-(\d*)/);
    if (match) {
      const start = parseInt(match[1], 10);
      const end = match[2] ? parseInt(match[2], 10) : total - 1;
      const chunk = data.slice(start, end + 1);
      return new Response(chunk, {
        status: 206,
        headers: {
          "Content-Type": mimeType,
          "Content-Range": `bytes ${start}-${end}/${total}`,
          "Content-Length": String(end - start + 1),
          "Accept-Ranges": "bytes",
        },
      });
    }
  }
  return new Response(data, {
    status: 200,
    headers: {
      "Content-Type": mimeType,
      "Content-Length": String(total),
      "Accept-Ranges": "bytes",
    },
  });
}

// ── Message handler (page → SW) ───────────────────────────────────────────

self.addEventListener("message", (event) => {
  const { type, packageId, files } = event.data ?? {};

  if (type === "LOAD_PACKAGE") {
    const fileMap = new Map();
    for (const { path, data } of files) {
      fileMap.set(path.replace(/^\//, ""), new Uint8Array(data));
    }
    packages.set(packageId, fileMap);
    (event.ports[0] ?? event.source)?.postMessage({ type: "PACKAGE_READY", packageId });
  }

  if (type === "UNLOAD_PACKAGE") {
    packages.delete(packageId);
  }

  if (type === "PING") {
    event.source?.postMessage({ type: "PONG" });
  }
});

// ── Fetch interceptor ─────────────────────────────────────────────────────

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (!url.pathname.startsWith(SCOPE)) return;

  // /scorm-preview/{packageId}/{...rest}
  const withoutScope = url.pathname.slice(SCOPE.length); // "packageId/rest/of/path"
  const slashIdx = withoutScope.indexOf("/");
  if (slashIdx === -1) {
    event.respondWith(new Response("Not found", { status: 404 }));
    return;
  }

  const packageId = withoutScope.slice(0, slashIdx);
  let filePath = withoutScope.slice(slashIdx + 1);

  // Trailing slash → index.html
  if (!filePath || filePath.endsWith("/")) {
    filePath = filePath + "index.html";
  }

  const fileMap = packages.get(packageId);
  if (!fileMap) {
    event.respondWith(new Response("Package not loaded", { status: 503 }));
    return;
  }

  const data = fileMap.get(filePath);
  if (!data) {
    // Try case-insensitive lookup (some SCORM packages have mixed case)
    const lowerPath = filePath.toLowerCase();
    let found = null;
    for (const [key, val] of fileMap) {
      if (key.toLowerCase() === lowerPath) {
        found = val;
        break;
      }
    }
    if (!found) {
      event.respondWith(new Response(`File not found: ${filePath}`, { status: 404 }));
      return;
    }
    event.respondWith(makeResponse(found, getMime(filePath), event.request));
    return;
  }

  event.respondWith(makeResponse(data, getMime(filePath), event.request));
});

// ── Lifecycle ─────────────────────────────────────────────────────────────

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
