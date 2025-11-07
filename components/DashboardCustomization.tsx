"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings2, Eye, EyeOff } from "lucide-react";

interface WidgetConfig {
  id: string;
  label: string;
  defaultVisible: boolean;
}

interface DashboardCustomizationProps {
  widgets: WidgetConfig[];
  onWidgetsChange: (widgets: Record<string, boolean>) => void;
}

const DashboardCustomization: React.FC<DashboardCustomizationProps> = ({
  widgets,
  onWidgetsChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [visibleWidgets, setVisibleWidgets] = useState<Record<string, boolean>>(
    {}
  );

  // Initialize from localStorage - REMOVE onWidgetsChange call here
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("workpulse-widget-visibility");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setVisibleWidgets(parsed);
          // REMOVED: onWidgetsChange(parsed); - Let parent handle this
        } catch {
          // Use defaults
          const defaults = widgets.reduce(
            (acc, widget) => ({ ...acc, [widget.id]: widget.defaultVisible }),
            {}
          );
          setVisibleWidgets(defaults);
          // REMOVED: onWidgetsChange(defaults); - Let parent handle this
        }
      } else {
        // Use defaults
        const defaults = widgets.reduce(
          (acc, widget) => ({ ...acc, [widget.id]: widget.defaultVisible }),
          {}
        );
        setVisibleWidgets(defaults);
        // REMOVED: onWidgetsChange(defaults); - Let parent handle this
      }
    }
  }, [widgets]); // REMOVED: onWidgetsChange from dependencies

  const handleWidgetToggle = (widgetId: string, visible: boolean) => {
    const updated = { ...visibleWidgets, [widgetId]: visible };
    setVisibleWidgets(updated);
    onWidgetsChange(updated);

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "workpulse-widget-visibility",
        JSON.stringify(updated)
      );
    }
  };

  const handleReset = () => {
    const defaults = widgets.reduce(
      (acc, widget) => ({ ...acc, [widget.id]: widget.defaultVisible }),
      {}
    );
    setVisibleWidgets(defaults);
    onWidgetsChange(defaults);

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "workpulse-widget-visibility",
        JSON.stringify(defaults)
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 min-h-[44px] min-w-[44px]"
          aria-label="Customize dashboard"
          title="Customize dashboard"
        >
          <Settings2 className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-primary" />
            Customize Dashboard
          </DialogTitle>
          <DialogDescription>
            Show or hide widgets on your dashboard
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {widgets.map((widget) => (
            <div
              key={widget.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-muted/20"
            >
              <div className="flex items-center gap-3">
                {visibleWidgets[widget.id] ? (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                )}
                <Label
                  htmlFor={`widget-${widget.id}`}
                  className="cursor-pointer"
                >
                  {widget.label}
                </Label>
              </div>
              <Switch
                id={`widget-${widget.id}`}
                checked={visibleWidgets[widget.id] ?? widget.defaultVisible}
                onCheckedChange={(checked) =>
                  handleWidgetToggle(widget.id, checked)
                }
                aria-label={`Toggle ${widget.label}`}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleReset}
            className="min-h-[44px]"
          >
            Reset to Defaults
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardCustomization;
