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
import { validateTimeEntry, validateSettings } from "./validation";

// Storage version for data migration
const STORAGE_VERSION_KEY = "workpulse-storage-version";
const CURRENT_STORAGE_VERSION = 1;

// Enhanced storage with error recovery and validation
class StorageError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = "StorageError";
  }
}

// Check if localStorage is available
function isStorageAvailable(): boolean {
  try {
    if (typeof window === "undefined") return false;
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

// Safe localStorage operations with error handling
function safeGetItem(key: string): string | null {
  if (!isStorageAvailable()) {
    console.warn("localStorage is not available");
    return null;
  }

  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    throw new StorageError(`Failed to read from storage: ${key}`, error);
  }
}

function safeSetItem(key: string, value: string): void {
  if (!isStorageAvailable()) {
    console.warn("localStorage is not available");
    return;
  }

  try {
    // Check storage quota
    const quota = navigator.storage?.estimate?.();
    if (quota) {
      quota.then((estimate) => {
        if (estimate.usage && estimate.quota) {
          const usagePercent = (estimate.usage / estimate.quota) * 100;
          if (usagePercent > 90) {
            console.warn("Storage quota is nearly full:", usagePercent);
          }
        }
      });
    }

    localStorage.setItem(key, value);
  } catch (error) {
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      throw new StorageError(
        "Storage quota exceeded. Please clear some data.",
        error
      );
    }
    console.error(`Error writing to localStorage (${key}):`, error);
    throw new StorageError(`Failed to write to storage: ${key}`, error);
  }
}

function safeRemoveItem(key: string): void {
  if (!isStorageAvailable()) return;

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
  }
}

// Data migration helper
function migrateData(version: number): void {
  if (version >= CURRENT_STORAGE_VERSION) return;

  try {
    // Future migration logic here
    // Example: if (version < 2) { migrateToV2(); }
    safeSetItem(STORAGE_VERSION_KEY, CURRENT_STORAGE_VERSION.toString());
  } catch (error) {
    console.error("Data migration failed:", error);
  }
}

// Initialize storage version
function initializeStorageVersion(): void {
  const version = safeGetItem(STORAGE_VERSION_KEY);
  if (!version) {
    safeSetItem(STORAGE_VERSION_KEY, CURRENT_STORAGE_VERSION.toString());
  } else {
    migrateData(parseInt(version, 10));
  }
}

// Enhanced load functions with validation and error recovery
export const loadTimeEntries = (): TimeEntry[] => {
  try {
    initializeStorageVersion();
    const storedEntries = safeGetItem(LOCAL_STORAGE_KEY);
    if (!storedEntries) return [];

    const parsedEntries = JSON.parse(storedEntries);
    if (!Array.isArray(parsedEntries)) {
      console.warn("Invalid time entries format, resetting to empty array");
      return [];
    }

    // Validate and convert entries
    const validEntries: TimeEntry[] = [];
    for (const entry of parsedEntries) {
      try {
        // Convert string dates back to Date objects
        const convertedEntry = {
          ...entry,
          startTime: new Date(entry.startTime),
          endTime: entry.endTime ? new Date(entry.endTime) : null,
          pauseStartTime: entry.pauseStartTime
            ? new Date(entry.pauseStartTime)
            : undefined,
        };

        // Validate entry structure
        const validated = validateTimeEntry(convertedEntry);
        validEntries.push(validated as TimeEntry);
      } catch (error) {
        console.warn("Invalid time entry skipped:", error, entry);
        // Skip invalid entries instead of failing completely
      }
    }

    return validEntries;
  } catch (error) {
    console.error("Error loading time entries from localStorage:", error);
    // Return empty array instead of throwing to prevent app crash
    return [];
  }
};

export const saveTimeEntries = (entries: TimeEntry[]): void => {
  try {
    if (!Array.isArray(entries)) {
      throw new Error("Time entries must be an array");
    }

    // Validate entries before saving
    const validatedEntries = entries
      .map((entry) => {
        try {
          return validateTimeEntry(entry);
        } catch (error) {
          console.warn("Invalid entry skipped during save:", error, entry);
          return null;
        }
      })
      .filter((entry): entry is TimeEntry => entry !== null);

    safeSetItem(LOCAL_STORAGE_KEY, JSON.stringify(validatedEntries));
  } catch (error) {
    if (error instanceof StorageError) {
      throw error;
    }
    console.error("Error saving time entries to localStorage:", error);
    throw new StorageError("Failed to save time entries", error);
  }
};

