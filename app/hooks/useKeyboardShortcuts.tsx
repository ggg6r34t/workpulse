import { useEffect, useCallback, useState } from "react";
import { toast } from "./useToast";

type ShortcutAction = () => void;

interface ShortcutMap {
  [key: string]: {
    action: ShortcutAction;
    description: string;
  };
}

export const useKeyboardShortcuts = (
  shortcuts: ShortcutMap,
  enabled: boolean = true
) => {
  const [recentShortcut, setRecentShortcut] = useState<string | null>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        document.activeElement instanceof HTMLSelectElement
      ) {
        return;
      }

      // Generate key combination string (e.g., "ctrl+s")
      let keyCombo = "";
      if (event.ctrlKey) keyCombo += "ctrl+";
      if (event.altKey) keyCombo += "alt+";
      if (event.shiftKey) keyCombo += "shift+";
      if (event.metaKey) keyCombo += "meta+";

      // Handle space key specially
      if (event.key === " ") {
        keyCombo += "space";
        event.preventDefault(); // Prevent default scrolling behavior
      } else {
        // Add the actual key pressed
        keyCombo += event.key.toLowerCase();
      }

      // Check if the key combination exists in our shortcuts
      const shortcut = shortcuts[keyCombo];
      if (shortcut) {
        event.preventDefault();
        shortcut.action();
        setRecentShortcut(keyCombo);

        // Show improved toast notification for the executed shortcut
        toast({
          title: "⌨️ Shortcut used",
          description: shortcut.description,
          duration: 2000,
        });
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    if (enabled) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, handleKeyDown]);

  // Clear recent shortcut after a delay
  useEffect(() => {
    if (recentShortcut) {
      const timer = setTimeout(() => {
        setRecentShortcut(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [recentShortcut]);

  // Return functions to display the available shortcuts and the most recent shortcut used
  const getShortcutsList = useCallback(() => {
    return Object.entries(shortcuts).map(([key, { description }]) => ({
      key,
      description,
    }));
  }, [shortcuts]);

  return { getShortcutsList, recentShortcut };
};
