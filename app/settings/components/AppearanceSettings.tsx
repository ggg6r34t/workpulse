"use client";

import React, { useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

export function AppearanceSettings() {
  const [theme, setTheme] = useState("system");
  const [compactMode, setCompactMode] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [fontSize, setFontSize] = useState([16]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>
            Customize the appearance of the application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                theme === "light"
                  ? "border-primary bg-primary/5"
                  : "border-muted hover:border-primary/30"
              }`}
              onClick={() => setTheme("light")}
            >
              <div className="bg-white border shadow-sm h-16 w-full rounded-md mb-3 flex items-center justify-center">
                <Sun className="h-8 w-8 text-amber-500" />
              </div>
              <span className="text-sm font-medium">Light</span>
            </div>
            <div
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                theme === "dark"
                  ? "border-primary bg-primary/5"
                  : "border-muted hover:border-primary/30"
              }`}
              onClick={() => setTheme("dark")}
            >
              <div className="bg-slate-900 border border-slate-700 h-16 w-full rounded-md mb-3 flex items-center justify-center">
                <Moon className="h-8 w-8 text-slate-400" />
              </div>
              <span className="text-sm font-medium">Dark</span>
            </div>
            <div
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                theme === "system"
                  ? "border-primary bg-primary/5"
                  : "border-muted hover:border-primary/30"
              }`}
              onClick={() => setTheme("system")}
            >
              <div className="bg-gradient-to-br from-white to-slate-900 border h-16 w-full rounded-md mb-3 flex items-center justify-center">
                <Monitor className="h-8 w-8 text-slate-600" />
              </div>
              <span className="text-sm font-medium">System</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Display Options</CardTitle>
          <CardDescription>Adjust how the interface appears</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="compact-mode" className="flex flex-col gap-1">
                <span>Compact mode</span>
                <span className="font-normal text-xs text-muted-foreground">
                  Reduce spacing and size of elements
                </span>
              </Label>
              <Switch
                id="compact-mode"
                checked={compactMode}
                onCheckedChange={setCompactMode}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="animations" className="flex flex-col gap-1">
                <span>Animations</span>
                <span className="font-normal text-xs text-muted-foreground">
                  Enable animations and transitions
                </span>
              </Label>
              <Switch
                id="animations"
                checked={animationsEnabled}
                onCheckedChange={setAnimationsEnabled}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label>Font Size</Label>
            <div className="space-y-4">
              <Slider
                value={fontSize}
                min={12}
                max={20}
                step={1}
                onValueChange={setFontSize}
              />
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Small</span>
                <span className="text-xs text-muted-foreground">
                  {fontSize[0]}px
                </span>
                <span className="text-xs text-muted-foreground">Large</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
