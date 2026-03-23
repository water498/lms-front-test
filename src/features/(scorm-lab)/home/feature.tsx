"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import JSZip from "jszip";

import { parseManifest, type ManifestInfo } from "./manifest-parser";
import {
  listPackages,
  loadPackage,
  savePackage,
  deletePackage,
  type StoredPackage,
} from "./package-store";
import {
  saveSession,
  loadSession,
  clearSession,
  formatSavedTime,
  type ScormSession,
} from "./session-store";
import {
  registerSW,
  loadPackageToSW,
  unloadPackageFromSW,
} from "./sw-bridge";
import {
  installScorm12,
  installScorm2004,
  getDefaultData12,
  getDefaultData2004,
  type LogEntry,
  type ChecklistState,
} from "./scorm-runtime";

import UploadZone from "./components/upload-zone";
import CachedPackagesList from "./components/cached-packages-list";
import ProgressPanel from "./components/progress-panel";

// ── Types ─────────────────────────────────────────────────────────────────

type PackageSummary = Omit<StoredPackage, "zip">;
type Phase = "setup" | "player";

// ── Component ─────────────────────────────────────────────────────────────

export default function ScormLabFeature() {
  // SW / loading
  const [swReady, setSwReady] = useState(false);
  const [swError, setSwError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loadingPackage, setLoadingPackage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Package list (IndexedDB)
  const [cachedPackages, setCachedPackages] = useState<PackageSummary[]>([]);
  const [selectedPkg, setSelectedPkg] = useState<PackageSummary | null>(null);

  // Learner
  const [learnerName, setLearnerName] = useState("홍길동");
  const [learnerId, setLearnerId] = useState("student_001");

  // Saved session
  const [savedSession, setSavedSession] = useState<ScormSession | null>(null);

  // Player phase
  const [phase, setPhase] = useState<Phase>("setup");
  const [packageId, setPackageId] = useState<string | null>(null); // uuid for SW

  // SCORM runtime state
  const [scormData, setScormData] = useState<Record<string, string>>({});
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [checklist, setChecklist] = useState<ChecklistState>({
    sessionStarted: false,
    dataWritten: false,
    completionSignaled: false,
    sessionEnded: false,
  });
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const logIdRef = useRef(0);
  const uninstallRuntimeRef = useRef<(() => void) | null>(null);
  const activatingRef = useRef(false); // prevents re-entrant activatePackage calls

  // ── SW registration ───────────────────────────────────────────────────

  useEffect(() => {
    registerSW()
      .then(() => setSwReady(true))
      .catch((e: Error) => setSwError(e.message));
  }, []);

  // ── Load cached package list ───────────────────────────────────────────

  const refreshPackageList = useCallback(async () => {
    try {
      const list = await listPackages();
      // Sort newest first
      list.sort((a, b) => b.savedAt.localeCompare(a.savedAt));
      setCachedPackages(list);
    } catch {
      /* silently ignore */
    }
  }, []);

  useEffect(() => {
    refreshPackageList();
  }, [refreshPackageList]);

  // ── Check saved session when package + learner changes ────────────────

  useEffect(() => {
    if (!selectedPkg) { setSavedSession(null); return; }
    const session = loadSession(selectedPkg.manifestId, learnerId);
    setSavedSession(session);
  }, [selectedPkg, learnerId]);

  // ── ZIP upload handler ────────────────────────────────────────────────

  const handleFile = async (file: File) => {
    if (!swReady) { setError("Service Worker가 아직 준비되지 않았습니다."); return; }
    setUploading(true);
    setError(null);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(arrayBuffer);

      // Find imsmanifest.xml
      const manifestFile =
        zip.file("imsmanifest.xml") ??
        Object.values(zip.files).find((f) => f.name.endsWith("imsmanifest.xml"));
      if (!manifestFile) throw new Error("imsmanifest.xml을 찾을 수 없습니다. SCORM 패키지가 맞는지 확인하세요.");

      const xmlText = await manifestFile.async("text");
      const info: ManifestInfo = parseManifest(xmlText);

      // Save ZIP to IndexedDB
      const zipUint8 = new Uint8Array(arrayBuffer);
      await savePackage(info, zipUint8);

      await refreshPackageList();
      setSelectedPkg({ ...info, savedAt: new Date().toISOString(), sizeBytes: zipUint8.byteLength });
      setError(null);
    } catch (e) {
      setError((e as Error).message ?? "ZIP 처리 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  // ── Load package into SW ──────────────────────────────────────────────

  const activatePackage = async (
    pkg: PackageSummary,
    mode: "resume" | "new"
  ) => {
    if (activatingRef.current) return; // prevent double-activation
    activatingRef.current = true;
    if (!swReady) { activatingRef.current = false; setError("Service Worker가 아직 준비되지 않았습니다."); return; }
    setLoadingPackage(true);
    setError(null);

    try {
      // Unload previous package from SW
      if (packageId) unloadPackageFromSW(packageId);

      // Load ZIP from IndexedDB
      const stored = await loadPackage(pkg.manifestId);
      if (!stored) throw new Error("저장된 패키지를 찾을 수 없습니다. 다시 업로드하세요.");

      // Extract ZIP — normalize paths relative to manifest location
      // (iSpring ZIPs often have a root folder: "CourseName/res/index.html")
      const zip = await JSZip.loadAsync(stored.zip);
      const manifestEntry = Object.values(zip.files).find(
        (f) => !f.dir && (f.name === "imsmanifest.xml" || f.name.endsWith("/imsmanifest.xml"))
      );
      const prefix = manifestEntry
        ? manifestEntry.name.slice(0, manifestEntry.name.lastIndexOf("imsmanifest.xml"))
        : "";

      // Re-parse manifest to get correct version/entryPath.
      // IndexedDB may have stale version from before the manifest-parser fix.
      const manifestXml = await manifestEntry!.async("text");
      const freshInfo = parseManifest(manifestXml);
      const effectiveVersion = freshInfo.version;
      const effectiveEntryPath = freshInfo.entryPath;

      // Update selectedPkg state if version/entryPath changed vs cached value
      if (effectiveVersion !== pkg.version || effectiveEntryPath !== pkg.entryPath) {
        setSelectedPkg((prev) =>
          prev ? { ...prev, version: effectiveVersion, entryPath: effectiveEntryPath } : prev
        );
      }

      const fileMap = new Map<string, Uint8Array>();
      for (const [path, file] of Object.entries(zip.files)) {
        if (!file.dir) {
          const normalized = prefix && path.startsWith(prefix) ? path.slice(prefix.length) : path;
          fileMap.set(normalized, await file.async("uint8array"));
        }
      }

      // Use stable ID so iSpring's URL-based internal storage can restore progress
      const newPkgId = pkg.manifestId;
      await loadPackageToSW(newPkgId, fileMap);
      setPackageId(newPkgId);

      // Determine initial SCORM data.
      // Read directly from localStorage (not React state) to avoid stale closure issues.
      const freshSession = mode === "resume"
        ? loadSession(pkg.manifestId, learnerId)
        : null;

      let initialData: Record<string, string>;
      if (freshSession) {
        initialData = { ...freshSession.data };
        // Set entry to "resume" so content knows to restore position
        if (effectiveVersion === "1.2") {
          initialData["cmi.core.entry"] = "resume";
          initialData["cmi.core.session_time"] = "00:00:00";
        } else {
          initialData["cmi.entry"] = "resume";
          // session_time tracks current session only — must reset each session
          initialData["cmi.session_time"] = "PT0S";
        }
      } else {
        if (mode === "new") clearSession(pkg.manifestId, learnerId);
        initialData =
          effectiveVersion === "1.2"
            ? getDefaultData12(learnerId, learnerName)
            : getDefaultData2004(learnerId, learnerName);
      }

      console.log(
        `[SCORM-LAB] activate | ver:${effectiveVersion} | mode:${mode}` +
        ` | session:${!!freshSession} | entry:${initialData[effectiveVersion === "1.2" ? "cmi.core.entry" : "cmi.entry"]}` +
        ` | suspend:${(initialData["cmi.suspend_data"] ?? "").length}자`
      );

      // Reset runtime state
      setScormData(initialData);
      setLogs([]);
      setChecklist({ sessionStarted: false, dataWritten: false, completionSignaled: false, sessionEnded: false });
      setLastSaved(null);
      logIdRef.current = 0;

      // Uninstall old API
      uninstallRuntimeRef.current?.();

      // Install SCORM API
      const callbacks = {
        onDataUpdate: (data: Record<string, string>) => setScormData({ ...data }),
        onLog: (entry: LogEntry) => setLogs((prev) => [entry, ...prev].slice(0, 300)),
        onChecklist: (state: ChecklistState) => setChecklist({ ...state }),
        onSave: (data: Record<string, string>) => {
          saveSession(pkg.manifestId, learnerId, learnerName, effectiveVersion, data);
          setLastSaved(formatSavedTime(new Date().toISOString()));
          setSavedSession(loadSession(pkg.manifestId, learnerId));
        },
      };

      const uninstall =
        effectiveVersion === "1.2"
          ? installScorm12(initialData, callbacks)
          : installScorm2004(initialData, callbacks);
      uninstallRuntimeRef.current = uninstall;

      setPhase("player");
    } catch (e) {
      setError((e as Error).message ?? "패키지 로드 중 오류가 발생했습니다.");
    } finally {
      setLoadingPackage(false);
      activatingRef.current = false;
    }
  };

  // ── Delete package ────────────────────────────────────────────────────

  const handleDelete = async (manifestId: string) => {
    await deletePackage(manifestId);
    if (selectedPkg?.manifestId === manifestId) setSelectedPkg(null);
    await refreshPackageList();
  };

  // ── Reset session ─────────────────────────────────────────────────────

  const handleReset = () => {
    if (!selectedPkg) return;
    clearSession(selectedPkg.manifestId, learnerId);
    setSavedSession(null);
    activatePackage(selectedPkg, "new");
  };

  // ── Cleanup on unmount ────────────────────────────────────────────────

  // 컴포넌트 언마운트 시만 런타임 정리 (packageId 변경 시 실행되면 안 됨)
  useEffect(() => {
    return () => { uninstallRuntimeRef.current?.(); };
  }, []);

  // packageId 변경 시 이전 SW 패키지만 언로드
  useEffect(() => {
    return () => { if (packageId) unloadPackageFromSW(packageId); };
  }, [packageId]);

  // ── Iframe src ────────────────────────────────────────────────────────

  const iframeSrc = packageId && selectedPkg
    ? `/scorm-preview/${packageId}/${selectedPkg.entryPath}`
    : null;

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="h-screen overflow-hidden bg-zinc-50 text-zinc-900 flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-3 border-b border-zinc-200 bg-white shrink-0">
        <Link href="/" className="text-zinc-400 hover:text-zinc-700 transition-colors text-sm">
          ← 홈
        </Link>
        <div className="w-px h-4 bg-zinc-200" />
        <h1 className="font-semibold text-sm">iSpring SCORM 테스트</h1>
        {selectedPkg && (
          <>
            <div className="w-px h-4 bg-zinc-200" />
            <span className="text-sm text-zinc-500 truncate max-w-48">{selectedPkg.title}</span>
            <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded font-medium">
              SCORM {selectedPkg.version}
            </span>
          </>
        )}
        <div className="ml-auto flex items-center gap-2">
          {/* SW status */}
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            swError
              ? "bg-red-100 text-red-600"
              : swReady
              ? "bg-emerald-100 text-emerald-600"
              : "bg-zinc-100 text-zinc-500"
          }`}>
            {swError ? "SW 오류" : swReady ? "● SW 준비됨" : "○ SW 로딩중"}
          </span>
          {phase === "player" && (
            <button
              onClick={() => {
                uninstallRuntimeRef.current?.();
                if (packageId) unloadPackageFromSW(packageId);
                setPhase("setup");
                setPackageId(null);
              }}
              className="text-xs px-3 py-1.5 border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors"
            >
              ← 패키지 선택
            </button>
          )}
        </div>
      </header>

      {/* SW Error banner */}
      {swError && (
        <div className="px-6 py-2.5 bg-red-50 border-b border-red-200 text-sm text-red-700 shrink-0">
          Service Worker 오류: {swError} — HTTPS 또는 localhost에서만 동작합니다.
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="px-6 py-2.5 bg-amber-50 border-b border-amber-200 text-sm text-amber-700 shrink-0 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-amber-500 hover:text-amber-700 text-lg leading-none">×</button>
        </div>
      )}

      {/* SETUP PHASE */}
      {phase === "setup" && (
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Package selection */}
            <section>
              <h2 className="font-semibold text-zinc-700 mb-3">1. 패키지 선택</h2>
              <CachedPackagesList
                packages={cachedPackages}
                selectedId={selectedPkg?.manifestId ?? null}
                learnerId={learnerId}
                onSelect={(pkg) => setSelectedPkg(pkg)}
                onDelete={handleDelete}
              />
              <UploadZone onFile={handleFile} loading={uploading} />
              {uploading && (
                <p className="text-xs text-zinc-500 text-center mt-2">
                  ZIP 압축 해제 및 IndexedDB 저장 중...
                </p>
              )}
            </section>

            {/* Learner info */}
            {selectedPkg && (
              <section>
                <h2 className="font-semibold text-zinc-700 mb-3">2. 학습자 정보</h2>
                <div className="bg-white border border-zinc-200 rounded-xl p-5 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-zinc-500 mb-1 block">이름</label>
                      <input
                        value={learnerName}
                        onChange={(e) => setLearnerName(e.target.value)}
                        className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-500 mb-1 block">학습자 ID</label>
                      <input
                        value={learnerId}
                        onChange={(e) => setLearnerId(e.target.value)}
                        className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 font-mono"
                      />
                    </div>
                  </div>

                  {/* Resume option */}
                  {savedSession ? (
                    <div className="pt-1">
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-3 text-sm text-blue-700">
                        이전 학습 기록이 있습니다 (저장: {formatSavedTime(savedSession.lastSaved)})
                        {savedSession.data["cmi.suspend_data"] && " · 진행 위치 저장됨"}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => activatePackage(selectedPkg, "resume")}
                          disabled={loadingPackage}
                          className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                        >
                          {loadingPackage ? "로딩 중..." : "이어서 학습"}
                        </button>
                        <button
                          onClick={() => activatePackage(selectedPkg, "new")}
                          disabled={loadingPackage}
                          className="flex-1 py-2.5 border border-zinc-300 hover:bg-zinc-50 text-zinc-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                        >
                          처음부터 시작
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => activatePackage(selectedPkg, "new")}
                      disabled={loadingPackage}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      {loadingPackage ? "로딩 중..." : "학습 시작"}
                    </button>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      )}

      {/* PLAYER PHASE */}
      {phase === "player" && iframeSrc && selectedPkg && (
        <div className="flex flex-1 min-h-0">
          {/* iframe */}
          <div className="flex-1 bg-white border-r border-zinc-200">
            <iframe
              key={iframeSrc}
              src={iframeSrc}
              className="w-full h-full border-0"
              title="SCORM 콘텐츠"
            />
          </div>

          {/* Right panel */}
          <div className="w-80 shrink-0 bg-white border-l border-zinc-200 flex flex-col overflow-hidden">
            <ProgressPanel
              version={selectedPkg.version}
              data={scormData}
              checklist={checklist}
              logs={logs}
              lastSaved={lastSaved}
              onReset={handleReset}
            />
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {loadingPackage && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-zinc-600">콘텐츠 로딩 중...</p>
          </div>
        </div>
      )}
    </div>
  );
}
