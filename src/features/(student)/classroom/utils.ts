type Range = [number, number];

export function mergeRanges(ranges: Range[], newRange: Range): Range[] {
  if (newRange[0] >= newRange[1]) return ranges;
  const sorted = [...ranges, newRange].sort((a, b) => a[0] - b[0]);
  const merged: Range[] = [];
  for (const r of sorted) {
    const last = merged[merged.length - 1];
    if (last && r[0] <= last[1] + 0.5) {
      last[1] = Math.max(last[1], r[1]);
    } else {
      merged.push([...r] as Range);
    }
  }
  return merged;
}

export function totalWatched(ranges: Range[]): number {
  return ranges.reduce((sum, [s, e]) => sum + Math.max(0, e - s), 0);
}

export function fmtTime(secs: number): string {
  if (!isFinite(secs) || secs < 0) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
