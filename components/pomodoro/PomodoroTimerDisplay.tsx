import React from "react";
import { TimerMode } from "./PomodoroTimer";

interface Props {
  displayTime: string;
  progressPercent: number;
  mode: TimerMode;
}

export const PomodoroTimerDisplay = ({
  displayTime,
  progressPercent,
  mode,
}: Props) => {
  // Size configuration
  const size = 132;
  const strokeWidth = 10;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (progressPercent / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center gap-6">
      {/* Circular progress indicator */}
      <div className="relative w-64 h-64">
        {/* Background circle */}
        <svg className="w-full h-full" viewBox="0 0 264 264">
          <circle
            cx={size}
            cy={size}
            r={radius}
            strokeWidth={strokeWidth}
            className="stroke-gray-200 dark:stroke-gray-700"
            fill="none"
          />
        </svg>

        {/* Progress circle */}
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 264 264"
        >
          <circle
            cx={size}
            cy={size}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`transition-all duration-1000 ease-linear ${
              mode === "work" ? "stroke-primary" : "stroke-green-500"
            }`}
            fill="none"
            transform="rotate(-90 132 132)" // Starts progress from top
          />
        </svg>

        {/* Time display in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl font-mono font-bold text-center">
            {displayTime}
          </div>
        </div>
      </div>
    </div>
  );
};
