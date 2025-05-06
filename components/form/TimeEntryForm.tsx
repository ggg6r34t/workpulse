"use client";

import React, { useState, useEffect } from "react";
import { Clock, User, Clipboard } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTimeTracker } from "@/app/contexts/TimeTrackerContext";

const TimeEntryForm = () => {
  const { activeEntry, startTimer, updateEntry } = useTimeTracker();
  const [client, setClient] = useState("");
  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [recentClients, setRecentClients] = useState<string[]>([]);
  const [recentTasks, setRecentTasks] = useState<string[]>([]);

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
  }, []);

  // Update form values when active entry changes
  useEffect(() => {
    if (activeEntry) {
      setClient(activeEntry.client);
      setTask(activeEntry.task);
      setDescription(activeEntry.description || "");
    } else {
      // Reset form if no active entry
      setClient("");
      setTask("");
      setDescription("");
    }
  }, [activeEntry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeEntry) {
      // Update the current entry
      updateEntry(activeEntry.id, { client, task, description });
    } else {
      // Start a new timer
      startTimer(client, task, description);

      // Save to recent values
      if (client.trim()) {
        const updatedClients = [
          client,
          ...recentClients.filter((c) => c !== client),
        ].slice(0, 5);
        setRecentClients(updatedClients);
        localStorage.setItem(
          "workpulse-recent-clients",
          JSON.stringify(updatedClients)
        );
      }

      if (task.trim()) {
        const updatedTasks = [
          task,
          ...recentTasks.filter((t) => t !== task),
        ].slice(0, 5);
        setRecentTasks(updatedTasks);
        localStorage.setItem(
          "workpulse-recent-tasks",
          JSON.stringify(updatedTasks)
        );
      }
    }
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
