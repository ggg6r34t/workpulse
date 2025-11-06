"use client";

import React, { lazy, Suspense, useState, useEffect } from "react";
import { Clock } from "lucide-react";

import { BentoGrid, BentoGridItem } from "@/components/BentoGrid";
import DailyTotalDisplay from "@/components/stats/DailyTotalDisplay";
import FocusMetrics from "@/components/FocusMetrics";
import { ProductivityTips } from "@/components/tips/ProductivityTips";
import QuickSettings from "@/components/QuickSettings";
import QuickTags from "@/components/QuickTags";
import TimerCard from "@/components/TimerCard";
import WaterReminder from "@/components/WaterReminder";
import ZapierIntegration from "@/components/ZapierIntegration";
import TimeEntriesTableSkeleton from "@/components/TimeEntriesTableSkeleton";
import TimeChart from "@/components/TimeChart";
import DashboardCustomization from "@/components/DashboardCustomization";

// Lazy load heavy components
const TimeEntriesTable = lazy(() => import("@/components/TimeEntriesTable"));

export default function Home() {
  const [visibleWidgets, setVisibleWidgets] = useState<Record<string, boolean>>(
    {
      dailyTotal: true,
      focusMetrics: true,
      zapier: true,
      quickSettings: true,
      quickTags: true,
      productivityTips: true,
      waterReminder: true,
      timeChart: true,
    }
  );

  // Load widget visibility from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("workpulse-widget-visibility");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setVisibleWidgets((prev) => ({ ...prev, ...parsed }));
        } catch {
          // Use defaults
        }
      }
    }
  }, []);

  const widgets = [
    { id: "dailyTotal", label: "Daily Total Display", defaultVisible: true },
    { id: "focusMetrics", label: "Focus Metrics", defaultVisible: true },
    { id: "zapier", label: "Zapier Integration", defaultVisible: true },
    { id: "quickSettings", label: "Quick Settings", defaultVisible: true },
    { id: "quickTags", label: "Quick Tags", defaultVisible: true },
    {
      id: "productivityTips",
      label: "Productivity Tips",
      defaultVisible: true,
    },
    { id: "waterReminder", label: "Water Reminder", defaultVisible: true },
    { id: "timeChart", label: "Time Chart", defaultVisible: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/10 flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <DashboardCustomization
              widgets={widgets}
              onWidgetsChange={(widgets) => {
                setVisibleWidgets(widgets);
                if (typeof window !== "undefined") {
                  localStorage.setItem(
                    "workpulse-widget-visibility",
                    JSON.stringify(widgets)
                  );
                }
              }}
            />
          </div>

          <TimerCard />
          <BentoGrid
            columns={{ mobile: 1, tablet: 2, desktop: 4 }}
            gap={{ mobile: 3, tablet: 4, desktop: 5 }}
            className="mb-8"
          >
            {/* Daily Total Display - Full width */}
            {visibleWidgets.dailyTotal && (
              <BentoGridItem
                size="full"
                className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-100 dark:border-blue-900/50"
              >
                <div className="flex items-center justify-between p-6">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-4" />
                    <div>
                      <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100">{`Today's Progress`}</h2>
                      <p className="text-blue-600/80 dark:text-blue-300/80">
                        Track your daily accomplishments
                      </p>
                    </div>
                  </div>
                  <DailyTotalDisplay />
                </div>
              </BentoGridItem>
            )}

            {/* Focus Metrics - Medium size */}
            {visibleWidgets.focusMetrics && (
              <BentoGridItem
                size="medium"
                className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/40 dark:to-emerald-950/40 border border-teal-100 dark:border-teal-900/50 p-0"
              >
                <FocusMetrics />
              </BentoGridItem>
            )}

            {/* Zapier Integration - Small size */}
            {visibleWidgets.zapier && (
              <BentoGridItem
                size="small"
                className="bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-950/40 dark:to-cyan-950/40 border border-sky-100 dark:border-sky-900/50 p-0"
              >
                <ZapierIntegration />
              </BentoGridItem>
            )}

            {/* Quick Settings - Small size */}
            {visibleWidgets.quickSettings && (
              <BentoGridItem
                size="small"
                className="bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-950/40 dark:to-fuchsia-950/40 border border-purple-100 dark:border-purple-900/50 p-0"
              >
                <QuickSettings />
              </BentoGridItem>
            )}

            {/* Quick Tags - Small size */}
            {visibleWidgets.quickTags && (
              <BentoGridItem
                size="medium"
                className="bg-gradient-to-br from-stone-50 to-gray-50 dark:from-stone-900/40 dark:to-gray-900/40 border border-stone-200 dark:border-stone-800/50 p-6"
              >
                <div className="h-full">
                  <QuickTags />
                </div>
              </BentoGridItem>
            )}

            {/* Productivity Tips - Medium size */}
            {visibleWidgets.productivityTips && (
              <BentoGridItem
                size="medium"
                className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/40 dark:to-amber-950/40 border border-yellow-100 dark:border-yellow-900/50 p-6 "
              >
                <ProductivityTips variant="compact" defaultOpen={true} />
              </BentoGridItem>
            )}

            {/* Time Chart - Full size */}
            {visibleWidgets.timeChart && (
              <BentoGridItem
                size="full"
                className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-100 dark:border-indigo-900/50 p-0"
              >
                <TimeChart variant="daily" />
              </BentoGridItem>
            )}

            {/* WaterReminder - Full size */}
            {visibleWidgets.waterReminder && (
              <BentoGridItem
                size="full"
                className="bg-gradient-to-br from-blue-50 to-white-50 dark:from-blue-950/40 dark:to-gray-950/40 border border-blue-100 dark:border-blue-900/50"
              >
                <WaterReminder />
              </BentoGridItem>
            )}
          </BentoGrid>

          <Suspense fallback={<TimeEntriesTableSkeleton />}>
            <TimeEntriesTable />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
