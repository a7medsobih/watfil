"use client";

import { useState } from "react";

import { getImagePlaceholder } from "@/lib/media/placeholders";
import { cn } from "@/lib/utils";

/**
 * Image with a guaranteed visual fallback.
 * - `null` / empty src renders the placeholder without hitting the network.
 * - A broken remote URL swaps to the placeholder on the first error.
 *
 * @param {object} props
 * @param {string | null} [props.src]
 * @param {string} [props.alt]
 * @param {"product" | "company" | "article"} [props.kind]
 * @param {string} [props.fallbackSrc]
 * @param {"lazy" | "eager"} [props.loading]
 * @param {string} [props.className]
 */
export default function MediaImage({
  src,
  alt = "",
  kind = "product",
  fallbackSrc,
  loading = "lazy",
  className,
  ...props
}) {
  const placeholder = fallbackSrc ?? getImagePlaceholder(kind);
  const hasRemoteSrc = typeof src === "string" && src.trim() !== "";
  const requestedSrc = hasRemoteSrc ? src : placeholder;

  const [currentSrc, setCurrentSrc] = useState(requestedSrc);
  const [trackedSrc, setTrackedSrc] = useState(requestedSrc);

  if (trackedSrc !== requestedSrc) {
    setTrackedSrc(requestedSrc);
    setCurrentSrc(requestedSrc);
  }

  const isPlaceholder = currentSrc === placeholder;

  return (
    // Backend images come from arbitrary hosts that are not configured in
    // `next.config` remotePatterns, so `next/image` cannot optimize them.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={currentSrc}
      alt={alt}
      loading={loading}
      decoding="async"
      data-placeholder={isPlaceholder ? "true" : undefined}
      onError={() => {
        if (!isPlaceholder) setCurrentSrc(placeholder);
      }}
      className={cn("h-full w-full object-cover", className)}
      {...props}
    />
  );
}
