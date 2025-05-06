"use client";

import { useEffect } from "react";

import { useTimeTracker } from "@/app/contexts/TimeTrackerContext";

export function useActiveEntry() {
  const { activeEntry, notificationsEnabled } = useTimeTracker();

  // Set up idle reminder notification
  useEffect(() => {
    let idleTimer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(idleTimer);

      // Only set idle timer if notifications are enabled and no timer is active
      if (notificationsEnabled && !activeEntry) {
        idleTimer = setTimeout(() => {
          new Notification("WorkPulse Reminder", {
            body: "Don't forget to track your time!",
          });
        }, 30 * 60 * 1000); // 30 minutes
      }
    };

    // Reset timer on user activity
    const events = ["mousedown", "keypress", "scroll", "touchstart"];
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Initialize timer
    resetTimer();

    return () => {
      clearTimeout(idleTimer);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [activeEntry, notificationsEnabled]);

  // Update page title to show timer status
  useEffect(() => {
    if (activeEntry && !activeEntry.isPaused) {
      document.title = `⏱️ ${activeEntry.task} | WorkPulse`;
    } else if (activeEntry && activeEntry.isPaused) {
      document.title = `⏸️ ${activeEntry.task} | WorkPulse`;
    } else {
      document.title = "WorkPulse Time Tracker";
    }
  }, [activeEntry]);

  return { activeEntry };
}
