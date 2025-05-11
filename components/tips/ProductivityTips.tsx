"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Lightbulb } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { DEFAULT_TIPS } from "@/app/contents/productivityTips";
import { ProductivityTip } from "@/types/types";

interface Props {
  tips?: ProductivityTip[];
  title?: string;
  defaultOpen?: boolean;
  variant?: "default" | "compact";
  className?: string;
}

export const ProductivityTips = ({
  tips = DEFAULT_TIPS,
  title = "Productivity Tips",
  defaultOpen = false,
  variant = "default",
  className = "",
}: Props) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={`${className}`}
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
