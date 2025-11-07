"use client";

import React from "react";
import { Play, Pause, StopCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatDuration } from "@/lib/time";
import KeyboardShortcuts from "./KeyboardShortcuts";
import { useTimeTracker } from "@/app/contexts/TimeTrackerContext";
import { useKeyboardShortcuts } from "@/app/hooks/useKeyboardShortcuts";

const TimerControls = () => {
  const {
    activeEntry,
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer,
    elapsedTime,
    settings,
  } = useTimeTracker();

  const defaultClient = settings?.defaultClient || "No Client";
  const defaultTask = settings?.defaultTask || "No Task";

  const formattedTime = formatDuration(elapsedTime);
  const isActive = !!activeEntry;
  const isPaused = activeEntry?.isPaused || false;

  // Defined keyboard shortcuts
  const shortcuts = {
    space: {
      action: () => {
        if (!isActive) {
          startTimer(defaultClient, defaultTask);
        } else {
          stopTimer();
        }
      },
      description: "Start/Stop timer",
    },
    p: {
      action: () => isActive && (isPaused ? resumeTimer() : pauseTimer()),
      description: isPaused ? "Resume timer" : "Pause timer",
    },
    escape: {
      action: () => isActive && stopTimer(),
      description: "Stop timer",
    },
  };

  // Keyboard shortcuts hook
  const { recentShortcut } = useKeyboardShortcuts(shortcuts);

  // Helper function to determine timer color
  const getTimerColor = () => {
    if (isActive && !isPaused) return "text-primary animate-pulse";
    if (isPaused) return "text-yellow-500";
    return "text-foreground";
  };

  // Hover animation effect
  const getButtonHoverClass = (baseClass: string) => {
    return `${baseClass} transition-transform duration-300 hover:scale-105 active:scale-95`;
  };

  const timerFlash = recentShortcut
    ? "animate-flash ring-2 ring-primary/30"
    : "";

  return (
    <div className="flex flex-col items-center space-y-8">
      <div
        className={`
    font-mono font-bold tracking-wider transition-all drop-shadow-sm rounded-xl
    text-5xl sm:text-6xl md:text-7xl lg:text-8xl
    py-2 px-4 sm:py-3 sm:px-6 md:py-4 md:px-8
    ${getTimerColor()} 
    ${timerFlash}
    min-w-[240px] sm:min-w-[300px] md:min-w-[360px] 
    text-center 
  `}
      >
        {formattedTime}
      </div>

      <div className="flex flex-wrap justify-center gap-5">
        {!isActive ? (
          <div className="flex flex-col items-center">
            <Button
              onClick={() => startTimer(defaultClient, defaultTask)}
              size="lg"
              className={getButtonHoverClass(
                "bg-primary hover:bg-primary/90 flex items-center px-12 py-7 rounded-full shadow-lg shadow-primary/20 min-h-[44px]"
              )}
              aria-label="Start timer"
            >
              <Play className="mr-2 h-6 w-6" />
              Start Timer
            </Button>

            {!isActive && (defaultClient || defaultTask) && (
              <div className="text-sm text-muted-foreground mt-6 animate-in fade-in duration-300">
                Default: {defaultClient} • {defaultTask}
              </div>
            )}
          </div>
        ) : (
          <>
            {isPaused ? (
              <Button
                onClick={resumeTimer}
                variant="outline"
                size="lg"
                className={getButtonHoverClass(
                  "flex items-center px-10 py-6 rounded-full bg-green-50 border-green-200 text-green-600 hover:bg-green-100 hover:text-green-700 shadow-sm min-h-[44px]"
                )}
                aria-label="Resume timer"
              >
                <Play className="mr-2 h-6 w-6" />
                Resume
              </Button>
            ) : (
              <Button
                onClick={pauseTimer}
                variant="outline"
                size="lg"
                className={getButtonHoverClass(
                  "flex items-center px-10 py-6 rounded-full bg-yellow-50 border-yellow-200 text-yellow-600 hover:bg-yellow-100 hover:text-yellow-700 shadow-sm min-h-[44px]"
                )}
                aria-label="Pause timer"
              >
                <Pause className="mr-2 h-6 w-6" />
                Pause
              </Button>
            )}

            <Button
              onClick={stopTimer}
              variant="outline"
              size="lg"
              className={getButtonHoverClass(
                "flex items-center px-10 py-6 rounded-full bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:text-red-700 shadow-sm min-h-[44px]"
              )}
              aria-label="Stop timer"
            >
              <StopCircle className="mr-2 h-6 w-6" />
              Stop
            </Button>
          </>
        )}
      </div>

      {/* Keyboard shortcuts */}
      <KeyboardShortcuts shortcuts={shortcuts} />
    </div>
  );
};

export default TimerControls;
