"use client";

import { Keyboard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";

interface KeyboardShortcutsProps {
  shortcuts: {
    [key: string]: {
      description: string;
    };
  };
}

const KeyboardShortcuts = ({ shortcuts }: KeyboardShortcutsProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground flex items-center gap-1.5 mt-2 group hover:bg-accent/40"
            >
              <Keyboard className="h-3 w-3 group-hover:scale-110 transition-transform" />
              <span className="group-hover:text-primary transition-colors">
                Keyboard Shortcuts
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md backdrop-blur-md bg-card border-primary/10">
            <DialogHeader>
              <DialogTitle className="text-center text-lg">
                Keyboard Shortcuts
              </DialogTitle>
              <DialogDescription className="text-center">
                Use these shortcuts to control the timer without clicking
                buttons.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-3 font-medium text-muted-foreground">
                      Key
                    </th>
                    <th className="text-left pb-3 font-medium text-muted-foreground">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(shortcuts).map(([key, { description }]) => (
                    <tr
                      key={key}
                      className="border-b border-border/40 hover:bg-accent/5"
                    >
                      <td className="py-3 pr-4">
                        <kbd className="px-2 py-1 font-mono bg-secondary/40 text-secondary-foreground rounded border border-border/50 shadow-sm">
                          {key}
                        </kbd>
                      </td>
                      <td className="py-3">{description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DialogContent>
        </Dialog>
      </HoverCardTrigger>
      <HoverCardContent className="w-auto p-2 bg-white/90 backdrop-blur-sm border-border/40">
        <p className="text-xs">
          Press <kbd className="px-1 bg-secondary/40 rounded">S</kbd> to start,{" "}
          <kbd className="px-1 bg-secondary/40 rounded">P</kbd> to pause
        </p>
      </HoverCardContent>
    </HoverCard>
  );
};

export default KeyboardShortcuts;
