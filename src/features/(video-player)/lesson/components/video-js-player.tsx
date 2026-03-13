"use client";

import { useEffect, useRef } from "react";
import { fmtTime } from "../utils";

interface PlayerCallbacks {
  onDurationChange: (d: number) => void;
  onTimeUpdate: (t: number) => void;
  onEvent: (e: string) => void;
  onEnded: () => void;
}

export function VideoJsPlayer({
  src,
  mimeType,
  restrictMode,
  maxWatched,
  callbacks,
}: {
  src: string;
  mimeType: string;
  restrictMode: boolean;
  maxWatched: number;
  callbacks: PlayerCallbacks;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<ReturnType<typeof setTimeout> | null>(null) as React.MutableRefObject<any>;
  const restrictRef = useRef(restrictMode);
  const maxWatchedRef = useRef(maxWatched);

  useEffect(() => { restrictRef.current = restrictMode; }, [restrictMode]);
  useEffect(() => { maxWatchedRef.current = maxWatched; }, [maxWatched]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const videoEl = document.createElement("video");
    videoEl.className = "video-js vjs-big-play-centered";
    container.appendChild(videoEl);
    let mounted = true;

    import("video.js").then(({ default: videojs }) => {
      if (!mounted) {
        videoEl.remove();
        return;
      }
      const player = videojs(videoEl, {
        controls: true,
        fluid: true,
        playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
        sources: [{ src, type: mimeType }],
      });
      playerRef.current = player;

      player.on("durationchange", () => callbacks.onDurationChange(player.duration() || 0));
      player.on("play", () => callbacks.onEvent("play"));
      player.on("pause", () => callbacks.onEvent("pause"));
      player.on("ended", () => callbacks.onEnded());

      player.on("seeking", () => {
        const ct = player.currentTime() ?? 0;
        if (restrictRef.current && ct > maxWatchedRef.current) {
          player.currentTime(maxWatchedRef.current);
          callbacks.onEvent(`seeking → blocked (max: ${fmtTime(maxWatchedRef.current)})`);
        } else {
          callbacks.onEvent(`seeking → ${fmtTime(ct)}`);
        }
      });

      player.on("timeupdate", () => {
        const ct = player.currentTime() ?? 0;
        // Fallback: catch forward seeks that didn't fire seeking event
        if (restrictRef.current && ct > maxWatchedRef.current + 0.5) {
          player.currentTime(maxWatchedRef.current);
          return;
        }
        callbacks.onTimeUpdate(ct);
      });

      player.on("ratechange", () => {
        const rate = player.playbackRate();
        if (restrictRef.current && rate !== 1) {
          player.playbackRate(1);
          callbacks.onEvent(`ratechange ${rate}x → blocked (1x 고정)`);
        } else {
          callbacks.onEvent(`ratechange → ${rate}x`);
        }
      });
    });

    return () => {
      mounted = false;
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      } else {
        videoEl.remove();
      }
    };
  }, [src, mimeType]); // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={containerRef} className="w-full aspect-video bg-black" />;
}
