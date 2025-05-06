import {
  ACTIVE_ENTRY_KEY,
  LOCAL_STORAGE_KEY,
  SETTINGS_KEY,
} from "@/app/constants/timeTracker";
import {
  TimeEntry,
  ActiveTimeEntry,
  Settings,
  DEFAULT_SETTINGS,
} from "@/types/types";

export const loadTimeEntries = (): TimeEntry[] => {
  try {
    const storedEntries = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!storedEntries) return [];

    const parsedEntries = JSON.parse(storedEntries);
    // Convert string dates back to Date objects
    return parsedEntries.map((entry: TimeEntry) => ({
      ...entry,
      startTime: new Date(entry.startTime),
      endTime: entry.endTime ? new Date(entry.endTime) : null,
      pauseStartTime: entry.pauseStartTime
        ? new Date(entry.pauseStartTime)
        : undefined,
    }));
  } catch (error) {
    console.error("Error loading time entries from localStorage:", error);
    return [];
  }
};

export const saveTimeEntries = (entries: TimeEntry[]): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries));
};

export const loadActiveEntry = (): ActiveTimeEntry | null => {
  try {
    const storedActiveEntry = localStorage.getItem(ACTIVE_ENTRY_KEY);
    if (!storedActiveEntry) return null;

    const parsedEntry = JSON.parse(storedActiveEntry);
    return {
      ...parsedEntry,
      startTime: new Date(parsedEntry.startTime),
      pauseStartTime: parsedEntry.pauseStartTime
        ? new Date(parsedEntry.pauseStartTime)
        : undefined,
    };
  } catch (error) {
    console.error("Error loading active entry from localStorage:", error);
    return null;
  }
};

export const saveActiveEntry = (entry: ActiveTimeEntry | null): void => {
  if (entry) {
    localStorage.setItem(ACTIVE_ENTRY_KEY, JSON.stringify(entry));
  } else {
    localStorage.removeItem(ACTIVE_ENTRY_KEY);
  }
};

export const loadSettings = (): Settings => {
  try {
    if (typeof window === "undefined") return DEFAULT_SETTINGS;

    const storedSettings = localStorage.getItem(SETTINGS_KEY);
    return storedSettings ? JSON.parse(storedSettings) : DEFAULT_SETTINGS;
  } catch (error) {
    console.error("Error loading settings from localStorage:", error);
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: Settings): void => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const clearAllEntries = (): void => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  localStorage.removeItem(ACTIVE_ENTRY_KEY);
};
