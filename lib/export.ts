import {
  formatDate,
  formatTime,
  calculateDuration,
  formatDuration,
} from "./time";
import { DEFAULT_SETTINGS, TimeEntry } from "@/types/types";

// Helper function to convert time entries to CSV format
export function exportToCSV(timeEntries: TimeEntry[]): void {
  // Create header row
  const headers = [
    "Date",
    "Client",
    "Task",
    "Description",
    "Start Time",
    "End Time",
    "Duration",
    "Tags",
  ];

  // Create data rows
  const rows = timeEntries.map((entry) => {
    const startTime = entry.startTime;
    const endTime = entry.endTime || new Date();
    const duration = calculateDuration({
      startTime: entry.startTime,
      endTime: entry.endTime || new Date(),
      pausedTime: entry.pausedTime,
    });

    return [
      formatDate(startTime),
      entry.client,
      entry.task,
      entry.description || "",
      formatTime(startTime, DEFAULT_SETTINGS),
      entry.endTime ? formatTime(endTime, DEFAULT_SETTINGS) : "In progress",
      formatDuration(duration),
      entry.tags ? entry.tags.join(", ") : "",
    ];
  });

  // Combine header and data rows
  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  // Create a Blob and download link
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `time-entries-${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
