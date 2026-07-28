"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Removable active-filter chips with optional Clear all.
 *
 * @param {object} props
 * @param {{ id: string, label: string, onRemove: () => void, removeLabel?: string }[]} props.chips
 * @param {() => void} [props.onClearAll]
 * @param {string} [props.clearAllLabel]
 * @param {string} [props.className]
 */
export function ActiveFilterChips({
  chips = [],
  onClearAll,
  clearAllLabel,
  className,
}) {
  if (!chips.length) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {chips.map((chip) => (
        <button
          key={chip.id}
          type="button"
          onClick={chip.onRemove}
          className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/30 hover:text-primary"
        >
          <span className="truncate">{chip.label}</span>
          <X className="size-3.5 shrink-0 opacity-60" aria-hidden />
          <span className="sr-only">{chip.removeLabel ?? "Remove"}</span>
        </button>
      ))}

      {onClearAll && clearAllLabel ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs text-muted-foreground"
          onClick={onClearAll}
        >
          {clearAllLabel}
        </Button>
      ) : null}
    </div>
  );
}
