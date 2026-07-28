"use client";

import { useId, useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DEFAULT_FILTER_STAGES,
  FilterChipGroup,
  FilterGroup,
  FilterRadioOption,
  PRICE_MAX,
  PRICE_MIN,
  PriceRangeFilter,
  collectStageOptions,
} from "@/features/filters";
import { useProductsQuery } from "@/features/products/hooks/use-products-query";
import { isFiltersProductType } from "@/features/taxonomy";
import { cn } from "@/lib/utils";

const ALL_OPTION = "all";

/**
 * Catalog products filters — taxonomy cascade + price + governorate.
 */
export default function ProductsFilters({
  productTypes = [],
  parentCategories = [],
  childCategories = [],
  governorates = [],
  stageOptions,
  labels,
  locale = "ar",
  className,
  showHeader = true,
}) {
  const { params, update, reset } = useProductsQuery({ productTypes });
  const typeGroupName = `product-type-${useId()}`;
  const parentGroupName = `parent-category-${useId()}`;
  const categoryGroupName = `category-${useId()}`;

  const selectedType = productTypes.find(
    (type) => String(type.id) === String(params.product_type_id),
  );
  const showStages = isFiltersProductType(selectedType);

  const stages = useMemo(() => {
    if (Array.isArray(stageOptions) && stageOptions.length > 0) {
      return stageOptions;
    }
    const fromTaxonomy = collectStageOptions(parentCategories, childCategories);
    return fromTaxonomy.length > 0 ? fromTaxonomy : [...DEFAULT_FILTER_STAGES];
  }, [stageOptions, parentCategories, childCategories]);

  const currencyLabel = locale === "ar" ? "ج.م" : "EGP";

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
        {productTypes.length > 0 && (
          <FilterGroup label={labels.productType}>
            <div>
              <FilterRadioOption
                name={typeGroupName}
                checked={!params.product_type_id}
                onChange={() => update({ product_type_id: null })}
                label={labels.all}
              />
              {productTypes.map((type) => (
                <FilterRadioOption
                  key={type.id}
                  name={typeGroupName}
                  checked={String(params.product_type_id) === String(type.id)}
                  onChange={() => update({ product_type_id: type.id })}
                  label={type.label}
                />
              ))}
            </div>
          </FilterGroup>
        )}

        {params.product_type_id && parentCategories.length > 0 && (
          <FilterGroup label={labels.parentCategory}>
            <div>
              <FilterRadioOption
                name={parentGroupName}
                checked={!params.parent_category_id}
                onChange={() => update({ parent_category_id: null })}
                label={labels.all}
              />
              {parentCategories.map((category) => (
                <FilterRadioOption
                  key={category.id}
                  name={parentGroupName}
                  checked={
                    String(params.parent_category_id) === String(category.id)
                  }
                  onChange={() => update({ parent_category_id: category.id })}
                  label={category.name}
                />
              ))}
            </div>
          </FilterGroup>
        )}

        {params.parent_category_id && childCategories.length > 0 && (
          <FilterGroup label={labels.category}>
            <div>
              <FilterRadioOption
                name={categoryGroupName}
                checked={!params.category_id}
                onChange={() => update({ category_id: null })}
                label={labels.all}
              />
              {childCategories.map((category) => (
                <FilterRadioOption
                  key={category.id}
                  name={categoryGroupName}
                  checked={String(params.category_id) === String(category.id)}
                  onChange={() => update({ category_id: category.id })}
                  label={category.name}
                />
              ))}
            </div>
          </FilterGroup>
        )}

        {showStages && (
          <FilterGroup label={labels.stages}>
            <FilterChipGroup
              options={stages.map((stage) => ({
                id: stage,
                label: String(stage),
              }))}
              value={params.number_of_stages}
              onChange={(value) =>
                update({
                  number_of_stages: value == null ? null : value,
                })
              }
              allLabel={labels.all}
              getOptionValue={(option) => option.id}
              getOptionLabel={(option) => option.label}
            />
          </FilterGroup>
        )}

        <FilterGroup label={labels.price}>
          <PriceRangeFilter
            min={PRICE_MIN}
            max={PRICE_MAX}
            minValue={params.min_price}
            maxValue={params.max_price}
            currencyLabel={currencyLabel}
            onChange={(range) => update(range)}
          />
        </FilterGroup>

        {governorates.length > 0 && (
          <FilterGroup label={labels.governorate}>
            <Select
              value={
                params.governorate_id
                  ? String(params.governorate_id)
                  : ALL_OPTION
              }
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
