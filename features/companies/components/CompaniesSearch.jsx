import { Search } from "lucide-react";

/**
 * Companies search field (UI only — not wired to the API yet).
 *
 * @param {object} props
 * @param {string} props.placeholder
 * @param {string} [props.className]
 */
export default function CompaniesSearch({ placeholder, className = "" }) {
  return (
    <div
      className={`flex h-11 w-full max-w-md items-center gap-2 rounded-full border border-border/60 bg-card px-4 shadow-sm sm:min-w-[280px] ${className}`}
    >
      <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
      <input
        type="search"
        name="q"
        placeholder={placeholder}
        className="h-full w-full border-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        aria-label={placeholder}
        autoComplete="off"
      />
    </div>
  );
}
