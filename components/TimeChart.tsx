"use client";

import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, TrendingUp, Calendar, Clock } from "lucide-react";
import { useTimeTracker } from "@/app/contexts/TimeTrackerContext";
import { calculateDuration, formatDuration } from "@/lib/time";
import { cn } from "@/lib/utils";

interface TimeChartProps {
  variant?: "daily" | "weekly" | "monthly";
  className?: string;
}

const TimeChart: React.FC<TimeChartProps> = ({
  variant = "daily",
  className,
}) => {
  const { timeEntries, settings } = useTimeTracker();

  const chartData = useMemo(() => {
    const now = new Date();
    const data: Array<{ label: string; value: number; entries: number }> = [];

    if (variant === "daily") {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);

        const dayEntries = timeEntries.filter((entry) => {
          const entryDate = new Date(entry.startTime);
          entryDate.setHours(0, 0, 0, 0);
          return entryDate.getTime() === date.getTime() && entry.endTime;
        });

        const totalTime = dayEntries.reduce((total, entry) => {
          if (!entry.endTime) return total;
          return (
            total +
            calculateDuration({
              startTime: entry.startTime,
              endTime: entry.endTime,
              pausedTime: entry.pausedTime || 0,
            })
          );
        }, 0);

        data.push({
          label: date.toLocaleDateString("en-US", { weekday: "short" }),
          value: totalTime,
          entries: dayEntries.length,
        });
      }
    } else if (variant === "weekly") {
      // Last 4 weeks
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() - i * 7);
        weekStart.setHours(0, 0, 0, 0);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);

        const weekEntries = timeEntries.filter((entry) => {
          const entryDate = new Date(entry.startTime);
          return (
            entryDate >= weekStart && entryDate <= weekEnd && entry.endTime
          );
        });

        const totalTime = weekEntries.reduce((total, entry) => {
          if (!entry.endTime) return total;
          return (
            total +
            calculateDuration({
              startTime: entry.startTime,
              endTime: entry.endTime,
              pausedTime: entry.pausedTime || 0,
            })
          );
        }, 0);

        data.push({
          label: `Week ${i + 1}`,
          value: totalTime,
          entries: weekEntries.length,
        });
      }
    } else {
      // Last 6 months
      for (let i = 5; i >= 0; i--) {
        const month = new Date(now);
        month.setMonth(month.getMonth() - i);
        month.setDate(1);
        month.setHours(0, 0, 0, 0);

        const nextMonth = new Date(month);
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        const monthEntries = timeEntries.filter((entry) => {
          const entryDate = new Date(entry.startTime);
          return entryDate >= month && entryDate < nextMonth && entry.endTime;
        });

        const totalTime = monthEntries.reduce((total, entry) => {
          if (!entry.endTime) return total;
          return (
            total +
            calculateDuration({
              startTime: entry.startTime,
              endTime: entry.endTime,
              pausedTime: entry.pausedTime || 0,
            })
          );
        }, 0);

        data.push({
          label: month.toLocaleDateString("en-US", { month: "short" }),
          value: totalTime,
          entries: monthEntries.length,
        });
      }
    }

    return data;
  }, [timeEntries, variant]);

  const maxValue = useMemo(() => {
    return Math.max(...chartData.map((d) => d.value), 1);
  }, [chartData]);

  const totalTime = useMemo(() => {
    return chartData.reduce((sum, d) => sum + d.value, 0);
  }, [chartData]);

  const averageTime = useMemo(() => {
    const nonZeroDays = chartData.filter((d) => d.value > 0);
    return nonZeroDays.length > 0
      ? nonZeroDays.reduce((sum, d) => sum + d.value, 0) / nonZeroDays.length
      : 0;
  }, [chartData]);

  return (
    <Card className={cn("bg-transparent border-none h-full", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg font-medium">
          <BarChart3 className="w-5 h-5 mr-2 text-primary" />
          Time Tracking{" "}
          {variant === "daily"
            ? "Daily"
            : variant === "weekly"
            ? "Weekly"
            : "Monthly"}{" "}
          Chart
        </CardTitle>
        <CardDescription>Visualize your time tracking patterns</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>Total</span>
            </div>
            <p className="text-sm font-medium">
              {formatDuration(totalTime, settings)}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Average</span>
            </div>
            <p className="text-sm font-medium">
              {formatDuration(averageTime, settings)}
            </p>
          </div>
        </div>

        {/* Chart Bars */}
        <div className="space-y-2">
          {chartData.map((item, index) => {
            const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
            return (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">
                    {item.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">
                      {formatDuration(item.value, settings)}
                    </span>
                    <span className="text-muted-foreground/70">
                      ({item.entries} {item.entries === 1 ? "entry" : "entries"}
                      )
                    </span>
                  </div>
                </div>
                <div className="relative h-6 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2",
                      percentage > 0 && "min-w-[2px]"
                    )}
                    style={{ width: `${percentage}%` }}
                  >
                    {percentage > 10 && (
                      <span className="text-xs font-semibold text-primary-foreground">
                        {Math.round(percentage)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {chartData.every((d) => d.value === 0) && (
          <div className="text-center py-8 text-sm text-muted-foreground">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No time tracked in this period</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TimeChart;
