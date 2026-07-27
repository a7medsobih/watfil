"use client";

import { useCallback } from "react";

import { recordArticleLinkClick } from "@/features/blog/api/record-analytics";
import { cn } from "@/lib/utils";

/**
 * Renders article HTML and tracks outbound link clicks for analytics.
 */
export default function BlogArticleContent({ html, slug, className }) {
  const handleClick = useCallback(
    (event) => {
      const anchor = event.target.closest("a");
      if (!anchor || !slug) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      recordArticleLinkClick(slug, href).catch(() => {});
    },
    [slug],
  );

  if (!html) return null;

  return (
    <div
      className={cn("article-content", className)}
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
