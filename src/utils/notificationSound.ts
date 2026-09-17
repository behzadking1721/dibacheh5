/**
 * Notification Sound & Web Audio Chime synthesizer
 * Lightweight, zero-dependency, works offline
 */

export const playReminderChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Harmonic bell chord: F5 (698.46Hz), A5 (880Hz), C6 (1046.5Hz)
    const notes = [698.46, 880, 1046.5];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);

      // Smooth attack and natural exponential decay
      gain.gain.setValueAtTime(0.0001, now + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.12, now + idx * 0.09 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.09 + 0.85);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.9);
    });
  } catch {
    // AudioContext blocked or unsupported in current environment
  }
};

/**
 * Trigger native browser notification if granted
 */
export const triggerBrowserNotification = (
  title: string,
  options?: NotificationOptions & { onClick?: () => void }
) => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    try {
      const notification = new Notification(title, {
        icon: '/public/icon.svg',
        badge: '/public/icon.svg',
        lang: 'fa',
        dir: 'rtl',
        ...options,
      });

      if (options?.onClick) {
        notification.onclick = () => {
          window.focus();
          options.onClick?.();
          notification.close();
        };
      }
      return true;
    } catch {
      return false;
    }
  }

  return false;
};
