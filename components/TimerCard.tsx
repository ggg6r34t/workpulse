"use client";

import React, { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "./ui/label";
import PomodoroTimer from "./pomodoro/PomodoroTimer";
import TimerControls from "@/components/TimerControls";
import TimeEntryForm from "@/components/form/TimeEntryForm";
import { TimerIcon } from "lucide-react";
import { Switch } from "./ui/switch";
import { useTimeTracker } from "@/app/contexts/TimeTrackerContext";

const TimerCard = () => {
  const { activeEntry } = useTimeTracker();
  const [showPomodoro, setShowPomodoro] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);

  // Show form if there's no active timer
  const handleMouseEnter = () => {
    if (!activeEntry) {
      setShowForm(true);
    }
  };

  return (
    <Card
      className={`bg-card p-6 border-muted/50 shadow-lg rounded-2xl transition-all duration-300 }`}
      id="timer-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setShowForm(false)}
    >
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <TimerIcon className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-medium">Time Tracking</h2>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="pomodoro-mode"
              checked={showPomodoro}
              onCheckedChange={setShowPomodoro}
            />
            <Label htmlFor="pomodoro-mode" className="text-sm">
              Pomodoro Mode
            </Label>
          </div>
        </div>

        {showPomodoro ? (
          <PomodoroTimer />
        ) : (
          <>
            <TimerControls />
            <div
              className={`mt-8 pt-6 border-t border-border/40 transition-all duration-300 ${
                showForm
                  ? "opacity-100 max-h-[800px]"
                  : "opacity-0 max-h-0 overflow-hidden"
              }`}
            >
              <TimeEntryForm />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TimerCard;
