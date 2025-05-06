"use client";

import React from "react";

import { Card, CardContent } from "@/components/ui/card";
import TimerControls from "@/components/TimerControls";
import TimeEntryForm from "@/components/form/TimeEntryForm";
import { useActiveEntry } from "@/app/hooks/useActiveEntry";
import { useTimeTracker } from "@/app/contexts/TimeTrackerContext";

const TimerCard = () => {
  const { activeEntry } = useActiveEntry();
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

  return (
    <>
      <Card
        className={`p-6 shadow-lg rounded-2xl transition-all duration-300 ${
          activeEntry && !activeEntry.isPaused
            ? "border-primary/50 shadow-primary/10 bg-primary/5"
            : activeEntry && activeEntry.isPaused
            ? "border-yellow-400/50 shadow-yellow-100/20 bg-yellow-50/30"
            : "border-muted/50 hover:border-muted/80 hover:shadow-md"
        }`}
      >
        <CardContent className="p-0">
          <TimerControls />
          <div className="mt-12">
            <TimeEntryForm />
          </div>
        </CardContent>
      </Card>

      {todayTotal > 0 && (
        <div className="bg-primary/5 rounded-lg p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-primary font-medium">{`Today's total:`}</span>
            <span className="font-bold">{formatTotalTime(todayTotal)}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default TimerCard;