export const loadActiveEntry = (): ActiveTimeEntry | null => {
  try {
    const storedActiveEntry = safeGetItem(ACTIVE_ENTRY_KEY);
    if (!storedActiveEntry) return null;

    const parsedEntry = JSON.parse(storedActiveEntry);
    const convertedEntry = {
      ...parsedEntry,
      startTime: new Date(parsedEntry.startTime),
      pauseStartTime: parsedEntry.pauseStartTime
        ? new Date(parsedEntry.pauseStartTime)
        : undefined,
    };

    // Validate active entry
    try {
      const validated = validateTimeEntry(convertedEntry);
      if (validated.isActive && !validated.endTime) {
        return validated as ActiveTimeEntry;
      }
      // If entry is not active, clear it
      safeRemoveItem(ACTIVE_ENTRY_KEY);
      return null;
    } catch (error) {
      console.warn("Invalid active entry, clearing:", error);
      safeRemoveItem(ACTIVE_ENTRY_KEY);
      return null;
    }
  } catch (error) {
    console.error("Error loading active entry from localStorage:", error);
    return null;
  }
};

export const saveActiveEntry = (entry: ActiveTimeEntry | null): void => {
  try {
    if (entry) {
      // Validate before saving
      try {
        validateTimeEntry(entry);
        safeSetItem(ACTIVE_ENTRY_KEY, JSON.stringify(entry));
      } catch (error) {
        console.warn("Invalid active entry, not saving:", error);
        safeRemoveItem(ACTIVE_ENTRY_KEY);
      }
    } else {
      safeRemoveItem(ACTIVE_ENTRY_KEY);
    }
  } catch (error) {
    if (error instanceof StorageError) {
      throw error;
    }
    console.error("Error saving active entry to localStorage:", error);
  }
};

export const loadSettings = (): Settings => {
  try {
    if (typeof window === "undefined") return DEFAULT_SETTINGS;

    const storedSettings = safeGetItem(SETTINGS_KEY);
    if (!storedSettings) return DEFAULT_SETTINGS;

    const parsedSettings = JSON.parse(storedSettings);

    // Validate and merge with defaults
    try {
      const validated = validateSettings(parsedSettings);
      return { ...DEFAULT_SETTINGS, ...validated } as Settings;
    } catch (error) {
      console.warn("Invalid settings, using defaults:", error);
      return DEFAULT_SETTINGS;
    }
  } catch (error) {
    console.error("Error loading settings from localStorage:", error);
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: Settings): void => {
  try {
    // Validate before saving
    const validated = validateSettings(settings);
    safeSetItem(SETTINGS_KEY, JSON.stringify(validated));
  } catch (error) {
    if (error instanceof StorageError) {
      throw error;
    }
    console.error("Error saving settings to localStorage:", error);
    throw new StorageError("Failed to save settings", error);
  }
};

export const clearAllEntries = (): void => {
  try {
    safeRemoveItem(LOCAL_STORAGE_KEY);
    safeRemoveItem(ACTIVE_ENTRY_KEY);
  } catch (error) {
    console.error("Error clearing entries:", error);
  }
};

// Export storage utilities
export const getStorageSize = (): {
  used: number;
  available: number;
} | null => {
  if (typeof navigator === "undefined" || !navigator.storage?.estimate) {
    return null;
  }

  return navigator.storage.estimate().then((estimate) => ({
    used: estimate.usage || 0,
    available: estimate.quota || 0,
  })) as unknown as { used: number; available: number };
};

export const clearStorage = async (): Promise<void> => {
  try {
    // Clear all workpulse keys
    safeRemoveItem(LOCAL_STORAGE_KEY);
    safeRemoveItem(ACTIVE_ENTRY_KEY);
    safeRemoveItem(SETTINGS_KEY);
    safeRemoveItem(STORAGE_VERSION_KEY);

    // Note: navigator.storage.clear() is not available in all browsers
    // and would clear ALL storage, not just WorkPulse data
  } catch (error) {
    console.error("Error clearing storage:", error);
    throw new StorageError("Failed to clear storage", error);
  }
};
