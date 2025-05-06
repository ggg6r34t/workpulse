"use client";

import React, { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export function GeneralSettings() {
  const [autoStartBreaks, setAutoStartBreaks] = useState(false);
  const [roundTimes, setRoundTimes] = useState(false);
  const [timeFormat, setTimeFormat] = useState("12h");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [weekStart, setWeekStart] = useState("monday");
  const [idleTimeout, setIdleTimeout] = useState("30");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Time Tracking Preferences</CardTitle>
          <CardDescription>
            Configure how time tracking works in WorkPulse
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-breaks" className="flex flex-col gap-1">
                <span>Auto-start breaks</span>
                <span className="font-normal text-xs text-muted-foreground">
                  Automatically start a break when you stop a timer
                </span>
              </Label>
              <Switch
                id="auto-breaks"
                checked={autoStartBreaks}
                onCheckedChange={setAutoStartBreaks}
              />
            </div>
            <Separator className="my-4" />
            <div className="flex items-center justify-between">
              <Label htmlFor="round-times" className="flex flex-col gap-1">
                <span>Round time entries</span>
                <span className="font-normal text-xs text-muted-foreground">
                  Round time entries to the nearest 15 minutes
                </span>
              </Label>
              <Switch
                id="round-times"
                checked={roundTimes}
                onCheckedChange={setRoundTimes}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Display Preferences</CardTitle>
          <CardDescription>
            Customize how dates and times are displayed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="time-format">Time Format</Label>
              <Select value={timeFormat} onValueChange={setTimeFormat}>
                <SelectTrigger id="time-format">
                  <SelectValue placeholder="Select time format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12h">12-hour (1:30 PM)</SelectItem>
                  <SelectItem value="24h">24-hour (13:30)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-format">Date Format</Label>
              <Select value={dateFormat} onValueChange={setDateFormat}>
                <SelectTrigger id="date-format">
                  <SelectValue placeholder="Select date format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="week-start">Week Starts On</Label>
              <Select value={weekStart} onValueChange={setWeekStart}>
                <SelectTrigger id="week-start">
                  <SelectValue placeholder="Select first day of week" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monday">Monday</SelectItem>
                  <SelectItem value="sunday">Sunday</SelectItem>
                  <SelectItem value="saturday">Saturday</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="idle-timeout">Idle Reminder (minutes)</Label>
              <Input
                id="idle-timeout"
                type="number"
                value={idleTimeout}
                onChange={(e) => setIdleTimeout(e.target.value)}
                min="1"
                max="120"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
