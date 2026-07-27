"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import { useCompaniesQuery } from "@/features/companies/hooks/use-companies-query";
import { cn } from "@/lib/utils";

const DEBOUNCE_MS = 300;

/**
 * Debounced companies search wired to ?search= (backend via list page).
 */
export default function CompaniesSearch({ placeholder, className }) {
  const { params, update } = useCompaniesQuery();
  const [value, setValue] = useState(params.search ?? "");
  const [syncedSearch, setSyncedSearch] = useState(params.search ?? "");

  const urlSearch = params.search ?? "";
  if (urlSearch !== syncedSearch) {
    setSyncedSearch(urlSearch);
    setValue(urlSearch);
  }

  useEffect(() => {
    const next = value.trim();
    const current = (params.search ?? "").trim();
    if (next === current) return undefined;

    const timer = setTimeout(() => {
      update({ search: next || null });
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [value, params.search, update]);

  return (
    <div
      className={cn(
        "flex h-11 w-full max-w-md items-center gap-2 rounded-full border border-border/60 bg-card px-4 shadow-sm sm:min-w-[280px]",
        className,
      )}
    >
      <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className="h-full w-full border-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        aria-label={placeholder}
        autoComplete="off"
      />
    </div>
  );
}
