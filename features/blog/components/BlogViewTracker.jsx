"use client";

import { useEffect, useRef } from "react";

import { recordArticleView } from "@/features/blog/api/record-analytics";

/**
 * Records article view on mount (session-deduped via backend session_key).
 */
export default function BlogViewTracker({ slug }) {
  const tracked = useRef(false);

  useEffect(() => {
    if (!slug || tracked.current) return;
    tracked.current = true;

    recordArticleView(slug).catch(() => {});
  }, [slug]);

  return null;
}
