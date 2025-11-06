// Performance utilities for WorkPulse

/**
 * Debounce function to limit how often a function can be called
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit function execution rate
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Check if localStorage is available and has space
 */
export function isStorageAvailable(): boolean {
  try {
    if (typeof window === "undefined") return false;
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get storage quota information
 */
export async function getStorageQuota(): Promise<{
  used: number;
  available: number;
  percentage: number;
} | null> {
  if (typeof navigator === "undefined" || !navigator.storage?.estimate) {
    return null;
  }

  try {
    const estimate = await navigator.storage.estimate();
    const used = estimate.usage || 0;
    const quota = estimate.quota || 0;
    const percentage = quota > 0 ? (used / quota) * 100 : 0;

    return {
      used,
      available: quota - used,
      percentage,
    };
  } catch (error) {
    console.error("Error getting storage quota:", error);
    return null;
  }
}

/**
 * Batch localStorage operations for better performance
 */
export class StorageBatcher {
  private queue: Array<{ key: string; value: string }> = [];
  private timeout: NodeJS.Timeout | null = null;
  private readonly batchDelay = 100; // 100ms

  setItem(key: string, value: string): void {
    this.queue.push({ key, value });

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      this.flush();
    }, this.batchDelay);
  }

  flush(): void {
    if (this.queue.length === 0) return;

    try {
      this.queue.forEach(({ key, value }) => {
        localStorage.setItem(key, value);
      });
      this.queue = [];
    } catch (error) {
      console.error("Error flushing storage batch:", error);
    }

    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }
}

/**
 * Lazy load images with intersection observer
 */
export function lazyLoadImage(
  img: HTMLImageElement,
  src: string,
  placeholder?: string
): () => void {
  if (placeholder) {
    img.src = placeholder;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          img.src = src;
          observer.unobserve(img);
        }
      });
    },
    { rootMargin: "50px" }
  );

  observer.observe(img);

  return () => observer.unobserve(img);
}

/**
 * Preload critical resources
 */
export function preloadResource(href: string, as: string): void {
  if (typeof document === "undefined") return;

  const link = document.createElement("link");
  link.rel = "preload";
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
}

/**
 * Measure performance metrics
 */
export function measurePerformance(name: string, fn: () => void): void {
  if (typeof performance === "undefined" || !performance.mark) return;

  const startMark = `${name}-start`;
  const endMark = `${name}-end`;
  const measureName = `${name}-measure`;

  performance.mark(startMark);
  fn();
  performance.mark(endMark);
  performance.measure(measureName, startMark, endMark);

  const measure = performance.getEntriesByName(measureName)[0];
  if (process.env.NODE_ENV === "development") {
    console.log(`Performance: ${name} took ${measure.duration.toFixed(2)}ms`);
  }
}

/**
 * Request idle callback with fallback
 */
export function requestIdleCallback(
  callback: () => void,
  options?: { timeout?: number }
): number | NodeJS.Timeout {
  if (typeof window === "undefined") {
    return setTimeout(callback, 0);
  }

  if ("requestIdleCallback" in window) {
    return window.requestIdleCallback(callback, options) as unknown as
      | number
      | NodeJS.Timeout;
  }

  // Fallback for browsers without requestIdleCallback
  return setTimeout(callback, options?.timeout || 1);
}

/**
 * Cancel idle callback with fallback
 */
export function cancelIdleCallback(id: number | NodeJS.Timeout): void {
  if (typeof window === "undefined") return;

  if ("cancelIdleCallback" in window) {
    (
      window as Window & { cancelIdleCallback: (handle: number) => void }
    ).cancelIdleCallback(id as number);
  } else {
    clearTimeout(id as NodeJS.Timeout);
  }
}
