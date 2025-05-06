"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

const SettingsButton = () => {
  return (
    <Button
      asChild
      variant="ghost"
      size="icon"
      className="text-muted-foreground"
    >
      <Link href="/settings" className="flex items-center gap-2">
        <span className="sr-only">Settings</span>
        <Settings className="h-4 w-4" />
      </Link>
    </Button>
  );
};

export default SettingsButton;
