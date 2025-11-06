"use client";

import { useState, useEffect, useCallback } from "react";

// Singleton state management to prevent multiple instances
const globalState = {
  isOpen: false,
  listeners: new Set<(isOpen: boolean) => void>(),
};

const notifyAll = (isOpen: boolean) => {
  globalState.isOpen = isOpen;
  globalState.listeners.forEach((listener) => listener(isOpen));
};

// Set up keyboard listener only once globally
let keyboardListenerSetup = false;

const setupKeyboardListener = () => {
  if (keyboardListenerSetup) return;
  keyboardListenerSetup = true;

  const handleKeyDown = (e: KeyboardEvent) => {
    // Only handle ? key when modal is closed and not in input
    if (
      e.key === "?" &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey &&
      !globalState.isOpen
    ) {
      const target = e.target as HTMLElement;
      if (
        target.tagName !== "INPUT" &&
        target.tagName !== "TEXTAREA" &&
        !target.isContentEditable
      ) {
        e.preventDefault();
        notifyAll(true);
      }
    }
  };

  window.addEventListener("keydown", handleKeyDown);
};

export function useKeyboardShortcutsModal() {
  const [isOpen, setIsOpen] = useState(globalState.isOpen);

  // Register this component's state listener
  useEffect(() => {
    const listener = (newIsOpen: boolean) => {
      setIsOpen(newIsOpen);
    };
    globalState.listeners.add(listener);

    // Set up keyboard listener on first mount
    setupKeyboardListener();

    return () => {
      globalState.listeners.delete(listener);
    };
  }, []);

  // Stable setter that updates global state
  const handleSetIsOpen = useCallback((newIsOpen: boolean) => {
    notifyAll(newIsOpen);
  }, []);

  return { isOpen, setIsOpen: handleSetIsOpen };
}
