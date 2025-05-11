import React from "react";
import { Clock } from "lucide-react";

import { BentoGrid, BentoGridItem } from "@/components/BentoGrid";
import DailyTotalDisplay from "@/components/stats/DailyTotalDisplay";
import FocusMetrics from "@/components/FocusMetrics";
import { ProductivityTips } from "@/components/tips/ProductivityTips";
import QuickSettings from "@/components/QuickSettings";
import QuickTags from "@/components/QuickTags";
import TimeEntriesTable from "@/components/TimeEntriesTable";
import TimerCard from "@/components/TimerCard";
import WaterReminder from "@/components/WaterReminder";
import ZapierIntegration from "@/components/ZapierIntegration";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/10 flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-10">
          <TimerCard />
          <BentoGrid
            columns={{ mobile: 1, tablet: 2, desktop: 4 }}
            gap={{ mobile: 3, tablet: 4, desktop: 5 }}
            className="mb-8"
          >
            {/* Daily Total Display - Full width */}
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

            {/* Focus Metrics - Medium size */}
            <BentoGridItem
              size="medium"
              className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/40 dark:to-emerald-950/40 border border-teal-100 dark:border-teal-900/50 p-0"
            >
              <FocusMetrics />
            </BentoGridItem>

            {/* Zapier Integration - Small size */}
            <BentoGridItem
              size="small"
              className="bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-950/40 dark:to-cyan-950/40 border border-sky-100 dark:border-sky-900/50 p-0"
            >
              <ZapierIntegration />
            </BentoGridItem>

            {/* Quick Settings - Small size */}
            <BentoGridItem
              size="small"
              className="bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-950/40 dark:to-fuchsia-950/40 border border-purple-100 dark:border-purple-900/50 p-0"
            >
              <QuickSettings />
            </BentoGridItem>

            {/* Quick Tags - Small size */}
            <BentoGridItem
              size="medium"
              className="bg-gradient-to-br from-stone-50 to-gray-50 dark:from-stone-900/40 dark:to-gray-900/40 border border-stone-200 dark:border-stone-800/50 p-6"
            >
              <div className="h-full">
                <QuickTags />
              </div>
            </BentoGridItem>

            {/* Productivity Tips - Medium size */}
            <BentoGridItem
              size="medium"
              className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/40 dark:to-amber-950/40 border border-yellow-100 dark:border-yellow-900/50 p-6 "
            >
              <ProductivityTips variant="compact" defaultOpen={true} />
            </BentoGridItem>

            {/* WaterReminder - Full size */}
            <BentoGridItem
              size="full"
              className="bg-gradient-to-br from-blue-50 to-white-50 dark:from-blue-950/40 dark:to-gray-950/40 border border-blue-100 dark:border-blue-900/50"
            >
              <WaterReminder />
            </BentoGridItem>
          </BentoGrid>

          <TimeEntriesTable />
        </div>
      </div>
    </div>
  );
}
