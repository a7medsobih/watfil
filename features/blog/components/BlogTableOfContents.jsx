import { cn } from "@/lib/utils";

/**
 * Table of contents from article headings.
 */
export default function BlogTableOfContents({
  headings = [],
  title,
  className,
}) {
  if (!headings.length) return null;

  return (
    <nav
      aria-label="Table of contents"
      className={cn(
        "rounded-2xl border border-border/60 bg-card p-5 shadow-sm",
        className,
      )}
    >
      {title && (
        <p className="text-sm font-semibold tracking-tight text-foreground">
          {title}
        </p>
      )}

      <ol className="mt-3 space-y-2 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={cn(heading.level === 3 && "ps-3")}
          >
            <a
              href={`#${heading.id}`}
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
