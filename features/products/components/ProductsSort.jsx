"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DEFAULT_PRODUCT_SORT,
  PRODUCT_SORT_VALUES,
} from "@/features/filters";
import { useProductsQuery } from "@/features/products/hooks/use-products-query";
import { cn } from "@/lib/utils";

const SORT_LABEL_KEYS = {
  newest: "newest",
  price_asc: "priceAsc",
  price_desc: "priceDesc",
  popular: "popular",
};

/**
 * Catalog sort control (URL ?sort=).
 */
export default function ProductsSort({ labels, className }) {
  const { params, update } = useProductsQuery();
  const value = params.sort || DEFAULT_PRODUCT_SORT;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {labels.sortLabel ? (
        <span className="hidden text-sm text-muted-foreground sm:inline">
          {labels.sortLabel}
        </span>
      ) : null}
      <Select
        value={value}
        onValueChange={(next) =>
          update({
            sort: next === DEFAULT_PRODUCT_SORT ? DEFAULT_PRODUCT_SORT : next,
          })
        }
      >
        <SelectTrigger className="w-[min(100%,11.5rem)]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PRODUCT_SORT_VALUES.map((sortValue) => (
            <SelectItem key={sortValue} value={sortValue}>
              {labels[SORT_LABEL_KEYS[sortValue]] ?? sortValue}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
