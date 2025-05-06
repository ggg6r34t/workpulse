import React from "react";

import TimeEntriesTable from "@/components/TimeEntriesTable";
import TimerCard from "@/components/TimerCard";
import { TipsCard } from "@/components/TipsCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/10 flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-10">
          <TimerCard />
          <TipsCard variant="compact" />
          <TimeEntriesTable />
        </div>
      </div>
    </div>
  );
}
