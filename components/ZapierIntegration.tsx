"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Zap, ArrowRight, Check, Info } from "lucide-react";
import { useTimeTracker } from "@/app/contexts/TimeTrackerContext";
import { toast } from "@/app/hooks/useToast";
import { validateWebhookUrl, sanitizeString } from "@/lib/validation";

const ZapierIntegration = () => {
  const [webhookUrl, setWebhookUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { timeEntries, activeEntry } = useTimeTracker();

  const latestEntry =
    timeEntries.length > 0
      ? [...timeEntries].sort(
          (a, b) => b.startTime.getTime() - a.startTime.getTime()
        )[0]
      : null;

  const handleTrigger = async (e: React.FormEvent) => {
    e.preventDefault();

    const sanitizedUrl = sanitizeString(webhookUrl.trim(), 500);
    
    if (!sanitizedUrl) {
      toast({
        title: "Error",
        description: "Please enter your Zapier webhook URL",
        variant: "error",
      });
      return;
    }

    // Validate webhook URL
    try {
      validateWebhookUrl(sanitizedUrl);
    } catch (error) {
      toast({
        title: "Invalid URL",
        description: error instanceof Error ? error.message : "Please enter a valid webhook URL",
        variant: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Prepare data to send to Zapier (sanitize all user inputs)
      const data = {
        timestamp: new Date().toISOString(),
        triggered_from: window.location.origin,
        active_timer: activeEntry
          ? {
              id: activeEntry.id,
              task: sanitizeString(activeEntry.task, 200),
              client: sanitizeString(activeEntry.client, 200),
              started_at: activeEntry.startTime.toISOString(),
              is_paused: activeEntry.isPaused,
            }
          : null,
        latest_entry: latestEntry
          ? {
              id: latestEntry.id,
              task: sanitizeString(latestEntry.task, 200),
              client: sanitizeString(latestEntry.client, 200),
              duration_ms: latestEntry.endTime
                ? latestEntry.endTime.getTime() -
                  latestEntry.startTime.getTime() -
                  (latestEntry.pausedTime || 0)
                : 0,
            }
          : null,
        total_entries: timeEntries.length,
      };

      // Use a timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(sanitizedUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Request Sent",
        description:
          "The request was sent to Zapier. Check your Zap's history to confirm.",
        variant: "success",
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        toast({
          title: "Request Timeout",
          description: "The request took too long. Please check your connection and try again.",
          variant: "error",
        });
      } else {
        console.error("Error triggering webhook:", error);
        toast({
          title: "Error",
          description:
            "Failed to trigger the Zapier webhook. Please check the URL and try again.",
          variant: "error",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-transparent border-none">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg font-medium">
          <Zap className="w-5 h-5 mr-2 text-yellow-500" />
          Zapier Integration
        </CardTitle>
        <CardDescription>
          Connect WorkPulse with your favorite apps
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleTrigger} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="url"
              placeholder="Paste your Zapier webhook URL"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="border border-input focus:border-primary"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center text-xs text-muted-foreground">
              <Info className="h-3.5 w-3.5 mr-1" />
              <span>Sends time data to your connected apps</span>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !webhookUrl}
              className="w-full transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? "Sending..." : "Send to Zapier"}
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="pt-2">
            <h4 className="text-xs font-medium text-muted-foreground mb-2">
              What you can do:
            </h4>
            <ul className="space-y-1.5">
              {[
                "Create calendar events",
                "Add to project management tools",
                "Generate invoices",
              ].map((item, i) => (
                <li key={i} className="text-xs flex gap-1.5 items-center">
                  <Check className="h-3.5 w-3.5 text-green-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ZapierIntegration;
