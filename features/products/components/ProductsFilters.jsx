"use client";

import { useId } from "react";
import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProductsQuery } from "@/features/products/hooks/use-products-query";
import { cn } from "@/lib/utils";

const ALL_OPTION = "all";

function FilterGroup({ label, children }) {
  return (
    <div className="border-t border-border/60 pt-5 first:border-t-0 first:pt-0">
      <h3 className="mb-3 text-sm font-semibold text-foreground">{label}</h3>
      {children}
    </div>
  );
}

/**
 * Catalog products filters — category + governorate (companies service areas).
 */
export default function ProductsFilters({
  categories = [],
  governorates = [],
  labels,
  className,
  showHeader = true,
}) {
  const { params, update, reset } = useProductsQuery();
  const categoryGroupName = `category-${useId()}`;

  const selectedCategory = params.category_id
    ? String(params.category_id)
    : ALL_OPTION;

  const selectedGovernorate = params.governorate_id
    ? String(params.governorate_id)
    : ALL_OPTION;

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
          <div>
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

        {governorates.length > 0 && (
          <FilterGroup label={labels.governorate}>
            <Select
              value={selectedGovernorate}
              onValueChange={(value) =>
                update({
                  governorate_id: value === ALL_OPTION ? null : value,
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={labels.allGovernorates} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_OPTION}>
                  {labels.allGovernorates}
                </SelectItem>
                {governorates.map((governorate) => (
                  <SelectItem
                    key={governorate.id}
                    value={String(governorate.id)}
                  >
                    {governorate.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {labels.governorateHint && (
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {labels.governorateHint}
              </p>
            )}
          </FilterGroup>
        )}

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
