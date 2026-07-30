"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setGovernoratePreferenceClient } from "@/features/governorate";
import { useRouter } from "@/i18n/navigation";
import { buildProductDetailHref } from "@/features/products/utils/resolve-product-detail-params";

/**
 * Governorate dropdown for product offering companies.
 * Uses the same Select primitive as product filters for UI consistency.
 * Selection updates the URL (same as previous tabs) — no client fetch.
 */
export default function ProductGovernorateSelect({
  productId,
  governorates = [],
  selectedId,
  ariaLabel,
  label,
  className,
}) {
  const router = useRouter();

  if (!governorates.length) return null;

  const value =
    selectedId != null && selectedId !== ""
      ? String(selectedId)
      : String(governorates[0]?.id ?? "");

  return (
    <div className={className}>
      {label ? (
        <label
          htmlFor="product-governorate-select"
          className="mb-2 block text-sm font-semibold text-foreground"
        >
          {label}
        </label>
      ) : null}
      <Select
        value={value}
        onValueChange={(next) => {
          setGovernoratePreferenceClient(next);
          router.push(
            buildProductDetailHref(productId, { governorate: next }),
          );
        }}
      >
        <SelectTrigger
          id="product-governorate-select"
          className="w-full max-w-sm"
          aria-label={ariaLabel}
        >
          <SelectValue placeholder={ariaLabel} />
        </SelectTrigger>
        <SelectContent>
          {governorates.map((governorate) => (
            <SelectItem key={governorate.id} value={String(governorate.id)}>
              {governorate.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
