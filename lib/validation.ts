import { z } from "zod";

// Time Entry Validation Schemas
export const TimeEntrySchema = z.object({
  id: z.string().uuid(),
  client: z.string().min(1, "Client is required").max(200, "Client name is too long"),
  task: z.string().min(1, "Task is required").max(200, "Task name is too long"),
  startTime: z.date(),
  endTime: z.date().nullable(),
  pausedTime: z.number().min(0).default(0),
  isActive: z.boolean(),
  isPaused: z.boolean(),
  description: z.string().max(1000, "Description is too long").optional(),
  tags: z.array(z.string().max(50, "Tag is too long")).max(20, "Too many tags").optional(),
  pauseStartTime: z.date().optional(),
});

export const ActiveTimeEntrySchema = TimeEntrySchema.extend({
  endTime: z.null(),
  isActive: z.literal(true),
});

export const SettingsSchema = z.object({
  // Timer settings
  idleTimeout: z.number().min(1).max(1440).default(30),
  roundTimeEntries: z.boolean().default(false),
  autoStopAt: z.string().nullable().default(null),
  autoStop: z.boolean().default(false),
  autoStopMinutes: z.number().min(1).max(1440).default(60),
  autoContinue: z.boolean().default(false),
  defaultClient: z.string().max(200).default(""),
  defaultTask: z.string().max(200).default(""),

  // Display settings
  hour12: z.boolean().default(true),
  dateFormat: z.enum(["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]).default("MM/DD/YYYY"),
  showSeconds: z.boolean().default(true),
  compactView: z.boolean().default(false),
  showDescriptions: z.boolean().default(true),
  animations: z.boolean().default(true),
  theme: z.enum(["light", "dark", "system"]).default("system"),
  weekStart: z.enum(["monday", "sunday", "saturday"]).default("sunday"),

  // Notification settings
  notificationsEnabled: z.boolean().default(false),
  autoPauseEnabled: z.boolean().default(false),
  autoPauseMinutes: z.number().min(1).max(1440).default(25),
  dailyReminders: z.boolean().default(true),
  idleReminders: z.boolean().default(true),
  timerAlerts: z.boolean().default(true),
  dailySummary: z.boolean().default(false),
  notificationSound: z.enum(["default", "subtle", "none"]).default("default"),

  // Data settings
  autoSave: z.boolean().default(true),
  backupFrequency: z.enum(["hourly", "daily", "weekly", "never"]).default("daily"),
  autoArchive: z.boolean().default(false),
  archivePeriod: z.string().default("3months"),
});

// Webhook URL validation
export const WebhookUrlSchema = z
  .string()
  .url("Invalid URL format")
  .refine(
    (url) => {
      try {
        const parsedUrl = new URL(url);
        return ["http:", "https:"].includes(parsedUrl.protocol);
      } catch {
        return false;
      }
    },
    { message: "URL must use HTTP or HTTPS protocol" }
  )
  .refine(
    (url) => {
      try {
        const parsedUrl = new URL(url);
        // Allow common webhook domains
        const allowedDomains = [
          "hooks.zapier.com",
          "zapier.com",
          "webhook.site",
          "requestbin.com",
        ];
        return (
          allowedDomains.some((domain) => parsedUrl.hostname.includes(domain)) ||
          process.env.NODE_ENV === "development"
        );
      } catch {
        return false;
      }
    },
    { message: "Webhook URL must be from a trusted domain" }
  );

// Input sanitization helpers
export function sanitizeString(input: string, maxLength: number = 200): string {
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[\x00-\x1F\x7F]/g, ""); // Remove control characters
}

export function sanitizeTag(tag: string): string {
  return sanitizeString(tag, 50)
    .replace(/[^\w\s-]/g, "") // Remove special characters except hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .toLowerCase();
}

export function validateTimeEntry(entry: unknown) {
  return TimeEntrySchema.parse(entry);
}

export function validateSettings(settings: unknown) {
  return SettingsSchema.parse(settings);
}

export function validateWebhookUrl(url: string) {
  return WebhookUrlSchema.parse(url);
}

