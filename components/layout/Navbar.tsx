import React from "react";

import { Calendar } from "lucide-react";
import NotificationButton from "../NotificationButton";
import SettingsButton from "@/app/settings/components/SettingsButton";
import ThemeToggle from "../ThemeToggle";

const Navbar = () => {
  return (
    <div className="sticky top-0 z-10 backdrop-blur-sm bg-background/90 border-b">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-full">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              WorkPulse
            </span>
            <span className="text-xs text-muted-foreground hidden sm:inline-block">
              Time tracking simplified
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <NotificationButton />
          <SettingsButton />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
