export function formatDuration(milliseconds: number): string {
  if (milliseconds < 0) return "00:00:00";

  const seconds = Math.floor(milliseconds / 1000) % 60;
  const minutes = Math.floor(milliseconds / (1000 * 60)) % 60;
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));

  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export function calculateDuration(entry: {
  startTime: Date;
  endTime: Date | null;
  pausedTime: number;
}): number {
  if (!entry.endTime) {
    return 0;
  }

  const rawDuration = entry.endTime.getTime() - entry.startTime.getTime();
  return Math.max(0, rawDuration - entry.pausedTime);
}

export function getDurationBetweenDates(start: Date, end: Date): number {
  return end.getTime() - start.getTime();
}
