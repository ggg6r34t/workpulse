export interface ActiveTimeEntry extends TimeEntry {
  startTime: Date;
  isActive: true;
  endTime: null;
  pausedTime: number;
  isPaused: boolean;
  pauseStartTime?: Date;
}

export const DEFAULT_SETTINGS: Settings = {
  // Timer settings
  idleTimeout: 30,
  roundTimeEntries: false,
  autoStopAt: null,
  autoStop: false,
  autoStopMinutes: 60,
  autoContinue: false,
  defaultClient: "",
  defaultTask: "",

  // Display settings
  timeFormat: "12h",
  dateFormat: "MM/DD/YYYY",
  showSeconds: true,
  compactView: false,
  showDescriptions: true,
  animations: true,
  theme: "system",

  // Notification settings
  notificationsEnabled: false,
  idleReminders: true,
  timerAlerts: true,
  dailySummary: false,
  notificationSound: "default",

  // Data settings
  autoSave: true,
  backupFrequency: "daily",
  autoArchive: false,
  archivePeriod: "3months",
};

export interface Settings {
  // Timer settings
  idleTimeout: number;
  roundTimeEntries: boolean;
  autoStopAt: string | null;
  autoStop?: boolean;
  autoStopMinutes?: number;
  autoContinue?: boolean;
  defaultClient?: string;
  defaultTask?: string;

  // Display settings
  timeFormat: "12h" | "24h";
  dateFormat: string;
  showSeconds: boolean;
  compactView: boolean;
  showDescriptions?: boolean;
  animations?: boolean;
  theme?: "light" | "dark" | "system";

  // Notification settings
  notificationsEnabled?: boolean;
  idleReminders?: boolean;
  timerAlerts?: boolean;
  dailySummary?: boolean;
  notificationSound?: "default" | "subtle" | "none";

  // Data settings
  autoSave?: boolean;
  backupFrequency?: string;
  autoArchive?: boolean;
  archivePeriod?: string;
}

export interface TimeEntry {
  id: string;
  client: string;
  task: string;
  startTime: Date;
  endTime: Date | null;
  pausedTime: number; // Total time in milliseconds that the timer was paused
  isActive: boolean;
  isPaused: boolean;
  description?: string;
  tags?: string[];
  pauseStartTime?: Date;
}

export interface TimeTrackerContextProps {
  timeEntries: TimeEntry[];
  setTimeEntries: (entries: TimeEntry[]) => void;
  activeEntry: ActiveTimeEntry | null;
  clearAllEntries: () => void;
  settings: Settings;
  startTimer: (
    client: string,
    task: string,
    description?: string,
    tags?: string[]
  ) => void;
  stopTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  deleteEntry: (id: string) => void;
  updateEntry: (id: string, updates: Partial<TimeEntry>) => void;
  elapsedTime: number;
  requestNotificationPermission: () => void;
  notificationsEnabled: boolean;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetSettings: () => void;
}
