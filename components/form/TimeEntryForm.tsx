"use client";

import React, { useState, useEffect, useRef } from "react";
import { Clock, User, Clipboard, Tag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTimeTracker } from "@/app/contexts/TimeTrackerContext";
import { Badge } from "../ui/badge";
import { sanitizeString, sanitizeTag } from "@/lib/validation";

const TimeEntryForm = () => {
  const { activeEntry, startTimer, updateEntry, settings } = useTimeTracker();
  const [client, setClient] = useState("");
  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [recentClients, setRecentClients] = useState<string[]>([]);
  const [recentTasks, setRecentTasks] = useState<string[]>([]);
  const tagInputRef = useRef<HTMLInputElement>(null);

  const defaultClient = settings?.defaultClient || "";
  const defaultTask = settings?.defaultTask || "";

  // Load recent values
  useEffect(() => {
    try {
      const storedClients = localStorage.getItem("workpulse-recent-clients");
      const storedTasks = localStorage.getItem("workpulse-recent-tasks");

      if (storedClients) setRecentClients(JSON.parse(storedClients));
      if (storedTasks) setRecentTasks(JSON.parse(storedTasks));
    } catch (error) {
      console.error("Error loading recent values:", error);
    }

    // Default values when there's no active entry
    if (!activeEntry) {
      setClient(defaultClient);
      setTask(defaultTask);
    }
  }, [activeEntry, defaultClient, defaultTask]);

  // Update form values when active entry changes
  useEffect(() => {
    if (activeEntry) {
      setClient(activeEntry.client);
      setTask(activeEntry.task);
      setDescription(activeEntry.description || "");
      setTags(activeEntry.tags || []);
    } else {
      // Reset form if no active entry
      setClient(defaultClient);
      setTask(defaultTask);
      setDescription("");
      setTags([]);
    }
  }, [activeEntry, defaultClient, defaultTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Sanitize and validate inputs
    const sanitizedClient = sanitizeString(client.trim(), 200);
    const sanitizedTask = sanitizeString(task.trim(), 200);
    const sanitizedDescription = description ? sanitizeString(description.trim(), 1000) : undefined;
    const sanitizedTags = tags.map(tag => sanitizeTag(tag)).filter(Boolean);

    // Validate required fields
    if (!sanitizedClient || !sanitizedTask) {
      return;
    }

    if (activeEntry) {
      // Update the current entry
      updateEntry(activeEntry.id, {
        client: sanitizedClient,
        task: sanitizedTask,
        description: sanitizedDescription,
        tags: sanitizedTags,
      });
    } else {
      // Start a new timer
      startTimer(sanitizedClient, sanitizedTask, sanitizedDescription, sanitizedTags);

      // Save to recent values
      if (sanitizedClient) {
        const updatedClients = [
          sanitizedClient,
          ...recentClients.filter((c) => c !== sanitizedClient),
        ].slice(0, 5);
        setRecentClients(updatedClients);
        try {
          localStorage.setItem(
            "workpulse-recent-clients",
            JSON.stringify(updatedClients)
          );
        } catch (error) {
          console.error("Error saving recent clients:", error);
        }
      }

      if (sanitizedTask) {
        const updatedTasks = [
          sanitizedTask,
          ...recentTasks.filter((t) => t !== sanitizedTask),
        ].slice(0, 5);
        setRecentTasks(updatedTasks);
        try {
          localStorage.setItem(
            "workpulse-recent-tasks",
            JSON.stringify(updatedTasks)
          );
        } catch (error) {
          console.error("Error saving recent tasks:", error);
        }
      }

      // Update recently used tags in localStorage
      if (sanitizedTags.length > 0) {
        try {
          const storedRecentTags = localStorage.getItem(
            "workpulse-recent-tags"
          );
          const recentTags: string[] = storedRecentTags
            ? JSON.parse(storedRecentTags)
            : [];

          // Add all current tags to recently used
          const updatedRecentTags = [
            ...sanitizedTags,
            ...recentTags.filter((tag) => !sanitizedTags.includes(tag)),
          ].slice(0, 5);

          localStorage.setItem(
            "workpulse-recent-tags",
            JSON.stringify(updatedRecentTags)
          );
        } catch (error) {
          console.error("Error updating recent tags:", error);
        }
      }
    }
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const input = e.currentTarget;
      const value = input.value.trim();

      if (value && !tags.includes(value)) {
        setTags([...tags, value]);
        input.value = "";
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="client"
            className="text-sm font-medium flex items-center gap-2"
          >
            <User className="h-4 w-4 text-primary" />
            Client
          </label>
          <div className="relative">
            <Input
              id="client"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder="Client name"
              className="w-full rounded-lg border-muted bg-card/50 focus-visible:ring-primary"
              list="client-options"
              required
            />
            <datalist id="client-options">
              {recentClients.map((c, index) => (
                <option key={`client-${index}`} value={c} />
              ))}
            </datalist>
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="task"
            className="text-sm font-medium flex items-center gap-2"
          >
            <Clock className="h-4 w-4 text-primary" />
            Task
          </label>
          <div className="relative">
            <Input
              id="task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="What are you working on?"
              className="w-full rounded-lg border-muted bg-card/50 focus-visible:ring-primary"
              list="task-options"
              required
            />
            <datalist id="task-options">
              {recentTasks.map((t, index) => (
                <option key={`task-${index}`} value={t} />
              ))}
            </datalist>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="tags"
          className="text-sm font-medium flex items-center gap-2 text-foreground/80"
        >
          <Tag className="h-4 w-4 text-primary" />
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm flex items-center gap-1 group"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-primary/50 hover:text-primary/90 group-hover:scale-110 transition-all"
              >
                &times;
              </button>
            </Badge>
          ))}
        </div>
        <Input
          id="tags"
          placeholder="Add tags (press Enter or comma to add)"
          className="w-full rounded-lg border-muted bg-card/50 focus-visible:ring-primary"
          onKeyDown={handleTagInput}
          ref={tagInputRef}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Add multiple tags to organize your work better
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="description"
          className="text-sm font-medium flex items-center gap-2"
        >
          <Clipboard className="h-4 w-4 text-primary" />
          Description (optional)
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details about this time entry"
          className="min-h-[100px] rounded-lg border-muted bg-card/50 focus-visible:ring-primary"
        />
      </div>

      {!activeEntry && (
        <Button
          type="submit"
          className="w-full md:w-auto bg-primary/90 hover:bg-primary transition-all rounded-lg"
        >
          Start Tracking
        </Button>
      )}
    </form>
  );
};

export default TimeEntryForm;
