"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, ArrowRight, ArrowLeft, Check } from "lucide-react";

interface OnboardingStep {
  title: string;
  description: string;
  content: React.ReactNode;
  target?: string; // Element ID to highlight
}

interface OnboardingFlowProps {
  onComplete?: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const steps: OnboardingStep[] = [
    {
      title: "Welcome to WorkPulse!",
      description: "Let's get you started with time tracking",
      content: (
        <div className="space-y-4 py-4">
          <div className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Check className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              WorkPulse helps you track your time, boost productivity, and gain
              insights into your work habits.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Start Your First Timer",
      description: "Click the timer button to start tracking",
      content: (
        <div className="space-y-4 py-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Use the timer card at the top to start tracking your time. You can
              add client, task, description, and tags.
            </p>
          </div>
        </div>
      ),
      target: "timer-card",
    },
    {
      title: "View Your Time Entries",
      description: "See all your tracked time in the table below",
      content: (
        <div className="space-y-4 py-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              All your time entries are displayed in the table. You can filter,
              search, and export your data.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Explore Features",
      description: "Check out productivity tips, focus metrics, and more",
      content: (
        <div className="space-y-4 py-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              WorkPulse includes Pomodoro timer, water reminders, productivity
              tips, and integrations with Zapier.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Customize Settings",
      description: "Personalize your experience",
      content: (
        <div className="space-y-4 py-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Visit settings to customize timer preferences, display options,
              notifications, and more.
            </p>
          </div>
        </div>
      ),
    },
  ];

  // Check if user has seen onboarding
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasSeenOnboarding = localStorage.getItem(
        "workpulse-onboarding-seen"
      );
      if (!hasSeenOnboarding) {
        // Small delay to ensure page is loaded
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    localStorage.setItem("workpulse-onboarding-seen", "true");
    setIsOpen(false);
    onComplete?.();
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent closeButton={false} className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{steps[currentStep]?.title}</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSkip}
              className="h-6 w-6"
              aria-label="Skip onboarding"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            {steps[currentStep]?.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Progress value={progress} className="h-2" />
          <div className="min-h-[120px]">{steps[currentStep]?.content}</div>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-muted-foreground"
          >
            Skip
          </Button>
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
            )}
            <Button onClick={handleNext}>
              {currentStep === steps.length - 1 ? (
                <>
                  Get Started
                  <Check className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingFlow;
