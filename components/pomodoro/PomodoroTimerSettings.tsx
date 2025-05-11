import React from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
  workDuration: number;
  breakDuration: number;
  onWorkDurationChange: (value: number) => void;
  onBreakDurationChange: (value: number) => void;
  testSound: () => void;
}

export const PomodoroTimerSettings = ({
  workDuration,
  breakDuration,
  onWorkDurationChange,
  onBreakDurationChange,
  testSound,
}: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="ml-2 p-1 h-7 w-7">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pomodoro Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">
                Work Duration: {workDuration} minutes
              </label>
            </div>
            <Slider
              min={5}
              max={60}
              step={5}
              value={[workDuration]}
              onValueChange={(value) => onWorkDurationChange(value[0])}
              className="py-4"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">
                Break Duration: {breakDuration} minutes
              </label>
            </div>
            <Slider
              min={1}
              max={30}
              step={1}
              value={[breakDuration]}
              onValueChange={(value) => onBreakDurationChange(value[0])}
              className="py-4"
            />
          </div>
          <Button onClick={testSound} variant="outline" className="w-full">
            Test Notification Sound
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
