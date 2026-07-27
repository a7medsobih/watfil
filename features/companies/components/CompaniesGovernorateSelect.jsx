"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCompaniesQuery } from "@/features/companies/hooks/use-companies-query";

const ALL_OPTION = "all";

/**
 * Governorate Select for the companies list — same Select as product filters.
 * "All governorates" omits governorate_id (top-rated / list across Egypt).
 */
export default function CompaniesGovernorateSelect({
  governorates = [],
  selectedId,
  ariaLabel,
  label,
  allLabel,
  allowAll = true,
  className,
}) {
  const { update } = useCompaniesQuery();

  if (!governorates.length) return null;

  const value =
    selectedId != null && selectedId !== ""
      ? String(selectedId)
      : ALL_OPTION;

  return (
    <div className={className}>
      {label ? (
        <label
          htmlFor="companies-governorate-select"
          className="mb-2 block text-sm font-semibold text-foreground"
        >
          {label}
        </label>
      ) : null}
      <Select
        value={value}
        onValueChange={(next) => {
          update({
            governorate_id:
              allowAll && next === ALL_OPTION
                ? null
                : next,
          });
        }}
      >
        <SelectTrigger
          id="companies-governorate-select"
          className="w-full max-w-sm"
          aria-label={ariaLabel}
        >
          <SelectValue placeholder={ariaLabel} />
        </SelectTrigger>
        <SelectContent>
          {allowAll ? <SelectItem value={ALL_OPTION}>{allLabel}</SelectItem> : null}
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
