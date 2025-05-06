"use client";

import React from "react";
import { Bell, BellOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTimeTracker } from "@/app/contexts/TimeTrackerContext";

const NotificationButton = () => {
  const { notificationsEnabled, requestNotificationPermission } =
    useTimeTracker();

  return (
    <div className="flex items-center">
      {notificationsEnabled ? (
        <Button
          variant="ghost"
          size="sm"
          className="text-green-600 gap-1.5 rounded-full hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-900/20"
        >
          <Bell className="h-4 w-4" />
          <span className="hidden sm:inline text-xs font-medium">
            Notifications enabled
          </span>
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={requestNotificationPermission}
          className="text-muted-foreground hover:text-foreground border-dashed rounded-full border-muted-foreground/30 gap-1.5 hover:border-primary hover:bg-primary/5"
        >
          <BellOff className="h-4 w-4" />
          <span className="hidden sm:inline text-xs font-medium">
            Enable notifications
          </span>
        </Button>
      )}
    </div>
  );
};

export default NotificationButton;
