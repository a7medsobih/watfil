"use client";

import { useEffect, useId, useState } from "react";
import { MapPin, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RangeSlider } from "@/components/ui/range-slider";
import { useProductsQuery } from "@/features/products/hooks/use-products-query";
import {
  PRICE_MAX,
  PRICE_MIN,
  PRICE_STEP,
} from "@/features/products/utils/resolve-products-params";
import { cn } from "@/lib/utils";

function FilterGroup({ label, children }) {
  return (
    <div className="border-t border-border/60 pt-5 first:border-t-0 first:pt-0">
      <h3 className="mb-3 text-sm font-semibold text-foreground">{label}</h3>
      {children}
    </div>
  );
}

/**
 * Shared products filters (desktop aside + mobile sheet).
 */
export default function ProductsFilters({
  categories = [],
  governorates = [],
  labels,
  currency,
  className,
  showHeader = true,
}) {
  const { params, update, reset } = useProductsQuery();
  const categoryGroupName = `category-${useId()}`;

  const selectedCategory = params.category_id
    ? String(params.category_id)
    : "all";
  const selectedGovernorate = params.governorate_id
    ? String(params.governorate_id)
    : "all";

  const [price, setPrice] = useState([
    params.min_price ?? PRICE_MIN,
    params.max_price ?? PRICE_MAX,
  ]);

  useEffect(() => {
    setPrice([
      params.min_price ?? PRICE_MIN,
      params.max_price ?? PRICE_MAX,
    ]);
  }, [params.min_price, params.max_price]);

  const commitPrice = (next) => {
    const [min, max] = next;
    update({
      min_price: min <= PRICE_MIN ? null : min,
      max_price: max >= PRICE_MAX ? null : max,
    });
  };

  return (
    <aside
      className={cn(
        "h-fit rounded-3xl border border-border/60 bg-card p-6 lg:sticky lg:top-24",
        className,
      )}
    >
      {showHeader && (
        <div className="mb-5 flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <h2 className="font-bold">{labels.filters}</h2>
        </div>
      )}

      <div className="space-y-5">
        <FilterGroup label={labels.category}>
          <div >
            <label
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-2xl border px-3 py-2 text-sm transition-colors",
                selectedCategory === "all"
                  ? "border-primary/30 text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "grid size-4 place-items-center rounded-full border",
                  selectedCategory === "all"
                    ? "border-primary"
                    : "border-border",
                )}
              >
                <span
                  className={cn(
                    "size-2 rounded-full bg-primary transition-opacity",
                    selectedCategory === "all" ? "opacity-100" : "opacity-0",
                  )}
                />
              </span>
              <input
                type="radio"
                name={categoryGroupName}
                className="sr-only"
                checked={selectedCategory === "all"}
                onChange={() => update({ category_id: null })}
              />
              <span>{labels.all}</span>
            </label>

            {categories.map((category) => {
              const isActive = selectedCategory === String(category.id);

              return (
                <label
                  key={category.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm transition-colors",
                    isActive
                      ? "border-primary/30 text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-4 place-items-center rounded-full border",
                      isActive ? "border-primary" : "border-border",
                    )}
                  >
                    <span
                      className={cn(
                        "size-2 rounded-full bg-primary transition-opacity",
                        isActive ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </span>
                  <input
                    type="radio"
                    name={categoryGroupName}
                    className="sr-only"
                    checked={isActive}
                    onChange={() => update({ category_id: category.id })}
                  />
                  <span className="capitalize">{category.name}</span>
                </label>
              );
            })}
          </div>
        </FilterGroup>

        <FilterGroup label={labels.price}>
          <RangeSlider
            value={price}
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={PRICE_STEP}
            onValueChange={(value) => setPrice(value)}
            onValueCommit={commitPrice}
          />
          <div className="mt-3 flex justify-between text-xs text-muted-foreground">
            <span>
              {price[0].toLocaleString()} {currency}
            </span>
            <span>
              {price[1].toLocaleString()} {currency}
            </span>
          </div>
        </FilterGroup>

        <FilterGroup label={labels.governorate}>
          <Select
            value={selectedGovernorate}
            onValueChange={(value) =>
              update({
                governorate_id: value === "all" ? null : value,
              })
            }
          >
            <SelectTrigger
              aria-label={labels.governorate}
              className="h-11 w-full rounded-2xl border-border/60 bg-muted/60 px-3.5 text-sm shadow-none hover:bg-muted focus-visible:border-primary/40 focus-visible:ring-primary/20"
            >
              <span className="flex min-w-0 flex-1 items-center gap-2">
                <MapPin className="size-4 shrink-0 text-primary" />
                <SelectValue placeholder={labels.allGovernorates} />
              </span>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-border/60 p-1 shadow-card">
              <SelectItem
                value="all"
                className="rounded-xl py-2.5 pe-8 focus:bg-primary/10 focus:text-foreground"
              >
                {labels.allGovernorates}
              </SelectItem>
              {governorates.map((governorate) => (
                <SelectItem
                  key={governorate.id}
                  value={String(governorate.id)}
                  className="rounded-xl py-2.5 pe-8 focus:bg-primary/10 focus:text-foreground"
                >
                  {governorate.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterGroup>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={reset}
        >
          {labels.reset}
        </Button>
      </div>
    </aside>
  );
}
