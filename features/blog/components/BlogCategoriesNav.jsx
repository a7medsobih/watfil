import { Link } from "@/i18n/navigation";
import { buildBlogHref } from "@/features/blog/utils/resolve-articles-params";
import { cn } from "@/lib/utils";

function CategoryPill({ category, isActive, search, variant = "default" }) {
  const buildHref = (categorySlug) =>
    buildBlogHref({
      category_slug: categorySlug || null,
      search,
    });

  return (
    <Link
      href={buildHref(category.slug)}
      className={cn(
        "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        isActive
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border/60 bg-card text-foreground hover:border-primary/30 hover:bg-muted/50",
        variant === "sub" && "px-3 py-1.5 text-xs",
      )}
    >
      <span>{category.name}</span>
      {category.articlesCount > 0 && (
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs",
            isActive
              ? "bg-primary-foreground/20 text-primary-foreground"
              : "bg-muted text-muted-foreground",
          )}
        >
          {category.articlesCount}
        </span>
      )}
    </Link>
  );
}

/**
 * Horizontal category navigation — backend-driven via category_slug URLs.
 */
export default function BlogCategoriesNav({
  categories = [],
  subCategories = [],
  activeSlug = null,
  search = null,
  allLabel,
  className,
}) {
  if (!categories.length) return null;

  const buildHref = (categorySlug) =>
    buildBlogHref({
      category_slug: categorySlug || null,
      search,
    });

  return (
    <div className={cn("space-y-3", className)}>
      <nav
        aria-label="Blog categories"
        className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
      >
        <Link
          href={buildHref(null)}
          className={cn(
            "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
            !activeSlug
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border/60 bg-card text-foreground hover:border-primary/30 hover:bg-muted/50",
          )}
        >
          {allLabel}
        </Link>

        {categories.map((category) => (
          <CategoryPill
            key={category.id}
            category={category}
            isActive={activeSlug === category.slug}
            search={search}
          />
        ))}
      </nav>

      {subCategories.length > 0 && (
        <nav
          aria-label="Blog subcategories"
          className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
        >
          {subCategories.map((category) => (
            <CategoryPill
              key={category.id}
              category={category}
              isActive={activeSlug === category.slug}
              search={search}
              variant="sub"
            />
          ))}
        </nav>
      )}
    </div>
  );
}
