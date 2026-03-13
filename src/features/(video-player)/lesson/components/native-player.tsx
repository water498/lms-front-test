"use client";

import { useEffect, useRef } from "react";
import { fmtTime } from "../utils";

interface PlayerCallbacks {
  onDurationChange: (d: number) => void;
  onTimeUpdate: (t: number) => void;
  onEvent: (e: string) => void;
  onEnded: () => void;
}

export function NativePlayer({
  src,
  restrictMode,
  maxWatched,
  callbacks,
}: {
  src: string;
  restrictMode: boolean;
  maxWatched: number;
  callbacks: PlayerCallbacks;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const restrictRef = useRef(restrictMode);
  const maxWatchedRef = useRef(maxWatched);

  useEffect(() => { restrictRef.current = restrictMode; }, [restrictMode]);
  useEffect(() => { maxWatchedRef.current = maxWatched; }, [maxWatched]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const onDuration = () => callbacks.onDurationChange(el.duration || 0);
    const onTime = () => callbacks.onTimeUpdate(el.currentTime);
    const onPlay = () => callbacks.onEvent("play");
    const onPause = () => callbacks.onEvent("pause");
    const onEnded = () => callbacks.onEnded();
    const onSeeking = () => {
      if (restrictRef.current && el.currentTime > maxWatchedRef.current) {
        el.currentTime = maxWatchedRef.current;
        callbacks.onEvent(`seeking → blocked (max: ${fmtTime(maxWatchedRef.current)})`);
      } else {
        callbacks.onEvent(`seeking → ${fmtTime(el.currentTime)}`);
      }
    };

    el.addEventListener("durationchange", onDuration);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);
    el.addEventListener("seeking", onSeeking);

    return () => {
      el.removeEventListener("durationchange", onDuration);
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("seeking", onSeeking);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <video
      ref={videoRef}
      src={src}
      controls
      className="w-full aspect-video bg-black"
    />
  );
}
