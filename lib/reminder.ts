export const playReminderSound = async (
  volume: number = 0.3
): Promise<void> => {
  try {
    // First try with Audio Context
    const AudioContext =
      window.AudioContext ||
      (
        window as Window &
          typeof globalThis & {
            webkitAudioContext?: typeof window.AudioContext;
          }
      ).webkitAudioContext;
    if (AudioContext) {
      try {
        const context = new AudioContext();
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(440, context.currentTime); // A4 note
        gainNode.gain.setValueAtTime(volume, context.currentTime);

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        oscillator.start();
        oscillator.stop(context.currentTime + 0.2); // Short gentle tone

        return;
      } catch (err) {
        console.warn("AudioContext failed, falling back to Audio API", err);
      }
    }

    // Fallback to standard Audio API
    const audio = new Audio("/audio/notification.mp3");
    audio.volume = volume;
    await audio.play();
  } catch (err) {
    console.error("Failed to play reminder sound:", err);
  }
};
