"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DisplaySettings } from "./components/DisplaySettings";
import { DataSettings } from "./components/DataSettings";
import { NotificationSettings } from "./components/NotificationSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimerSettings } from "./components/TimerSettings";
import { toast } from "../hooks/useToast";
import { useTimeTracker } from "../contexts/TimeTrackerContext";

export default function SettingsPage() {
  const { updateSettings, settings, resetSettings } = useTimeTracker();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("timer");
  const [isLoading, setIsLoading] = useState(true);
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
      setIsLoading(false);
    }
  }, [settings]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading settings...
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      updateSettings(localSettings);
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
        variant: "success",
      });
    } catch {
      toast({
        title: "Error saving settings",
        description:
          "There was a problem saving your settings. Please try again.",
        variant: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    resetSettings();
    setLocalSettings(settings);
    toast({
      title: "Settings reset",
      description: "Your settings have been reset to default values.",
      variant: "info",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/10 ">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-2">
              Customize your time tracking experience
            </p>
          </div>

          {/* Settings Content */}
          <div className="bg-card rounded-xl shadow-sm border">
            <Tabs
              defaultValue="timer"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="border-b p-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="timer">Timer</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="display">Display</TabsTrigger>
                  <TabsTrigger value="data">Data</TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6">
                <TabsContent value="timer" className="space-y-6">
                  <TimerSettings
                    settings={localSettings}
                    updateSettings={(newSettings) =>
                      setLocalSettings((prev) => ({ ...prev, ...newSettings }))
                    }
                  />
                </TabsContent>

                <TabsContent value="notifications" className="space-y-6">
                  <NotificationSettings
                    settings={localSettings}
                    updateSettings={(newSettings) =>
                      setLocalSettings((prev) => ({ ...prev, ...newSettings }))
                    }
                  />
                </TabsContent>

                <TabsContent value="display" className="space-y-6">
                  <DisplaySettings
                    settings={localSettings}
                    updateSettings={(newSettings) =>
                      setLocalSettings((prev) => ({ ...prev, ...newSettings }))
                    }
                  />
                </TabsContent>

                <TabsContent value="data" className="space-y-6">
                  <DataSettings
                    settings={localSettings}
                    updateSettings={(newSettings) =>
                      setLocalSettings((prev) => ({ ...prev, ...newSettings }))
                    }
                  />
                </TabsContent>
              </div>
            </Tabs>

            {/* Footer with Save Button */}
            <div className="border-t p-4 bg-muted/10">
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleReset}>
                  Reset to Defaults
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="gap-2"
                >
                  {isSaving ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
