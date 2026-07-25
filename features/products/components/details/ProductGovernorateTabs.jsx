"use client";

import GovernorateTabs from "@/features/companies/components/GovernorateTabs";
import { buildProductDetailHref } from "@/features/products/utils/resolve-product-detail-params";

/**
 * Client wrapper so hrefBuilder stays on the client boundary.
 */
export default function ProductGovernorateTabs({
  productSlug,
  governorates = [],
  selectedId,
  ariaLabel,
  labels = {},
  className,
}) {
  return (
    <GovernorateTabs
      className={className}
      governorates={governorates}
      selectedId={selectedId}
      ariaLabel={ariaLabel}
      labels={labels}
      hrefBuilder={(governorateId) =>
        buildProductDetailHref(productSlug, { governorate: governorateId })
      }
    />
  );
}
