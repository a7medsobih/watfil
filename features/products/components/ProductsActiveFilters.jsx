"use client";

import { useMemo } from "react";

import {
  ActiveFilterChips,
  PRICE_MAX,
  PRICE_MIN,
  hasActiveProductFilters,
} from "@/features/filters";
import { useProductsQuery } from "@/features/products/hooks/use-products-query";

/**
 * Active filter chips above the products grid.
 */
export default function ProductsActiveFilters({
  productTypes = [],
  parentCategories = [],
  childCategories = [],
  governorates = [],
  labels,
  locale = "ar",
}) {
  const { params, update, reset } = useProductsQuery({ productTypes });
  const currencyLabel = locale === "ar" ? "ج.م" : "EGP";

  const chips = useMemo(() => {
    if (!hasActiveProductFilters(params)) return [];

    const next = [];
    const removeLabel = labels.removeFilter;

    if (params.search) {
      next.push({
        id: "search",
        label: `${labels.search}: ${params.search}`,
        removeLabel,
        onRemove: () => update({ search: null }),
      });
    }

    if (params.product_type_id) {
      const type = productTypes.find(
        (item) => String(item.id) === String(params.product_type_id),
      );
      next.push({
        id: "product_type_id",
        label: `${labels.productType}: ${type?.label ?? params.product_type_id}`,
        removeLabel,
        onRemove: () => update({ product_type_id: null }),
      });
    }

    if (params.parent_category_id) {
      const parent = parentCategories.find(
        (item) => String(item.id) === String(params.parent_category_id),
      );
      next.push({
        id: "parent_category_id",
        label: `${labels.parentCategory}: ${parent?.name ?? params.parent_category_id}`,
        removeLabel,
        onRemove: () => update({ parent_category_id: null }),
      });
    }

    if (params.category_id) {
      const category = childCategories.find(
        (item) => String(item.id) === String(params.category_id),
      );
      next.push({
        id: "category_id",
        label: `${labels.category}: ${category?.name ?? params.category_id}`,
        removeLabel,
        onRemove: () => update({ category_id: null }),
      });
    }

    if (params.number_of_stages) {
      next.push({
        id: "number_of_stages",
        label: `${labels.stages}: ${params.number_of_stages}`,
        removeLabel,
        onRemove: () => update({ number_of_stages: null }),
      });
    }

    if (
      (params.min_price != null && Number(params.min_price) > PRICE_MIN) ||
      (params.max_price != null && Number(params.max_price) < PRICE_MAX)
    ) {
      const min =
        params.min_price != null ? Number(params.min_price) : PRICE_MIN;
      const max =
        params.max_price != null ? Number(params.max_price) : PRICE_MAX;
      next.push({
        id: "price",
        label: `${labels.price}: ${min.toLocaleString()} – ${max.toLocaleString()} ${currencyLabel}`,
        removeLabel,
        onRemove: () => update({ min_price: null, max_price: null }),
      });
    }

    if (params.governorate_id) {
      const governorate = governorates.find(
        (item) => String(item.id) === String(params.governorate_id),
      );
      next.push({
        id: "governorate_id",
        label: `${labels.governorate}: ${governorate?.name ?? params.governorate_id}`,
        removeLabel,
        onRemove: () => update({ governorate_id: null }),
      });
    }

    if (params.source) {
      const sourceLabel =
        params.source === "catalog"
          ? (labels.sourceCatalog ?? params.source)
          : (labels.sourceCompany ?? params.source);
      next.push({
        id: "source",
        label: `${labels.source ?? "Source"}: ${sourceLabel}`,
        removeLabel,
        onRemove: () => update({ source: null }),
      });
    }

    if (params.sort && params.sort !== "newest") {
      const sortLabels = {
        price_asc: labels.sortPriceAsc,
        price_desc: labels.sortPriceDesc,
        popular: labels.sortPopular,
      };
      next.push({
        id: "sort",
        label: `${labels.sort}: ${sortLabels[params.sort] ?? params.sort}`,
        removeLabel,
        onRemove: () => update({ sort: "newest" }),
      });
    }

    return next;
  }, [
    params,
    productTypes,
    parentCategories,
    childCategories,
    governorates,
    labels,
    currencyLabel,
    update,
  ]);

  if (!chips.length) return null;

  return (
    <ActiveFilterChips
      chips={chips}
      onClearAll={reset}
      clearAllLabel={labels.clearAll}
      className="mb-5"
    />
  );
}
