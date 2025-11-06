"use client";
import {
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  Database,
  History,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import { Settings, TimeEntry } from "@/types/types";
import { toast } from "@/app/hooks/useToast";
import { useTimeTracker } from "@/app/contexts/TimeTrackerContext";

interface DataSettingsProps {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

export function DataSettings({ settings, updateSettings }: DataSettingsProps) {
  const { timeEntries, setTimeEntries, clearAllEntries } = useTimeTracker();

  const handleExportData = async () => {
    try {
      // Create a data object with time entries and settings
      const data = {
        timeEntries,
        settings,
        exportDate: new Date().toISOString(),
      };

      // Convert to JSON and create download
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      // Create download link and trigger click
      const a = document.createElement("a");
      a.href = url;
      a.download = `workpulse-data-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      toast({
        title: "Data exported",
        description:
          "Your time entries and settings have been exported successfully.",
        variant: "success",
      });
    } catch {
      toast({
        title: "Export failed",
        description: "There was an error exporting your data.",
        variant: "error",
      });
    }
  };

  const handleImportData = () => {
    // This would be connected to a file input in a real implementation
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";
    fileInput.setAttribute("aria-label", "Import time entries data");

    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Import failed",
          description: "File size exceeds 10MB limit",
          variant: "error",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const rawData = event.target?.result as string;
          if (!rawData || typeof rawData !== "string") {
            throw new Error("Invalid file content");
          }

          const data = JSON.parse(rawData);
          
          // Validate data structure
          if (!data || typeof data !== "object") {
            throw new Error("Invalid data format");
          }

          // Validate and import time entries
          if (data.timeEntries && Array.isArray(data.timeEntries)) {
            const validatedEntries = data.timeEntries
              .map((entry: { startTime: string; endTime?: string | null }) => {
                try {
                  // Validate date strings
                  const startTime = new Date(entry.startTime);
                  const endTime = entry.endTime ? new Date(entry.endTime) : null;
                  
                  if (isNaN(startTime.getTime())) {
                    throw new Error("Invalid start time");
                  }
                  if (endTime && isNaN(endTime.getTime())) {
                    throw new Error("Invalid end time");
                  }

                  return {
                    ...entry,
                    startTime,
                    endTime,
                  };
                } catch (error) {
                  console.warn("Invalid entry skipped:", error, entry);
                  return null;
                }
              })
              .filter((entry: TimeEntry | null): entry is TimeEntry => entry !== null);

            setTimeEntries(validatedEntries);
          }

          // Validate and import settings
          if (data.settings && typeof data.settings === "object") {
            try {
              updateSettings(data.settings);
            } catch (error) {
              console.warn("Invalid settings, using defaults:", error);
            }
          }

          toast({
            title: "Import successful",
            description: `${data.timeEntries?.length || 0} entries imported`,
            variant: "success",
          });
        } catch (error) {
          console.error("Import error:", error);
          toast({
            title: "Import failed",
            description: error instanceof Error ? error.message : "Invalid data format",
            variant: "error",
          });
        }
      };

      reader.onerror = () => {
        toast({
          title: "Import failed",
          description: "Error reading file",
          variant: "error",
        });
      };

      reader.readAsText(file);
    };

    fileInput.click();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Data Management
          </CardTitle>
          <CardDescription>Manage your time tracking data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-save">
                <div className="flex flex-col gap-1">
                  <span>Auto-save entries</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    Automatically save time entries to local storage
                  </span>
                </div>
              </Label>
              <Switch
                id="auto-save"
                checked={settings.autoSave !== false}
                onCheckedChange={(checked) =>
                  updateSettings({ autoSave: checked })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <Label htmlFor="backup-frequency">
                <div className="flex flex-col gap-1">
                  <span>Backup frequency</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    How often to create automatic backups
                  </span>
                </div>
              </Label>
              <div className="w-40">
                <Select
                  value={settings.backupFrequency || "daily"}
                  onValueChange={(value) =>
                    updateSettings({
                      backupFrequency: value as
                        | "daily"
                        | "hourly"
                        | "weekly"
                        | "never",
                    })
                  }
                >
                  <SelectTrigger id="backup-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={handleExportData}
            >
              <Download className="h-4 w-4" />
              Export Time Entries
            </Button>
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={handleImportData}
            >
              <Upload className="h-4 w-4" />
              Import Data
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Data Retention
          </CardTitle>
          <CardDescription>
            Configure how long to keep your time entries
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-archive">
                <div className="flex flex-col gap-1">
                  <span>Auto-archive old entries</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    Automatically archive time entries older than the specified
                    period
                  </span>
                </div>
              </Label>
              <Switch
                id="auto-archive"
                checked={settings.autoArchive === true}
                onCheckedChange={(checked) =>
                  updateSettings({ autoArchive: checked })
                }
              />
            </div>

            {settings.autoArchive && (
              <div className="flex items-center justify-between pl-6">
                <Label htmlFor="archive-period" className="flex flex-col gap-1">
                  <span>Archive period</span>
                </Label>
                <div className="w-40">
                  <Select
                    value={settings.archivePeriod || "3months"}
                    onValueChange={(value) =>
                      updateSettings({ archivePeriod: value })
                    }
                  >
                    <SelectTrigger id="archive-period">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1month">1 month</SelectItem>
                      <SelectItem value="3months">3 months</SelectItem>
                      <SelectItem value="6months">6 months</SelectItem>
                      <SelectItem value="1year">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible actions that affect your data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="gap-2">
                <Trash2 className="h-4 w-4" />
                Clear All Time Entries
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all
                  your time entries. Your settings will be preserved.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => {
                    // Call the clearAllEntries function from context
                    clearAllEntries();

                    toast({
                      title: "Data cleared",
                      description: "All your time entries have been deleted.",
                      variant: "error",
                    });
                  }}
                >
                  Delete All Entries
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
