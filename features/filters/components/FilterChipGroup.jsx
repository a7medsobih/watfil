"use client";

import { cn } from "@/lib/utils";

/**
 * Chip / pill toggle group (product type, stages, etc.).
 */
export function FilterChipGroup({
  options = [],
  value,
  onChange,
  allLabel,
  allValue = null,
  className,
  getOptionValue = (option) => option.id,
  getOptionLabel = (option) => option.label ?? option.name,
}) {
  const selected = value == null || value === "" ? allValue : value;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {allLabel != null && (
        <button
          type="button"
          onClick={() => onChange(allValue)}
          className={cn(
            "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
            selected == null || selected === allValue
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-border/60 text-muted-foreground hover:border-primary/30 hover:text-foreground",
          )}
        >
          {allLabel}
        </button>
      )}

      {options.map((option) => {
        const optionValue = getOptionValue(option);
        const isActive = String(selected) === String(optionValue);

        return (
          <button
            key={String(optionValue)}
            type="button"
            onClick={() => onChange(optionValue)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-colors",
              isActive
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border/60 text-muted-foreground hover:border-primary/30 hover:text-foreground",
            )}
          >
            {getOptionLabel(option)}
          </button>
        );
      })}
    </div>
  );
}
