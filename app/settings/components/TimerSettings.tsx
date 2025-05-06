"use client";

import React from "react";
import { Clock, TimerReset, TimerOff } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "@/types/types";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

interface TimerSettingsProps {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

export function TimerSettings({
  settings,
  updateSettings,
}: TimerSettingsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Timer Behavior
          </CardTitle>
          <CardDescription>
            Configure how the timer works in WorkPulse
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="idle-timeout">
                <div className="flex flex-col gap-1">
                  <span>Idle reminder timeout</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    Minutes of inactivity before showing a reminder
                  </span>
                </div>
              </Label>
              <div className="w-20">
                <Input
                  id="idle-timeout"
                  type="number"
                  min={1}
                  max={120}
                  value={settings.idleTimeout}
                  onChange={(e) => {
                    const value = Math.min(
                      120,
                      Math.max(1, Number(e.target.value))
                    );
                    updateSettings({ idleTimeout: value });
                  }}
                  className="text-right"
                />
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <Label htmlFor="round-time">
                <div className="flex flex-col gap-1">
                  <span>Round time entries</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    Round time entries to the nearest 15 minutes
                  </span>
                </div>
              </Label>
              <Switch
                id="round-time"
                checked={settings.roundTimeEntries}
                onCheckedChange={(checked) =>
                  updateSettings({ roundTimeEntries: checked })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-continue">
                <div className="flex flex-col gap-1">
                  <span>Auto-continue timer</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    Automatically continue timer after idle reminder
                  </span>
                </div>
              </Label>
              <Switch
                id="auto-continue"
                checked={settings.autoContinue}
                onCheckedChange={(checked) =>
                  updateSettings({ autoContinue: checked })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <TimerReset className="h-5 w-5 text-primary" />
            Default Timer Values
          </CardTitle>
          <CardDescription>
            Set default values for new time entries
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="default-client">Default Client</Label>
              <Input
                id="default-client"
                placeholder="No Client"
                value={settings.defaultClient || ""}
                onChange={(e) =>
                  updateSettings({ defaultClient: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default-task">Default Task</Label>
              <Input
                id="default-task"
                placeholder="No Task"
                value={settings.defaultTask || ""}
                onChange={(e) =>
                  updateSettings({ defaultTask: e.target.value })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <TimerOff className="h-5 w-5 text-primary" />
            Auto-Stop Timer
          </CardTitle>
          <CardDescription>
            Configure when to automatically stop the timer
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-stop">
                <div className="flex flex-col gap-1">
                  <span>Auto-stop after inactivity</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    Automatically stop timer after extended inactivity
                  </span>
                </div>
              </Label>
              <Switch
                id="auto-stop"
                checked={settings.autoStop}
                onCheckedChange={(checked) =>
                  updateSettings({ autoStop: checked })
                }
              />
            </div>

            {settings.autoStop && (
              <div className="flex items-center justify-between pl-6">
                <Label
                  htmlFor="auto-stop-minutes"
                  className="flex flex-col gap-1"
                >
                  <span>Minutes of inactivity</span>
                </Label>
                <div className="w-20">
                  <Input
                    id="auto-stop-minutes"
                    type="number"
                    min={5}
                    max={240}
                    value={settings.autoStopMinutes || 60}
                    onChange={(e) =>
                      updateSettings({
                        autoStopMinutes: Number.parseInt(e.target.value),
                      })
                    }
                    className="text-right"
                  />
                </div>
              </div>
            )}

            <Separator />

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-stop-time">
                <div className="flex flex-col gap-1">
                  <span>Auto-stop at specific time</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    Automatically stop timer at a specific time each day
                  </span>
                </div>
              </Label>
              <Switch
                id="auto-stop-time"
                checked={settings.autoStopAt !== null}
                onCheckedChange={(checked) =>
                  updateSettings({ autoStopAt: checked ? "18:00" : null })
                }
              />
            </div>

            {settings.autoStopAt !== null && (
              <div className="flex items-center justify-between pl-6">
                <Label htmlFor="auto-stop-at" className="flex flex-col gap-1">
                  <span>Stop time</span>
                </Label>
                <div className="w-24">
                  <Input
                    id="auto-stop-at"
                    type="time"
                    value={settings.autoStopAt}
                    onChange={(e) =>
                      updateSettings({ autoStopAt: e.target.value })
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
