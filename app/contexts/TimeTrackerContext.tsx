"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import {
  createNewEntry,
  stopEntry,
  pauseEntry,
  resumeEntry,
  calculateElapsedTime,
  showTimerNotification,
} from "@/lib/timer";
import {
  isNotificationPermissionGranted,
  requestNotificationPermission as requestPermission,
} from "@/lib/notification";
import {
  loadTimeEntries,
  saveTimeEntries,
  loadActiveEntry,
  saveActiveEntry,
  loadSettings,
  saveSettings,
  clearAllEntries as clearStorage,
} from "@/lib/storage";
import { TimeEntry, ActiveTimeEntry, Settings } from "@/types/types";
import { TimeTrackerContextProps, DEFAULT_SETTINGS } from "@/types/types";
import { toast } from "../hooks/useToast";
import { useTheme } from "next-themes";

const TimeTrackerContext = createContext<TimeTrackerContextProps | undefined>(
  undefined
);

export const TimeTrackerProvider = ({ children }: { children: ReactNode }) => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [activeEntry, setActiveEntry] = useState<ActiveTimeEntry | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [notificationsEnabled, setNotificationsEnabled] =
    useState<boolean>(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const { setTheme } = useTheme();

  // Initialize from localStorage
  useEffect(() => {
    setTimeEntries(loadTimeEntries());
    setActiveEntry(loadActiveEntry());
    const loadedSettings = loadSettings();
    setSettings(loadedSettings);

    // Set theme from settings
    if (loadedSettings.theme) {
      setTheme(loadedSettings.theme);
    }

    // Check if notifications are already allowed
    if (isNotificationPermissionGranted()) {
      setNotificationsEnabled(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save entries to localStorage when they change
  useEffect(() => {
    saveTimeEntries(timeEntries);
  }, [timeEntries]);

  // Save active entry to localStorage when it changes
  useEffect(() => {
    saveActiveEntry(activeEntry);
  }, [activeEntry]);

  // Save settings to localStorage when they change
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Update elapsed time every second
  useEffect(() => {
    if (!activeEntry) {
      setElapsedTime(0);
      return;
    }

    if (activeEntry.isPaused) {
      return; // Don't update elapsed time when paused
    }

    const interval = setInterval(() => {
      setElapsedTime(calculateElapsedTime(activeEntry));
    }, 1000);

    return () => clearInterval(interval);
  }, [activeEntry]);

  const startTimer = (
    client: string,
    task: string,
    description?: string,
    tags?: string[]
  ) => {
    if (activeEntry) {
      // If there's already an active entry, stop it first
      stopTimer();
    }

    const newEntry = createNewEntry(client, task, description, tags);
    setActiveEntry(newEntry);
    setTimeEntries((prev) => [...prev, newEntry]);
    showTimerNotification("started", newEntry);
  };

  const stopTimer = () => {
    if (!activeEntry) return;

    const stoppedEntry = stopEntry(activeEntry);
    setTimeEntries((prev) =>
      prev.map((entry) => (entry.id === activeEntry.id ? stoppedEntry : entry))
    );
    setActiveEntry(null);
    showTimerNotification("stopped", stoppedEntry);
  };

  const pauseTimer = () => {
    if (!activeEntry || activeEntry.isPaused) return;

    const pausedEntry = pauseEntry(activeEntry);
    setActiveEntry(pausedEntry);
    setTimeEntries((prev) =>
      prev.map((entry) =>
        entry.id === activeEntry.id ? { ...entry, isPaused: true } : entry
      )
    );
    showTimerNotification("paused", pausedEntry);
  };

  const resumeTimer = () => {
    if (!activeEntry || !activeEntry.isPaused || !activeEntry.pauseStartTime)
      return;

    const resumedEntry = resumeEntry(activeEntry);
    setActiveEntry(resumedEntry);
    setTimeEntries((prev) =>
      prev.map((entry) =>
        entry.id === activeEntry.id
          ? { ...entry, isPaused: false, pausedTime: resumedEntry.pausedTime }
          : entry
      )
    );
    showTimerNotification("resumed", resumedEntry);
  };

  const deleteEntry = (id: string) => {
    // If deleting the active entry, clear it
    if (activeEntry && activeEntry.id === id) {
      setActiveEntry(null);
    }

    setTimeEntries((prev) => prev.filter((entry) => entry.id !== id));
    toast({
      title: "Entry Deleted",
      description: "Time entry has been removed",
      variant: "success",
    });
  };

  const updateEntry = (id: string, updates: Partial<TimeEntry>) => {
    setTimeEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, ...updates } : entry))
    );

    // If updating the active entry, update it in the active state as well
    if (activeEntry && activeEntry.id === id) {
      setActiveEntry({
        ...activeEntry,
        ...updates,
        isActive: true,
        endTime: null,
      });
    }
  };

  const requestNotificationPermission = async () => {
    const granted = await requestPermission();
    setNotificationsEnabled(granted);
    return granted;
  };

  const clearAllEntries = () => {
    setTimeEntries([]);
    setActiveEntry(null);
    clearStorage();
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prevSettings) => {
      const updatedSettings = {
        ...prevSettings,
        ...newSettings,
      };

      // If theme is updated, update the theme
      if (newSettings.theme && newSettings.theme !== prevSettings.theme) {
        setTheme(newSettings.theme);
      }

      return updatedSettings;
    });
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const contextValue: TimeTrackerContextProps = {
    timeEntries,
    setTimeEntries,
    activeEntry,
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer,
    deleteEntry,
    updateEntry,
    clearAllEntries,
    elapsedTime,
    requestNotificationPermission,
    notificationsEnabled,
    updateSettings,
    settings,
    resetSettings,
  };

  return (
    <TimeTrackerContext.Provider value={contextValue}>
      {children}
    </TimeTrackerContext.Provider>
  );
};

export const useTimeTracker = () => {
  const context = useContext(TimeTrackerContext);
  if (context === undefined) {
    throw new Error("useTimeTracker must be used within a TimeTrackerProvider");
  }
  return context;
};
