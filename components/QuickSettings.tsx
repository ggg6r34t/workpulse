"use client";

import React from "react";
import { Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useTimeTracker } from "@/app/contexts/TimeTrackerContext";

const QuickSettings = () => {
  const { settings, updateSettings } = useTimeTracker();

  // Optional: Guard rendering until settings are available
  if (!settings) return null;

  const toggleSetting = (key: keyof typeof settings) => {
    const currentValue = settings[key];
    if (typeof currentValue === "boolean") {
      updateSettings({ [key]: !currentValue });
    }
  };

  const options: {
    label: string;
    key: keyof typeof settings;
  }[] = [
    { label: "Notifications", key: "notificationsEnabled" },
    { label: "Auto-pause after 25m", key: "autoPauseEnabled" },
    { label: "Daily reminders", key: "dailyReminders" },
    { label: "Show seconds", key: "showSeconds" },
  ];

  return (
    <Card className="bg-transparent border-none h-full">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-medium">
          <Settings className="w-5 h-5 mr-2 text-primary" />
          Quick Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {options.map(({ label, key }) => (
            <div
              key={key}
              className="flex justify-between items-center text-sm"
            >
              <p>{label}</p>
              <Switch
                checked={!!settings[key]}
                onCheckedChange={() => toggleSetting(key)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickSettings;
