import { useEffect } from "react";

import { useTimeTracker } from "../contexts/TimeTrackerContext";

export const useDocumentTitle = () => {
  const { activeEntry } = useTimeTracker();

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
};
