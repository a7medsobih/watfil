"use client";

import { useEffect } from "react";

import ErrorState from "@/components/common/ErrorState";

/**
 * Shared client error UI for route `error.js` files.
 * Always logs the real error so Vercel Function Logs show the cause.
 *
 * @param {object} props
 * @param {Error} props.error
 * @param {() => void} props.reset
 * @param {string} [props.scope] - Log label, e.g. `blog/[slug]`
 * @param {string} [props.className]
 */
export default function RouteError({ error, reset, scope = "route", className }) {
  useEffect(() => {
    console.error(`[${scope} error boundary]`, error);
  }, [error, scope]);

  return (
    <section
      className={
        className ??
        "container flex min-h-[40vh] items-center justify-center py-16 md:py-20"
      }
    >
      <ErrorState onRetry={reset} />
    </section>
  );
}
