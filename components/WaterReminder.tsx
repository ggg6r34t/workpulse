"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GlassWater, Droplet, Waves, CheckCircle } from "lucide-react";
import { playReminderSound } from "@/lib/reminder";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/app/hooks/useToast";

const RECOMMENDED_GLASSES = 8;
const REMINDER_INTERVAL = 60 * 60 * 1000;

const WaterReminder: React.FC = () => {
  const [glassesConsumed, setGlassesConsumed] = useState<number>(0);
  const [nextReminderTime, setNextReminderTime] = useState<Date | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedGlasses = localStorage.getItem("waterTracker-glasses");
    const savedDate = localStorage.getItem("waterTracker-date");
    const today = new Date().toDateString();

    if (savedDate !== today) {
      localStorage.setItem("waterTracker-date", today);
      localStorage.setItem("waterTracker-glasses", "0");
      setGlassesConsumed(0);
    } else if (savedGlasses) {
      setGlassesConsumed(parseInt(savedGlasses, 10));
    }

    const lastReminder = localStorage.getItem("waterTracker-lastReminder");
    if (lastReminder) {
      const nextTime = new Date(parseInt(lastReminder, 10) + REMINDER_INTERVAL);
      setNextReminderTime(nextTime);
    } else {
      const nextTime = new Date(Date.now() + REMINDER_INTERVAL);
      setNextReminderTime(nextTime);
      localStorage.setItem("waterTracker-lastReminder", Date.now().toString());
    }
  }, []);

  const logWaterConsumption = useCallback(() => {
    setIsAnimating(true);
    const newCount = Math.min(glassesConsumed + 1, RECOMMENDED_GLASSES);
    setGlassesConsumed(newCount);
    localStorage.setItem("waterTracker-glasses", newCount.toString());

    setTimeout(() => setIsAnimating(false), 1000);

    if (newCount === RECOMMENDED_GLASSES) {
      toast({
        title: "🎉 Daily Goal Completed!",
        description: "Great job staying hydrated today!",
        variant: "success",
      });
    }
  }, [glassesConsumed]);

  // Check periodically if it's time for a reminder
  useEffect(() => {
    const reminderCheck = setInterval(() => {
      if (nextReminderTime && new Date() >= nextReminderTime) {
        if (glassesConsumed < RECOMMENDED_GLASSES) {
          toast({
            title: "💧 Water Reminder",
            description: "Time to drink a glass of water! Stay hydrated!",
            action: (
              <Button
                variant="outline"
                size="sm"
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
                onClick={() => {
                  logWaterConsumption();
                  toast.dismiss();
                }}
              >
                I drank water
              </Button>
            ),
          });

          playReminderSound(0.3).catch((err) =>
            console.error("Failed to play reminder sound", err)
          );
        }

        const nextTime = new Date(Date.now() + REMINDER_INTERVAL);
        setNextReminderTime(nextTime);
        localStorage.setItem(
          "waterTracker-lastReminder",
          Date.now().toString()
        );
      }
    }, 30000);

    return () => clearInterval(reminderCheck);
  }, [glassesConsumed, logWaterConsumption, nextReminderTime]);

  const progressPercentage = (glassesConsumed / RECOMMENDED_GLASSES) * 100;

  const formatReminderTime = () => {
    if (!nextReminderTime) return "Soon";
    return nextReminderTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="border-none bg-transparent">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-100/80 shadow-inner">
              <Droplet className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Hydration Tracker
              </h3>
              <p className="text-xs text-gray-500">
                Stay refreshed throughout the day
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-medium text-gray-500">
              Next reminder
            </span>
            <p className="text-sm font-medium text-blue-600">
              {formatReminderTime()}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span className="font-medium">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="relative">
            <Progress
              value={progressPercentage}
              className="h-3 bg-blue-100/50 shadow-inner bg-gradient-to-r from-blue-400 to-blue-500"
            />
            <div
              className="absolute top-0 left-0 h-full bg-blue-500/10"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline">
            <span
              className={`text-4xl font-bold text-blue-600 ${
                isAnimating ? "animate-bounce" : ""
              }`}
            >
              {glassesConsumed}
            </span>
            <span className="text-md text-gray-500 ml-1.5">
              / {RECOMMENDED_GLASSES} glasses
            </span>
          </div>

          <Button
            size="sm"
            className={`relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all ${
              glassesConsumed >= RECOMMENDED_GLASSES
                ? "opacity-50 pointer-events-none"
                : ""
            }`}
            onClick={logWaterConsumption}
            disabled={glassesConsumed >= RECOMMENDED_GLASSES}
          >
            <span className="relative z-10 flex items-center">
              <GlassWater className="h-4 w-4 mr-2" />
              Add Glass
            </span>
            <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-20 transition-opacity"></span>
          </Button>
        </div>

        {glassesConsumed === 0 && (
          <Alert className="mt-4 bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:border-blue-900/50 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-600">
                <Waves className="h-5 w-5 text-blue-600 dark:text-blue-100" />
              </div>
              <div>
                <AlertTitle className="text-blue-800 dark:text-blue-400  font-medium mb-2">
                  Time to Hydrate!
                </AlertTitle>
                <AlertDescription className="text-blue-600/80 dark:text-blue-300/80 text-sm leading-relaxed grid-rows-none">
                  Drinking enough water boosts energy, improves mood, and
                  supports overall health. Aim for 8 glasses (about 2 liters)
                  throughout your day.
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}

        {glassesConsumed >= RECOMMENDED_GLASSES && (
          <div className="mt-4 p-3 bg-gradient-to-r from-green-50/70 to-green-50/30 border border-green-200 rounded-lg flex items-center gap-3 backdrop-blur-sm">
            <div className="p-2 rounded-full bg-green-100 shadow-inner">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-800">
                Goal achieved! 🎉
              </p>
              <p className="text-xs text-green-700/80">{`You're doing great with your hydration today!`}</p>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-3">
            {Array.from({ length: RECOMMENDED_GLASSES }).map((_, index) => (
              <GlassWater
                key={index}
                className={`h-5 w-5 transition-all duration-300 ${
                  index < glassesConsumed
                    ? "text-blue-500 fill-blue-500/20"
                    : "text-blue-200 fill-transparent"
                }`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WaterReminder;
