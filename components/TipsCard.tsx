"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Tip {
  id: string;
  content: string;
  category?: string;
}

interface TipsCardProps {
  tips?: Tip[];
  title?: string;
  defaultOpen?: boolean;
  variant?: "default" | "compact";
  className?: string;
}

const DEFAULT_TIPS: Tip[] = [
  {
    id: "1",
    content:
      "Use the Pomodoro technique: 25 minutes of focused work, followed by a 5-minute break.",
    category: "Technique",
  },
  {
    id: "2",
    content: "Set clear goals for each time entry to stay focused on the task.",
    category: "Planning",
  },
  {
    id: "3",
    content:
      "Add detailed descriptions to your time entries for better reporting.",
    category: "Documentation",
  },
  {
    id: "4",
    content: "Use tags to categorize and filter your work sessions.",
    category: "Organization",
  },
  {
    id: "5",
    content: "Remember to pause the timer when you're taking breaks.",
    category: "Habit",
  },
];

export const TipsCard = ({
  tips = DEFAULT_TIPS,
  title = "Productivity Tips",
  defaultOpen = false,
  variant = "default",
  className = "",
}: TipsCardProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={`rounded-xl border bg-gradient-to-br from-card/80 to-card/60 shadow-sm backdrop-blur-sm transition-all hover:shadow-md ${className}`}
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className={`w-full justify-between hover:bg-transparent ${
            variant === "compact" ? "p-3" : "p-4"
          }`}
        >
          <div className="flex items-center gap-3">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <span className="font-medium text-foreground">{title}</span>
            <Badge variant="outline" className="ml-2">
              {tips.length} tips
            </Badge>
          </div>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 opacity-70" />
          ) : (
            <ChevronDown className="h-4 w-4 opacity-70" />
          )}
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="overflow-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down mt-4">
        <div className={`${variant === "compact" ? "p-3 pt-0" : "p-4 pt-0"}`}>
          <ul className="space-y-3">
            {tips.map((tip) => (
              <li key={tip.id} className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary/50" />
                <div>
                  <p className="text-sm text-foreground/90">{tip.content}</p>
                  {tip.category && variant !== "compact" && (
                    <Badge variant="secondary" className="mt-1">
                      {tip.category}
                    </Badge>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
