"use client";

import { useEffect, useState } from "react";

const DEFAULT_TIMEOUT_MS = 1500;

/**
 * Tries a custom-scheme deep link, then infers install state from visibility.
 * No backend “is installed?” API — if the tab stays visible after ~1.5s,
 * treat the app as missing / failed to open.
 *
 * @param {string | null | undefined} deepLink
 * @param {{ timeoutMs?: number; enabled?: boolean }} [options]
 * @returns {{ probing: boolean; showStoreCta: boolean }}
 */
export function useTryOpenApp(deepLink, options = {}) {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, enabled = true } = options;
  const [probing, setProbing] = useState(Boolean(enabled && deepLink));
  const [showStoreCta, setShowStoreCta] = useState(!deepLink || !enabled);

  useEffect(() => {
    if (!enabled || !deepLink) {
      setProbing(false);
      setShowStoreCta(true);
      return;
    }

    let cancelled = false;

    setProbing(true);
    setShowStoreCta(false);

    // Attempt open immediately (common web pattern without an install API).
    window.location.href = deepLink;

    const timer = window.setTimeout(() => {
      if (cancelled) return;

      setProbing(false);
      // Still in foreground → app did not take over.
      if (!document.hidden) {
        setShowStoreCta(true);
      }
    }, timeoutMs);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [deepLink, enabled, timeoutMs]);

  return { probing, showStoreCta };
}
