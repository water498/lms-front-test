/**
 * sw-bridge.ts
 * Service Worker 등록 및 파일 Map 전송.
 * SW가 /scorm-preview/{packageId}/* 요청을 메모리에서 서빙한다.
 */

let swRegistration: ServiceWorkerRegistration | null = null;

export async function registerSW(): Promise<void> {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
    throw new Error("Service Worker가 지원되지 않는 브라우저입니다.");
  }

  swRegistration = await navigator.serviceWorker.register(
    "/scorm-lab-sw.js",
    { scope: "/" }
  );

  // 이미 active된 경우 바로 진행, 그 외엔 activate 대기
  if (swRegistration.active) return;

  await new Promise<void>((resolve) => {
    const sw =
      swRegistration!.installing ?? swRegistration!.waiting;
    if (!sw) return resolve();
    sw.addEventListener("statechange", function onState() {
      if (sw.state === "activated") {
        sw.removeEventListener("statechange", onState);
        resolve();
      }
    });
  });
}

/** SW가 PONG 응답을 줄 때까지 대기 (활성 확인) */
function pingSW(): Promise<void> {
  return new Promise((resolve, reject) => {
    const sw = swRegistration?.active ?? navigator.serviceWorker.controller;
    if (!sw) return reject(new Error("활성 SW 없음"));

    const channel = new MessageChannel();
    const timer = setTimeout(() => reject(new Error("SW ping 타임아웃")), 3000);
    channel.port1.onmessage = (e) => {
      if (e.data?.type === "PONG") {
        clearTimeout(timer);
        resolve();
      }
    };
    sw.postMessage({ type: "PING" }, [channel.port2]);
  });
}

/**
 * JSZip 추출 결과 파일 Map을 SW로 전송.
 * transferable ArrayBuffer로 전달하여 복사 비용 최소화.
 */
export async function loadPackageToSW(
  packageId: string,
  fileMap: Map<string, Uint8Array>
): Promise<void> {
  // SW 컨트롤러 확보
  const sw =
    swRegistration?.active ??
    navigator.serviceWorker.controller;

  if (!sw) {
    // 컨트롤러 없으면 페이지 리로드 후 재시도 필요
    throw new Error("SW가 아직 이 페이지를 제어하지 않습니다. 페이지를 새로고침 하세요.");
  }

  // 파일 배열 구성 (ArrayBuffer transfer)
  const files: { path: string; data: ArrayBuffer }[] = [];
  const transferables: ArrayBuffer[] = [];

  for (const [path, uint8] of fileMap) {
    // Uint8Array의 버퍼 복사 (공유 버퍼일 수 있으므로 slice)
    const buf = uint8.buffer.slice(
      uint8.byteOffset,
      uint8.byteOffset + uint8.byteLength
    ) as ArrayBuffer;
    files.push({ path, data: buf });
    transferables.push(buf);
  }

  await new Promise<void>((resolve, reject) => {
    const channel = new MessageChannel();
    const timer = setTimeout(
      () => reject(new Error("SW 파일 전송 타임아웃")),
      30_000
    );
    channel.port1.onmessage = (e) => {
      clearTimeout(timer);
      if (e.data?.type === "PACKAGE_READY") resolve();
      else reject(new Error(`SW 오류: ${JSON.stringify(e.data)}`));
    };
    sw.postMessage(
      { type: "LOAD_PACKAGE", packageId, files },
      [channel.port2, ...transferables]
    );
  });
}

export async function unloadPackageFromSW(packageId: string): Promise<void> {
  const sw =
    swRegistration?.active ??
    navigator.serviceWorker.controller;
  sw?.postMessage({ type: "UNLOAD_PACKAGE", packageId });
}

export { pingSW };
