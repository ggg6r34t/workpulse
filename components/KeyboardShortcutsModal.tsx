"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Keyboard } from "lucide-react";

interface KeyboardShortcut {
  key: string;
  description: string;
  category?: string;
}

interface ShortcutAction {
  action: () => void;
  description: string;
}

interface KeyboardShortcutsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shortcuts?: Record<string, ShortcutAction>;
}

// Custom hook for global keyboard shortcut
export function useKeyboardShortcutsModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "?" && !e.ctrlKey && !e.metaKey && !e.altKey && !isOpen) {
        const target = e.target as HTMLElement;
        if (
          target.tagName !== "INPUT" &&
          target.tagName !== "TEXTAREA" &&
          !target.isContentEditable
        ) {
          e.preventDefault();
          setIsOpen(true);
        }
      }

      // Close modal on Escape key
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  return {
    isOpen,
    setIsOpen: handleOpenChange,
  };
}

const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  open,
  onOpenChange,
  shortcuts = {},
}) => {
  // Memoize default shortcuts to prevent recreating on every render
  const defaultShortcuts = useMemo(
    (): KeyboardShortcut[] => [
      { key: "Space", description: "Start timer", category: "Timer" },
      { key: "P", description: "Pause/Resume timer", category: "Timer" },
      { key: "Esc", description: "Stop timer", category: "Timer" },
      { key: "?", description: "Show keyboard shortcuts", category: "General" },
    ],
    []
  );

  // Memoize combined shortcuts to prevent recalculation on every render
  const allShortcuts = useMemo(
    () => [
      ...defaultShortcuts,
      ...Object.entries(shortcuts).map(([key, value]) => ({
        key: key.toUpperCase(),
        description: value.description,
        category: "Custom" as const,
      })),
    ],
    [defaultShortcuts, shortcuts]
  );

  // Memoize categorized shortcuts
  const shortcutsByCategory = useMemo(
    () =>
      allShortcuts.reduce((acc, shortcut) => {
        const category = shortcut.category || "General";
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(shortcut);
        return acc;
      }, {} as Record<string, KeyboardShortcut[]>),
    [allShortcuts]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-full max-h-[80vh] mx-auto overflow-y-auto"
        onEscapeKeyDown={(e) => e.preventDefault()} // Let our hook handle Escape
      >
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Keyboard className="h-5 w-5 text-primary" />
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
          </div>
          <DialogDescription>
            Use these shortcuts to navigate and control WorkPulse faster
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {Object.entries(shortcutsByCategory).map(([category, items]) => (
            <div key={category} className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                {category}
              </h3>
              <div className="grid gap-3">
                {items.map((shortcut) => (
                  <div
                    key={`${category}-${shortcut.key}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <span className="text-sm text-muted-foreground">
                      {shortcut.description}
                    </span>
                    <kbd className="px-2 py-1 text-xs font-semibold text-foreground bg-background border border-border rounded shadow-sm min-w-[60px] text-center">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t text-xs text-muted-foreground">
          <p>
            Press{" "}
            <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-muted border border-border rounded">
              ?
            </kbd>{" "}
            anytime to open this help dialog, or{" "}
            <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-muted border border-border rounded">
              Esc
            </kbd>{" "}
            to close
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcutsModal;
