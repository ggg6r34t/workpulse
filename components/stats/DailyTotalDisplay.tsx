"use client";
import { useTimeTracker } from "@/app/contexts/TimeTrackerContext";

const DailyTotalDisplay = () => {
  const { timeEntries } = useTimeTracker();

  // Calculate today's total time
  const calculateTodayTotal = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return timeEntries
      .filter((entry) => {
        const entryDate = new Date(entry.startTime);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === today.getTime() && entry.endTime;
      })
      .reduce((total, entry) => {
        const duration = entry.endTime
          ? entry.endTime.getTime() -
            entry.startTime.getTime() -
            (entry.pausedTime || 0)
          : 0;
        return total + duration;
      }, 0);
  };

  const formatTotalTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  const todayTotal = calculateTodayTotal();

  if (todayTotal === 0) {
    return (
      <div className="rounded-xl p-4 flex justify-between items-center animate-in">
        <div className="flex items-center space-x-3">
          <span className="text-primary font-medium">
            No time tracked today
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-4 flex justify-between items-center animate-in">
      <div className="flex items-center space-x-3">
        <span className="text-primary font-medium">{`Today's total:`}</span>
        <span className="text-xl font-bold">{formatTotalTime(todayTotal)}</span>
      </div>
    </div>
  );
};

export default DailyTotalDisplay;
