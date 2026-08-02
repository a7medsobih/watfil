"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Animated tabular views counter — pulses lightly when the value increases.
 */
export default function ViewsCount({
  value = 0,
  className,
  numberClassName,
}) {
  const count = Number(value) || 0;
  const [meta, setMeta] = useState({ count, bump: false });

  if (count !== meta.count) {
    setMeta({ count, bump: count > meta.count });
  }

  return (
    <span
      className={cn(
        "inline-flex origin-center tabular-nums transition-transform duration-300",
        numberClassName,
        className,
        meta.bump && "scale-110 text-primary",
      )}
      onTransitionEnd={() => {
        if (meta.bump) setMeta((current) => ({ ...current, bump: false }));
      }}
    >
      {count.toLocaleString()}
    </span>
  );
}
