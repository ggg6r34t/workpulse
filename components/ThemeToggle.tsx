"use client";

import { Moon, Sun, Monitor, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const ThemeToggle = ({
  className,
  variant = "icon",
  showLabel = false,
}: {
  className?: string;
  variant?: "icon" | "button";
  showLabel?: boolean;
}) => {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Determine the current theme for display purposes
  const currentTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size={variant === "icon" ? "icon" : "default"}
        className={className}
        aria-label="Loading theme"
      >
        <div className="h-[1.2rem] w-[1.2rem] animate-pulse rounded-full bg-muted" />
      </Button>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant === "icon" ? "ghost" : "outline"}
          size={variant === "icon" ? "icon" : "default"}
          className={cn(
            "group relative transition-all",
            variant === "button" && "gap-2 pl-3 pr-2",
            className
          )}
          aria-label="Toggle theme"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          {variant === "button" && (
            <>
              <span className="capitalize">
                {currentTheme === "light" ? "Light" : "Dark"}
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            </>
          )}
          {showLabel && variant === "icon" && (
            <span className="sr-only">Toggle theme</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[120px] overflow-hidden rounded-lg p-1 shadow-lg space-y-1"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={cn(
            "group flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm",
            currentTheme === "light" && "bg-accent"
          )}
        >
          <Sun className="h-4 w-4 text-yellow-500" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={cn(
            "group flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm",
            currentTheme === "dark" && "bg-accent"
          )}
        >
          <Moon className="h-4 w-4 text-indigo-400" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={cn(
            "group flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm",
            theme === "system" && "bg-accent"
          )}
        >
          <Monitor className="h-4 w-4 text-muted-foreground" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
