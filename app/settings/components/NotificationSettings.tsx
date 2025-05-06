"use client";

import { useState, useEffect } from "react";
import { Bell, BellRing, BellOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Settings } from "@/types/types";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useTimeTracker } from "@/app/contexts/TimeTrackerContext";

interface NotificationSettingsProps {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

export function NotificationSettings({
  settings,
  updateSettings,
}: NotificationSettingsProps) {
  const { notificationsEnabled, requestNotificationPermission } =
    useTimeTracker();
  const [localNotificationsEnabled, setLocalNotificationsEnabled] = useState(
    notificationsEnabled ||
      (typeof Notification !== "undefined" &&
        Notification.permission === "granted")
  );

  useEffect(() => {
    setLocalNotificationsEnabled(notificationsEnabled);
  }, [notificationsEnabled]);

  const handleRequestPermission = () => {
    requestNotificationPermission();
    if (typeof Notification !== "undefined" && Notification.requestPermission) {
      Notification.requestPermission().then((permission) => {
        const granted = permission === "granted";
        setLocalNotificationsEnabled(granted);
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notification Permissions
          </CardTitle>
          <CardDescription>
            Enable browser notifications to get reminders and alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!localNotificationsEnabled ? (
            <div className="flex flex-col items-center justify-center p-6 bg-muted/20 rounded-lg border border-dashed">
              <BellOff className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Enable Notifications</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                {`Allow WorkPulse to send you reminders when you're idle or when timers complete.`}
              </p>
              <Button onClick={handleRequestPermission}>
                Enable Browser Notifications
              </Button>
            </div>
          ) : (
            <div className="bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 p-4 rounded-lg flex items-center gap-2">
              <BellRing className="h-5 w-5" />
              <span>Notifications are enabled for WorkPulse</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <BellRing className="h-5 w-5 text-primary" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Choose which notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="idle-reminders">
                <div className="flex flex-col gap-1">
                  <span>Idle reminders</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    {`Get reminded when you're not tracking time`}
                  </span>
                </div>
              </Label>
              <Switch
                id="idle-reminders"
                checked={settings.idleReminders !== false}
                onCheckedChange={(checked) =>
                  updateSettings({ idleReminders: checked })
                }
                disabled={!localNotificationsEnabled}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <Label htmlFor="timer-alerts">
                <div className="flex flex-col gap-1">
                  <span>Timer alerts</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    Get notified when timers are paused or stopped
                  </span>
                </div>
              </Label>
              <Switch
                id="timer-alerts"
                checked={settings.timerAlerts !== false}
                onCheckedChange={(checked) =>
                  updateSettings({ timerAlerts: checked })
                }
                disabled={!localNotificationsEnabled}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <Label htmlFor="daily-summary">
                <div className="flex flex-col gap-1">
                  <span>Daily summary</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    Receive a summary of your tracked time at the end of each
                    day
                  </span>
                </div>
              </Label>
              <Switch
                id="daily-summary"
                checked={settings.dailySummary === true}
                onCheckedChange={(checked) =>
                  updateSettings({ dailySummary: checked })
                }
                disabled={!localNotificationsEnabled}
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Label>Notification Sound</Label>
            <RadioGroup
              value={settings.notificationSound || "default"}
              onValueChange={(value) =>
                updateSettings({
                  notificationSound: value as "default" | "none" | "subtle",
                })
              }
              disabled={!localNotificationsEnabled}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="default" id="default" />
                <Label htmlFor="default">Default</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="subtle" id="subtle" />
                <Label htmlFor="subtle">Subtle</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="none" />
                <Label htmlFor="none">None</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
