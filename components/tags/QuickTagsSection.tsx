"use client";

import React from "react";

import { Card, CardContent } from "@/components/ui/card";
import QuickTags from "@/components/QuickTags";
import { toast } from "@/app/hooks/useToast";
import { useTimeTracker } from "@/app/contexts/TimeTrackerContext";

const QuickTagsSection = () => {
  const { startTimer } = useTimeTracker();

  // Reference to the TimerCard component to focus on it
  const timerCardRef = React.useRef<HTMLDivElement>(null);

  const handleTagSelect = (
    tag: string,
    action: "start" | "filter" = "start"
  ) => {
    if (action === "start") {
      // Start a new timer with this tag
      startTimer("Quick Start", tag, "", [tag]);

      // Show toast notification
      toast({
        title: "Timer started with tag",
        description: `Started tracking time for "${tag}"`,
      });

      // Scroll to the timer card to make it visible
      setTimeout(() => {
        timerCardRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  };

  return (
    <div className="animate-in">
      <Card className="p-6 border-none shadow-none">
        <CardContent className="p-0">
          <QuickTags onSelectTag={handleTagSelect} />
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickTagsSection;
