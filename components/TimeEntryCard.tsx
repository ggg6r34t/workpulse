"use client";

import React, { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  formatDate,
  formatTime,
  calculateDuration,
  formatDuration,
} from "@/lib/time";
import { TimeEntry } from "@/types/types";
import {
  Trash2,
  Edit2,
  FileText,
  Tag as TagIcon,
  Clock,
  Calendar,
  User,
  ChevronRight,
} from "lucide-react";
import { useTimeTracker } from "@/app/contexts/TimeTrackerContext";
import { cn } from "@/lib/utils";

interface TimeEntryCardProps {
  entry: TimeEntry;
  onDelete: (id: string) => void;
  onEdit?: (id: string) => void;
  onSwipeDelete?: (id: string) => void;
}

const TimeEntryCard: React.FC<TimeEntryCardProps> = ({
  entry,
  onDelete,
  onEdit,
  onSwipeDelete,
}) => {
  const { settings } = useTimeTracker();
  const [isExpanded, setIsExpanded] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const SWIPE_THRESHOLD = 100;

  const duration = entry.endTime
    ? calculateDuration({
        startTime: entry.startTime,
        endTime: entry.endTime,
        pausedTime: entry.pausedTime || 0,
      })
    : 0;

  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startXRef.current;
    
    // Only allow left swipe (negative diff)
    if (diff < 0) {
      setSwipeOffset(Math.max(diff, -SWIPE_THRESHOLD * 2));
    }
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    
    if (swipeOffset < -SWIPE_THRESHOLD) {
      // Swipe left enough to trigger delete
      if (onSwipeDelete) {
        onSwipeDelete(entry.id);
      } else {
        onDelete(entry.id);
      }
    }
    
    // Reset swipe
    setSwipeOffset(0);
  };

  return (
    <div className="relative overflow-hidden">
      <Card
        ref={cardRef}
        className={cn(
          "transition-transform duration-200 ease-out touch-none",
          entry.isActive && !entry.isPaused && "ring-2 ring-primary/20",
          entry.isActive && entry.isPaused && "ring-2 ring-yellow-500/20"
        )}
        style={{
          transform: `translateX(${swipeOffset}px)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{entry.task}</h3>
                  {entry.isActive && (
                    <Badge
                      variant={entry.isPaused ? "outline" : "default"}
                      className={cn(
                        "text-xs",
                        entry.isPaused
                          ? "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400"
                          : "bg-green-100 text-green-700 border-green-300 dark:bg-green-900/20 dark:text-green-400"
                      )}
                    >
                      {entry.isPaused ? "Paused" : "Active"}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  {entry.client}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(entry.id)}
                    className="h-8 w-8 min-h-[44px] min-w-[44px]"
                    aria-label="Edit entry"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(entry.id)}
                  className="h-8 w-8 min-h-[44px] min-w-[44px] text-destructive hover:text-destructive"
                  aria-label="Delete entry"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Time Info */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {formatDate(entry.startTime, {
                    dateFormat: settings.dateFormat,
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  {formatTime(entry.startTime, {
                    hour12: settings.hour12,
                    showSeconds: settings.showSeconds,
                  })}
                  {entry.endTime &&
                    ` - ${formatTime(entry.endTime, {
                      hour12: settings.hour12,
                      showSeconds: settings.showSeconds,
                    })}`}
                </span>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-semibold text-foreground">
                  {formatDuration(duration, settings)}
                </span>
              </div>
              {entry.pausedTime > 0 && (
                <span className="text-xs text-muted-foreground">
                  Paused: {formatDuration(entry.pausedTime, settings)}
                </span>
              )}
            </div>

            {/* Tags */}
            {entry.tags && entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {entry.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs flex items-center gap-1"
                  >
                    <TagIcon className="h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Description */}
            {entry.description && (
              <div className="pt-2 border-t">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-full flex items-center justify-between text-left"
                  aria-expanded={isExpanded}
                  aria-label={isExpanded ? "Collapse description" : "Expand description"}
                >
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>Description</span>
                  </div>
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform",
                      isExpanded && "rotate-90"
                    )}
                  />
                </button>
                {isExpanded && (
                  <p className="mt-2 text-sm text-foreground/80 pl-6">
                    {entry.description}
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeEntryCard;

