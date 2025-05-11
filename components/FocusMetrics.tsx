"use client";

import { useMemo } from "react";
import { Brain, Clock, TrendingUp, ArrowRight, Calendar } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDuration } from "@/lib/time";
import { Progress } from "@/components/ui/progress";
import { useTimeTracker } from "@/app/contexts/TimeTrackerContext";

const FocusMetrics = () => {
  const { timeEntries } = useTimeTracker();

  // Calculate focus metrics based on time entries
  const metrics = useMemo(() => {
    // Filter to only completed entries from today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayEntries = timeEntries.filter((entry) => {
      const entryDate = new Date(entry.startTime);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime() && entry.endTime;
    });

    // Calculate total tracked time today
    const totalTrackedMs = todayEntries.reduce((total, entry) => {
      const duration = entry.endTime
        ? entry.endTime.getTime() -
          entry.startTime.getTime() -
          (entry.pausedTime || 0)
        : 0;
      return total + duration;
    }, 0);

    // Calculate average session length
    const avgSessionMs =
      todayEntries.length > 0 ? totalTrackedMs / todayEntries.length : 0;

    // Calculate focus score (longer sessions = better focus)
    // Score is 0-100 based on average session length (30mins or more = 100)
    const focusScore = Math.min(
      100,
      Math.round((avgSessionMs / (30 * 60 * 1000)) * 100)
    );

    // Calculate longest focus session
    const longestSession = todayEntries.reduce((longest, entry) => {
      const duration = entry.endTime
        ? entry.endTime.getTime() -
          entry.startTime.getTime() -
          (entry.pausedTime || 0)
        : 0;
      return duration > longest ? duration : longest;
    }, 0);

    // Count sessions with minimal interruptions (less than 5 minutes of paused time)
    const uninterruptedSessions = todayEntries.filter(
      (entry) => (entry.pausedTime || 0) < 5 * 60 * 1000
    ).length;

    // Calculate uninterrupted percentage
    const uninterruptedPercentage =
      todayEntries.length > 0
        ? Math.round((uninterruptedSessions / todayEntries.length) * 100)
        : 0;

    return {
      focusScore,
      totalTrackedMs,
      avgSessionMs,
      longestSession,
      sessionsCount: todayEntries.length,
      uninterruptedPercentage,
    };
  }, [timeEntries]);

  // Generate advice based on metrics
  const getFocusAdvice = () => {
    if (metrics.focusScore >= 80)
      return "Great focus! You're working in productive deep work sessions.";
    if (metrics.focusScore >= 50)
      return "Good rhythm. Try extending your focus sessions slightly longer.";
    return "Consider using the Pomodoro technique to improve your focus sessions.";
  };

  return (
    <Card className="bg-transparent border-none h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg font-medium">
          <Brain className="w-5 h-5 mr-2 text-primary" />
          Focus Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Focus Score */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-muted-foreground">
              Focus Score
            </h4>
            <span className="text-2xl font-bold">{metrics.focusScore}</span>
          </div>
          <Progress value={metrics.focusScore} className="h-2" />
          <p className="text-xs text-muted-foreground">{getFocusAdvice()}</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>Avg Session</span>
            </div>
            <p className="text-sm font-medium">
              {formatDuration(metrics.avgSessionMs)}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Longest Focus</span>
            </div>
            <p className="text-sm font-medium">
              {formatDuration(metrics.longestSession)}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>Sessions Today</span>
            </div>
            <p className="text-sm font-medium">{metrics.sessionsCount}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowRight className="h-3.5 w-3.5" />
              <span>Uninterrupted</span>
            </div>
            <p className="text-sm font-medium">
              {metrics.uninterruptedPercentage}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FocusMetrics;
