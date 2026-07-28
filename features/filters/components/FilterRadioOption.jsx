import { cn } from "@/lib/utils";

/**
 * Accessible radio row used in product browse filters.
 */
export function FilterRadioOption({
  name,
  checked,
  onChange,
  label,
  className,
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm transition-colors",
        checked
          ? "border-primary/30 text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      <span
        className={cn(
          "grid size-4 shrink-0 place-items-center rounded-full border",
          checked ? "border-primary" : "border-border",
        )}
      >
        <span
          className={cn(
            "size-2 rounded-full bg-primary transition-opacity",
            checked ? "opacity-100" : "opacity-0",
          )}
        />
      </span>
      <input
        type="radio"
        name={name}
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
      <span className="min-w-0 capitalize">{label}</span>
    </label>
  );
}
