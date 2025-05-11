import React from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  isActive: boolean;
  isPaused: boolean;
  soundEnabled: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onToggleSound: () => void;
}

export const PomodoroTimerControls = ({
  isActive,
  isPaused,
  soundEnabled,
  onStart,
  onPause,
  onResume,
  onReset,
  onToggleSound,
}: Props) => {
  return (
    <div className="mt-4 flex space-x-2">
      {!isActive ? (
        <Button onClick={onStart} className="px-8">
          <Play className="mr-2 h-4 w-4" />
          Start
        </Button>
      ) : isPaused ? (
        <Button
          onClick={onResume}
          variant="outline"
          className="border-green-200 text-green-700 hover:bg-green-50"
        >
          <Play className="mr-2 h-4 w-4" />
          Resume
        </Button>
      ) : (
        <Button
          onClick={onPause}
          variant="outline"
          className="border-amber-200 text-amber-700 hover:bg-amber-50"
        >
          <Pause className="mr-2 h-4 w-4" />
          Pause
        </Button>
      )}

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" onClick={onReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reset timer</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" onClick={onToggleSound}>
              {soundEnabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{soundEnabled ? "Disable sound" : "Enable sound"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
