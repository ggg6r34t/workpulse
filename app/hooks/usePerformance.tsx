"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { debounce, throttle } from "@/lib/performance";

/**
 * Hook to debounce a value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook to debounce a callback function
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedCallback = useCallback(
    debounce((...args: Parameters<T>) => {
      callbackRef.current(...args);
    }, delay) as T,
    [delay]
  );

  return debouncedCallback;
}

/**
 * Hook to throttle a callback function
 */
export function useThrottledCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  limit: number
): T {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const throttledCallback = useCallback(
    throttle((...args: Parameters<T>) => {
      callbackRef.current(...args);
    }, limit) as T,
    [limit]
  );

  return throttledCallback;
}

/**
 * Hook to measure component render performance
 */
export function usePerformanceMeasure(name: string) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development" && typeof performance !== "undefined") {
      const startMark = `${name}-render-start`;
      const endMark = `${name}-render-end`;
      const measureName = `${name}-render`;

      performance.mark(startMark);

      return () => {
        performance.mark(endMark);
        performance.measure(measureName, startMark, endMark);
        const measure = performance.getEntriesByName(measureName)[0];
        if (measure) {
          console.log(`Render: ${name} took ${measure.duration.toFixed(2)}ms`);
        }
      };
    }
  }, [name]);
}

