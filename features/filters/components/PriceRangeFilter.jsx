"use client";

import { useCallback } from "react";

import { RangeSlider } from "@/components/ui/range-slider";
import {
  PRICE_MAX,
  PRICE_MIN,
  PRICE_STEP,
} from "@/features/filters/constants";
import { useDebouncedRange } from "@/features/filters/hooks/use-debounced-range";
import { cn } from "@/lib/utils";

/**
 * Debounced min/max price slider for catalog browse.
 */
export function PriceRangeFilter({
  min = PRICE_MIN,
  max = PRICE_MAX,
  step = PRICE_STEP,
  minValue,
  maxValue,
  onChange,
  currencyLabel = "EGP",
  className,
}) {
  const resolvedMin = minValue != null ? Number(minValue) : min;
  const resolvedMax = maxValue != null ? Number(maxValue) : max;

  const handleCommit = useCallback(
    ([nextMin, nextMax]) => {
      onChange?.({
        min_price: nextMin <= min ? null : nextMin,
        max_price: nextMax >= max ? null : nextMax,
      });
    },
    [onChange, min, max],
  );

  const [local, setLocal] = useDebouncedRange(
    [resolvedMin, resolvedMax],
    handleCommit,
  );

  return (
    <div className={cn("space-y-4", className)}>
      <RangeSlider
        min={min}
        max={max}
        step={step}
        value={local}
        onValueChange={(next) => {
          if (!Array.isArray(next) || next.length < 2) return;
          setLocal([Number(next[0]), Number(next[1])]);
        }}
        aria-label="Price range"
      />

      <div className="flex items-center justify-between gap-3 text-xs tabular-nums text-muted-foreground">
        <span>
          {local[0].toLocaleString()} {currencyLabel}
        </span>
        <span>
          {local[1].toLocaleString()} {currencyLabel}
        </span>
      </div>
    </div>
  );
}
