"use client";

import React from "react";
import { Clock, Play, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTimeTracker } from "@/app/contexts/TimeTrackerContext";

const EmptyState = () => {
  const { startTimer, settings } = useTimeTracker();
  const defaultClient = settings?.defaultClient || "";
  const defaultTask = settings?.defaultTask || "";

  const handleStartTimer = () => {
    if (defaultClient && defaultTask) {
      startTimer(defaultClient, defaultTask);
    } else {
      // Scroll to timer card
      const timerCard = document.getElementById("timer-card");
      if (timerCard) {
        timerCard.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  return (
    <div className="text-center py-16 border rounded-xl bg-gradient-to-br from-muted/20 to-muted/5 flex flex-col items-center justify-center space-y-6 px-4">
      <div className="relative">
        <div className="bg-primary/10 p-6 rounded-full animate-pulse">
          <Clock className="h-12 w-12 text-primary" />
        </div>
        <div className="absolute -top-2 -right-2 bg-primary/20 p-2 rounded-full">
          <ArrowUp className="h-4 w-4 text-primary animate-bounce" />
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">
          No time entries yet
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Start tracking your time to see your productivity insights and build better work habits.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          onClick={handleStartTimer}
          size="lg"
          className="min-h-[44px] min-w-[120px]"
          aria-label="Start your first timer"
        >
          <Play className="mr-2 h-4 w-4" />
          Start First Timer
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            const timerCard = document.getElementById("timer-card");
            if (timerCard) {
              timerCard.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }}
          className="min-h-[44px]"
        >
          Go to Timer
        </Button>
      </div>

      <div className="pt-4 text-xs text-muted-foreground/70">
        <p>💡 Tip: Set default client and task in settings for faster tracking</p>
      </div>
    </div>
  );
};

export default EmptyState;
