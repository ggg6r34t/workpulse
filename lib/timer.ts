import { TimeEntry, ActiveTimeEntry } from "@/types/types";
import { toast } from "@/app/hooks/useToast";
import { v4 as uuidv4 } from "uuid";

export const createNewEntry = (
  client: string,
  task: string,
  description?: string,
  tags?: string[]
): ActiveTimeEntry => {
  return {
    id: uuidv4(),
    client,
    task,
    startTime: new Date(),
    endTime: null,
    pausedTime: 0,
    isActive: true,
    isPaused: false,
    description,
    tags,
  };
};

export const stopEntry = (activeEntry: ActiveTimeEntry): TimeEntry => {
  const now = new Date();
  return {
    ...activeEntry,
    endTime: now,
    isActive: false,
    isPaused: false,
  };
};

export const pauseEntry = (activeEntry: ActiveTimeEntry): ActiveTimeEntry => {
  const now = new Date();
  return {
    ...activeEntry,
    isPaused: true,
    pauseStartTime: now,
  };
};

export const resumeEntry = (activeEntry: ActiveTimeEntry): ActiveTimeEntry => {
  if (!activeEntry.pauseStartTime) {
    return activeEntry;
  }

  const now = new Date();
  const pauseDuration = now.getTime() - activeEntry.pauseStartTime.getTime();
  const totalPausedTime = (activeEntry.pausedTime || 0) + pauseDuration;

  return {
    ...activeEntry,
    isPaused: false,
    pauseStartTime: undefined,
    pausedTime: totalPausedTime,
  };
};

export const calculateElapsedTime = (activeEntry: ActiveTimeEntry): number => {
  if (!activeEntry) return 0;

  const now = new Date();
  const pausedDuration = activeEntry.pausedTime || 0;
  return now.getTime() - activeEntry.startTime.getTime() - pausedDuration;
};

export const showTimerNotification = (
  action: "started" | "stopped" | "paused" | "resumed",
  entry: ActiveTimeEntry | TimeEntry
) => {
  const messages = {
    started: {
      title: "Timer Started",
      description: `Tracking time for ${entry.task} (${entry.client})`,
      variant: "success" as const,
    },
    stopped: {
      title: "Timer Stopped",
      description: `Finished tracking time for ${entry.task}`,
      variant: "success" as const,
    },
    paused: {
      title: "Timer Paused",
      description: `Paused tracking for ${entry.task}`,
      variant: "warning" as const,
    },
    resumed: {
      title: "Timer Resumed",
      description: `Resumed tracking for ${entry.task}`,
      variant: "success" as const,
    },
  };

  toast(messages[action]);
};
