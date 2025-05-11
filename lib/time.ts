import { Settings } from "@/types/types";

export function formatDuration(
  milliseconds: number,
  settings?: Pick<Settings, "showSeconds">
): string {
  if (milliseconds < 0) return "00:00:00";

  const seconds = Math.floor(milliseconds / 1000) % 60;
  const minutes = Math.floor(milliseconds / (1000 * 60)) % 60;
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));

  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  return settings?.showSeconds === false
    ? `${formattedHours}:${formattedMinutes}`
    : `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

export function formatDate(
  date: Date,
  settings?: Pick<Settings, "dateFormat">
): string {
  const [month, day, year] = date
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .split(/[/-]/);

  switch (settings?.dateFormat) {
    case "DD/MM/YYYY":
      return `${day}/${month}/${year}`;
    case "YYYY-MM-DD":
      return `${year}-${month}-${day}`;
    case "MM/DD/YYYY":
    default:
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
  }
}

// export function formatTime(date: Date): string {
//   return date.toLocaleTimeString("en-US", {
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//     hour12: true,
//   });
// }

// For formatting absolute times (e.g., 1:30 PM or 13:30)
export function formatTime(
  date: Date,
  settings: Pick<Settings, "hour12" | "showSeconds">
): string {
  return date
    .toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: settings.showSeconds ? "2-digit" : undefined,
      hour12: settings.hour12,
    })
    .replace(/\s([AP]M)/, (match) => match.toLowerCase()); // makes "AM/PM" lowercase
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
