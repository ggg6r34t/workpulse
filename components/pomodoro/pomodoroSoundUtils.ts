// Utility function for playing notification sounds with better error handling
export const playNotificationSound = (volume = 0.7): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Create audio context for more reliable playback
      const AudioContext: typeof window.AudioContext | undefined =
        window.AudioContext ||
        (
          window as typeof window & {
            webkitAudioContext: typeof window.AudioContext;
          }
        ).webkitAudioContext;

      if (!AudioContext) {
        // Fallback to traditional Audio API if AudioContext is not available
        const audio = new Audio("/audio/notification.mp3");
        audio.volume = volume;

        const playPromise = audio.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => resolve())
            .catch((error) => {
              console.error("Audio playback failed with Audio API:", error);
              reject(error);
            });
        } else {
          resolve();
        }
        return;
      }

      // Use AudioContext API for more reliable playback
      fetch("/audio/notification.mp3")
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => {
          const audioContext = new AudioContext();
          return audioContext.decodeAudioData(arrayBuffer);
        })
        .then((audioBuffer) => {
          const audioContext = new AudioContext();
          const source = audioContext.createBufferSource();
          source.buffer = audioBuffer;
          const gainNode = audioContext.createGain();
          gainNode.gain.value = volume;
          source.connect(gainNode);
          gainNode.connect(audioContext.destination);
          source.start(0);
          source.onended = () => resolve();
        })
        .catch((error) => {
          console.error(
            "Failed to load or play audio with AudioContext:",
            error
          );
          // Fallback to traditional Audio API
          const audio = new Audio("/audio/notification.mp3");
          audio.volume = volume;
          audio
            .play()
            .then(() => resolve())
            .catch((err) => {
              console.error("Both audio playback methods failed:", err);
              reject(err);
            });
        });
    } catch (error) {
      console.error("Error creating audio:", error);
      reject(error);
    }
  });
};
