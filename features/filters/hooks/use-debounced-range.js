"use client";

import { useEffect, useState } from "react";

/**
 * Keeps a local range in sync with controlled value and commits after debounce.
 *
 * @param {[number, number]} value
 * @param {(next: [number, number]) => void} onCommit
 * @param {number} [delay]
 */
export function useDebouncedRange(value, onCommit, delay = 350) {
  const [local, setLocal] = useState(value);
  const min = value[0];
  const max = value[1];

  useEffect(() => {
    setLocal([min, max]);
  }, [min, max]);

  useEffect(() => {
    if (local[0] === min && local[1] === max) return undefined;

    const timer = setTimeout(() => {
      onCommit(local);
    }, delay);

    return () => clearTimeout(timer);
  }, [local, min, max, onCommit, delay]);

  return [local, setLocal];
}
