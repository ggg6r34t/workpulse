import React, { useState, useEffect } from "react";
import { TimerIcon } from "lucide-react";
import { formatDuration } from "@/lib/time";
import { playNotificationSound } from "./pomodoroSoundUtils";
import { toast } from "@/app/hooks/useToast";
import { PomodoroTimerSettings } from "./PomodoroTimerSettings";
import { PomodoroTimerDisplay } from "./PomodoroTimerDisplay";
import { PomodoroTimerControls } from "./PomodoroTimerControls";

export const DEFAULT_WORK_MINUTES = 25;
export const DEFAULT_BREAK_MINUTES = 5;

export type TimerMode = "work" | "break";

const PomodoroTimer: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mode, setMode] = useState<TimerMode>("work");
  const [secondsRemaining, setSecondsRemaining] = useState(
    DEFAULT_WORK_MINUTES * 60
  );
  const [workDuration, setWorkDuration] = useState(DEFAULT_WORK_MINUTES);
  const [breakDuration, setBreakDuration] = useState(DEFAULT_BREAK_MINUTES);
  const [cycles, setCycles] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [audioInitialized, setAudioInitialized] = useState(false);

  // Initialize audio context on first user interaction
  useEffect(() => {
    const initializeAudio = () => {
      if (!audioInitialized) {
        try {
          // Create a silent audio context to initialize audio on user interaction
          const AudioContext: typeof window.AudioContext | undefined =
            window.AudioContext ||
            (
              window as typeof window & {
                webkitAudioContext?: typeof window.AudioContext;
              }
            ).webkitAudioContext;
          if (AudioContext) {
            const audioContext = new AudioContext();
            // Create and immediately stop a silent oscillator
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            gainNode.gain.value = 0.001; // Nearly silent
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.start(0);
            oscillator.stop(0.1);

            setAudioInitialized(true);
            console.log("Audio context initialized successfully");
          }
        } catch (err) {
          console.error("Failed to initialize audio context:", err);
        }
      }
    };

    // Add event listeners for user interactions that can initialize audio
    const interactions = ["click", "touchstart", "keydown"];

    interactions.forEach((event) => {
      window.addEventListener(event, initializeAudio, { once: true });
    });

    return () => {
      interactions.forEach((event) => {
        window.removeEventListener(event, initializeAudio);
      });
    };
  }, [audioInitialized]);

  // Calculate progress percentage for the progress bar
  const progressPercent =
    mode === "work"
      ? ((workDuration * 60 - secondsRemaining) / (workDuration * 60)) * 100
      : ((breakDuration * 60 - secondsRemaining) / (breakDuration * 60)) * 100;

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setSecondsRemaining((seconds) => {
          if (seconds <= 1) {
            clearInterval(interval!);
            const nextMode = mode === "work" ? "break" : "work";
            const nextDuration =
              nextMode === "work" ? workDuration * 60 : breakDuration * 60;

            // Play sound when timer completes using the improved function
            if (soundEnabled) {
              playNotificationSound()
                .then(() => {
                  console.log("Notification sound played successfully");
                })
                .catch((error) => {
                  console.error("Audio play error:", error);
                  // Show fallback notification when audio fails
                  toast({
                    title: "Sound failed to play",
                    description: "Check your browser permissions for audio",
                    variant: "error",
                  });
                });
            }

            // Show toast notification
            toast({
              title: `${mode === "work" ? "Work session" : "Break"} complete!`,
              description: `Time for a ${
                nextMode === "work" ? "work session" : "break"
              }.`,
            });

            // Also use the regular toast for more visibility
            toast({
              title: `${mode === "work" ? "Work session" : "Break"} complete!`,
              description: `Time for a ${
                nextMode === "work" ? "work session" : "break"
              }.`,
            });

            // Update cycles
            if (nextMode === "work") {
              setCycles((c) => c + 1);
            }

            setMode(nextMode);
            setSecondsRemaining(nextDuration);
            return nextDuration;
          }
          return seconds - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, mode, workDuration, breakDuration, soundEnabled]);

  // Format time for display
  const displayTime = () => formatDuration(secondsRemaining * 1000);

  // Handle starting the timer
  const startTimer = () => {
    // Initialize audio if not already done when starting timer
    if (!audioInitialized) {
      try {
        const AudioContext: typeof window.AudioContext | undefined =
          window.AudioContext ||
          (
            window as typeof window & {
              webkitAudioContext?: typeof AudioContext;
            }
          ).webkitAudioContext;
        if (AudioContext) {
          const audioContext = new AudioContext();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          gainNode.gain.value = 0.001; // Nearly silent
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          oscillator.start(0);
          oscillator.stop(0.1);
          setAudioInitialized(true);
        }
      } catch (err) {
        console.error(
          "Failed to initialize audio context on timer start:",
          err
        );
      }
    }

    setIsActive(true);
    setIsPaused(false);
  };

  // Handle pausing the timer
  const pauseTimer = () => {
    setIsPaused(true);
  };

  // Handle resuming the timer
  const resumeTimer = () => {
    setIsPaused(false);
  };

  // Handle resetting the timer
  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setMode("work");
    setSecondsRemaining(workDuration * 60);
    setCycles(0);
  };

  // Toggle sound
  const toggleSound = () => {
    // If enabling sound, make sure audio is initialized
    if (!soundEnabled && !audioInitialized) {
      try {
        const AudioContext: typeof window.AudioContext | undefined =
          window.AudioContext ||
          (
            window as typeof window & {
              webkitAudioContext?: typeof AudioContext;
            }
          ).webkitAudioContext;
        if (AudioContext) {
          const audioContext = new AudioContext();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          gainNode.gain.value = 0.001; // Nearly silent
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          oscillator.start(0);
          oscillator.stop(0.1);
          setAudioInitialized(true);
        }
      } catch (err) {
        console.error(
          "Failed to initialize audio context on sound toggle:",
          err
        );
      }
    }

    setSoundEnabled(!soundEnabled);
    toast({
      title: soundEnabled ? "Sound disabled" : "Sound enabled",
      description: soundEnabled
        ? "You won't hear timer notifications"
        : "You'll hear timer notifications",
    });
  };

  // Get background and text colors based on mode
  // const getModeStyles = () => {
  //   if (!isActive) return "bg-secondary";
  //   return mode === "work"
  //     ? "bg-gradient-to-r from-blue-500/10 to-primary/10 border-primary/20"
  //     : "bg-gradient-to-r from-green-500/10 to-emerald-400/10 border-green-400/20";
  // };

  // Test sound function
  const testSound = () => {
    // Initialize audio context if needed
    if (!audioInitialized) {
      try {
        const AudioContext: typeof window.AudioContext | undefined =
          window.AudioContext ||
          (
            window as typeof window & {
              webkitAudioContext?: typeof window.AudioContext;
            }
          ).webkitAudioContext;
        if (AudioContext) {
          const audioContext = new AudioContext();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          gainNode.gain.value = 0.001; // Nearly silent
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          oscillator.start(0);
          oscillator.stop(0.1);
          setAudioInitialized(true);
        }
      } catch (err) {
        console.error("Failed to initialize audio context on test sound:", err);
      }
    }

    playNotificationSound()
      .then(() => {
        console.log("Test sound played successfully");
        toast({
          title: "Testing sound",
          description: "You should hear a notification sound",
        });
      })
      .catch((err) => {
        console.error("Error playing test sound:", err);
        toast({
          title: "Sound failed to play",
          description: "Check your browser permissions for audio",
          variant: "error",
        });
      });
  };

  return (
    <div className={`bg-card rounded-xl p-4 transition-colors`}>
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-2">
          <TimerIcon
            className={`h-5 w-5 ${
              mode === "work" ? "text-primary" : "text-green-500"
            }`}
          />
          <h3 className="text-lg font-medium">
            {mode === "work" ? "Focus Time" : "Break Time"}
          </h3>

          <PomodoroTimerSettings
            workDuration={workDuration}
            breakDuration={breakDuration}
            onWorkDurationChange={setWorkDuration}
            onBreakDurationChange={setBreakDuration}
            testSound={testSound}
          />
        </div>

        <PomodoroTimerDisplay
          displayTime={displayTime()}
          progressPercent={progressPercent}
          mode={mode}
        />

        <PomodoroTimerControls
          isActive={isActive}
          isPaused={isPaused}
          soundEnabled={soundEnabled}
          onStart={startTimer}
          onPause={pauseTimer}
          onResume={resumeTimer}
          onReset={resetTimer}
          onToggleSound={toggleSound}
        />

        {cycles > 0 && (
          <div className="text-sm text-muted-foreground">
            {cycles} {cycles === 1 ? "cycle" : "cycles"} completed
          </div>
        )}
      </div>
    </div>
  );
};

export default PomodoroTimer;
