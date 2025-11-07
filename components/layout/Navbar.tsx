"use client";

import React from "react";
import Link from "next/link";

import { Calendar, Keyboard } from "lucide-react";
import NotificationButton from "../NotificationButton";
import SettingsButton from "@/app/settings/components/SettingsButton";
import ThemeToggle from "../ThemeToggle";
import { Button } from "@/components/ui/button";
import KeyboardShortcutsModal, {
  useKeyboardShortcutsModal,
} from "../KeyboardShortcutsModal";

const Navbar = () => {
  const { isOpen, setIsOpen } = useKeyboardShortcutsModal();

  return (
    <>
      <div className="sticky top-0 z-10 backdrop-blur-sm bg-background/90 border-b">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <Link href="/" className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                WorkPulse
              </span>
              <span className="text-xs text-muted-foreground hidden sm:inline-block">
                Time tracking simplified
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(true)}
              className="h-10 w-10 min-h-[44px] min-w-[44px]"
              aria-label="Show keyboard shortcuts"
              title="Keyboard shortcuts (?)"
            >
              <Keyboard className="h-5 w-5" />
            </Button>
            <NotificationButton />
            <SettingsButton />
            <ThemeToggle />
          </div>
        </div>
      </div>
      <KeyboardShortcutsModal open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
};

export default Navbar;
