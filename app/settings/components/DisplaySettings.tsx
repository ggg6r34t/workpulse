"use client";
import { Palette, Clock, LayoutGrid } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Settings } from "@/types/types";
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";
import { useTheme } from "next-themes";

interface Props {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

export function DisplaySettings({ settings, updateSettings }: Props) {
  const { theme, setTheme } = useTheme();

  // Sync theme with settings when component mounts
  useEffect(() => {
    if (settings.theme && settings.theme !== theme) {
      setTheme(settings.theme);
    }
  }, [settings.theme, setTheme, theme]);

  // Update settings when theme changes
  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    updateSettings({ theme: newTheme });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Time & Date Format
          </CardTitle>
          <CardDescription>
            Configure how times and dates are displayed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="time-format">Time Format</Label>
              <Select
                value={settings.timeFormat || "12h"}
                onValueChange={(value: "12h" | "24h") =>
                  updateSettings({ timeFormat: value })
                }
              >
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
              <Select
                value={settings.dateFormat || "MM/DD/YYYY"}
                onValueChange={(value) => updateSettings({ dateFormat: value })}
              >
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
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="show-seconds">
                <div className="flex flex-col gap-1">
                  <span>Show seconds in timer</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    Display seconds in the timer counter
                  </span>
                </div>
              </Label>
              <Switch
                id="show-seconds"
                checked={settings.showSeconds !== false}
                onCheckedChange={(checked) =>
                  updateSettings({ showSeconds: checked })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-primary" />
            Layout Options
          </CardTitle>
          <CardDescription>
            Customize the appearance of WorkPulse
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="compact-view">
                <div className="flex flex-col gap-1">
                  <span>Compact view</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    Use a more compact layout with less whitespace
                  </span>
                </div>
              </Label>
              <Switch
                id="compact-view"
                checked={settings.compactView === true}
                onCheckedChange={(checked) =>
                  updateSettings({ compactView: checked })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <Label htmlFor="show-description">
                <div className="flex flex-col gap-1">
                  <span>Show descriptions in table</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    Display task descriptions in the time entries table
                  </span>
                </div>
              </Label>
              <Switch
                id="show-description"
                checked={settings.showDescriptions !== false}
                onCheckedChange={(checked) =>
                  updateSettings({ showDescriptions: checked })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <Label htmlFor="animations">
                <div className="flex flex-col gap-1">
                  <span>Enable animations</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    Use animations for timer and UI elements
                  </span>
                </div>
              </Label>
              <Switch
                id="animations"
                checked={settings.animations !== false}
                onCheckedChange={(checked) =>
                  updateSettings({ animations: checked })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Color Theme
          </CardTitle>
          <CardDescription>Choose your preferred color theme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                settings.theme === "light" || !settings.theme
                  ? "border-primary bg-primary/5"
                  : "border-muted hover:border-primary/30"
              }`}
              onClick={() => handleThemeChange("light")}
            >
              <div className="bg-white border shadow-sm h-16 w-full rounded-md mb-3 flex items-center justify-center">
                <div className="h-8 w-8 rounded-full bg-primary/20"></div>
              </div>
              <span className="text-sm font-medium">Light</span>
            </div>

            <div
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                settings.theme === "dark"
                  ? "border-primary bg-primary/5"
                  : "border-muted hover:border-primary/30"
              }`}
              onClick={() => handleThemeChange("dark")}
            >
              <div className="bg-slate-900 border border-slate-700 h-16 w-full rounded-md mb-3 flex items-center justify-center">
                <div className="h-8 w-8 rounded-full bg-primary/40"></div>
              </div>
              <span className="text-sm font-medium">Dark</span>
            </div>

            <div
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                settings.theme === "system"
                  ? "border-primary bg-primary/5"
                  : "border-muted hover:border-primary/30"
              }`}
              onClick={() => handleThemeChange("system")}
            >
              <div className="bg-gradient-to-br from-white to-slate-900 border h-16 w-full rounded-md mb-3 flex items-center justify-center">
                <div className="h-8 w-8 rounded-full bg-primary/30"></div>
              </div>
              <span className="text-sm font-medium">System</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
