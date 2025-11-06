"use client";

import React from "react";
import OnboardingFlow from "@/components/OnboardingFlow";

export function ClientProviders() {
  const handleOnboardingComplete = () => {
    // Optional: Add any logic when onboarding is completed
    // For example, analytics tracking, etc.
  };

  return <OnboardingFlow onComplete={handleOnboardingComplete} />;
}

