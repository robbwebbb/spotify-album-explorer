export function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function formatDate(dateStr: string, precision: "year" | "month" | "day"): string {
  if (precision === "year") return dateStr;
  if (precision === "month") return dateStr.slice(0, 7);
  return dateStr;
}

export function formatExplicit(explicit: boolean): string {
  return explicit ? "🅴" : "";
}

export function formatKey(key: number): string {
  const keys = ["C", "C♯/D♭", "D", "D♯/E♭", "E", "F", "F♯/G♭", "G", "G♯/A♭", "A", "A♯/B♭", "B"];
  return keys[key] ?? "Unknown";
}

export function formatMode(mode: number): string {
  return mode === 1 ? "Major" : "Minor";
}

export function formatTimeSignature(ts: number): string {
  return `${ts}/4`;
}

export function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max - 1) + "…";
}