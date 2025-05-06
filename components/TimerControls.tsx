"use client";

import React from "react";
import { Play, Pause, StopCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatDuration } from "@/lib/time";
import { useTimeTracker } from "@/app/contexts/TimeTrackerContext";

const TimerControls: React.FC = () => {
  const {
    activeEntry,
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer,
    elapsedTime,
  } = useTimeTracker();

  const formattedTime = formatDuration(elapsedTime);
  const isActive = !!activeEntry;
  const isPaused = activeEntry?.isPaused || false;

  return (
    <div className="flex flex-col items-center space-y-6">
      <div
        className={`text-6xl font-mono font-bold tracking-wider transition-colors ${
          isActive && !isPaused ? "text-primary" : "text-foreground"
        }`}
      >
        {formattedTime}
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {!isActive ? (
          <Button
            onClick={() => startTimer("No Client", "No Task")}
            size="lg"
            className="bg-primary hover:bg-primary/90 flex items-center px-10 py-7 rounded-full shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
          >
            <Play className="mr-2 h-6 w-6" />
            Start Timer
          </Button>
        ) : (
          <>
            {isPaused ? (
              <Button
                onClick={resumeTimer}
                variant="outline"
                size="lg"
                className="flex items-center px-8 py-6 rounded-full bg-green-50 border-green-200 text-green-600 hover:bg-green-100 hover:text-green-700 transition-all"
              >
                <Play className="mr-2 h-6 w-6" />
                Resume
              </Button>
            ) : (
              <Button
                onClick={pauseTimer}
                variant="outline"
                size="lg"
                className="flex items-center px-8 py-6 rounded-full bg-yellow-50 border-yellow-200 text-yellow-600 hover:bg-yellow-100 hover:text-yellow-700 transition-all"
              >
                <Pause className="mr-2 h-6 w-6" />
                Pause
              </Button>
            )}

            <Button
              onClick={stopTimer}
              variant="outline"
              size="lg"
              className="flex items-center px-8 py-6 rounded-full bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all"
            >
              <StopCircle className="mr-2 h-6 w-6" />
              Stop
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default TimerControls;
