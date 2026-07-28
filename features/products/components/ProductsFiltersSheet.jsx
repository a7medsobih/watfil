"use client";

import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ProductsFilters from "@/features/products/components/ProductsFilters";

/**
 * Mobile/tablet filters trigger + sheet. Reuses ProductsFilters.
 */
export default function ProductsFiltersSheet({
  productTypes,
  parentCategories,
  childCategories,
  governorates,
  stageOptions,
  labels,
  locale,
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="lg:hidden">
          <SlidersHorizontal className="h-4 w-4" />
          {labels.filters}
        </Button>
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="max-h-[85vh] overflow-y-auto rounded-t-3xl p-0"
      >
        <SheetHeader className="border-b border-border/60">
          <SheetTitle>{labels.filters}</SheetTitle>
        </SheetHeader>

        <div className="p-4">
          <ProductsFilters
            productTypes={productTypes}
            parentCategories={parentCategories}
            childCategories={childCategories}
            governorates={governorates}
            stageOptions={stageOptions}
            labels={labels}
            locale={locale}
            showHeader={false}
            className="border-0 p-0 shadow-none lg:static"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
