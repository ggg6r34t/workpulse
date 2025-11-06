"use client";

import React from "react";
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

interface KeyboardShortcutsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shortcuts?: Record<string, { action: () => void; description: string }>;
}

const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  open,
  onOpenChange,
  shortcuts = {},
}) => {
  // Default shortcuts
  const defaultShortcuts: KeyboardShortcut[] = [
    { key: "Space", description: "Start/Stop timer", category: "Timer" },
    { key: "P", description: "Pause/Resume timer", category: "Timer" },
    { key: "Esc", description: "Stop timer", category: "Timer" },
    { key: "S", description: "Open settings", category: "Navigation" },
    { key: "E", description: "Export data", category: "Actions" },
    { key: "?", description: "Show keyboard shortcuts", category: "General" },
  ];

  // Combine default and custom shortcuts
  const allShortcuts: KeyboardShortcut[] = [
    ...defaultShortcuts,
    ...Object.entries(shortcuts).map(([key, value]) => ({
      key: key.toUpperCase(),
      description: value.description,
      category: "Custom",
    })),
  ];

  // Group shortcuts by category
  const shortcutsByCategory = allShortcuts.reduce(
    (acc, shortcut) => {
      const category = shortcut.category || "General";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(shortcut);
      return acc;
    },
    {} as Record<string, KeyboardShortcut[]>
  );

  // Escape key is handled by Dialog component natively

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
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
                {items.map((shortcut, index) => (
                  <div
                    key={`${category}-${index}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <span className="text-sm text-muted-foreground">
                      {shortcut.description}
                    </span>
                    <kbd className="px-2 py-1 text-xs font-semibold text-foreground bg-background border border-border rounded shadow-sm">
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
            Press <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-muted border border-border rounded">?</kbd>{" "}
            anytime to open this help dialog
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcutsModal;

