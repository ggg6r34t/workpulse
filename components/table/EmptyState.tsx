import React from "react";
import { Clock } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="text-center py-16 border rounded-xl bg-muted/10 flex flex-col items-center justify-center space-y-4">
      <div className="bg-primary/10 p-4 rounded-full">
        <Clock className="h-8 w-8 text-primary" />
      </div>
      <div>
        <p className="text-muted-foreground">No time entries yet.</p>
        <p className="text-sm text-muted-foreground/70 mt-1">
          Start tracking your time by clicking the timer button above!
        </p>
      </div>
    </div>
  );
};

export default EmptyState;
