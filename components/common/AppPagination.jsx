import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * Builds a compact page window with optional ellipses.
 * @param {number} currentPage
 * @param {number} lastPage
 * @returns {(number | "ellipsis")[]}
 */
function getPageItems(currentPage, lastPage) {
  if (lastPage <= 7) {
    return Array.from({ length: lastPage }, (_, index) => index + 1);
  }

  const items = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(lastPage - 1, currentPage + 1);

  if (start > 2) items.push("ellipsis");

  for (let page = start; page <= end; page += 1) {
    items.push(page);
  }

  if (end < lastPage - 1) items.push("ellipsis");

  items.push(lastPage);
  return items;
}

function PageControl({
  href,
  onSelect,
  isActive,
  className,
  children,
  disabled,
  size = "icon",
}) {
  const classes = cn(
    buttonVariants({
      variant: isActive ? "outline" : "ghost",
      size,
    }),
    disabled && "pointer-events-none opacity-50",
    className,
  );

  if (disabled || (!href && !onSelect)) {
    return (
      <span aria-disabled className={classes} tabIndex={-1}>
        {children}
      </span>
    );
  }

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={onSelect}
        aria-current={isActive ? "page" : undefined}
        className={classes}
      >
        {children}
      </button>
    );
  }

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={classes}
    >
      {children}
    </Link>
  );
}

/**
 * Generic list pagination.
 * Pass `hrefBuilder` for server-rendered lists (companies, products, …) or
 * `onPageChange` for client lists paginated in place (company store).
 * Renders only when results span more than one page.
 *
 * @param {object} props
 * @param {number} props.currentPage
 * @param {number} props.lastPage
 * @param {number} [props.total]
 * @param {number} [props.perPage]
 * @param {(page: number) => string} [props.hrefBuilder]
 * @param {(page: number) => void} [props.onPageChange]
 * @param {string} [props.className]
 * @param {{ previous?: string, next?: string }} [props.labels]
 */
export default function AppPagination({
  currentPage,
  lastPage,
  total,
  perPage,
  hrefBuilder,
  onPageChange,
  className,
  labels = {},
}) {
  const page = Number(currentPage) || 1;
  const pages = Number(lastPage) || 1;
  const totalItems = total != null ? Number(total) : null;
  const pageSize = perPage != null ? Number(perPage) : null;

  const hasMultiplePages =
    pages > 1 ||
    (totalItems != null && pageSize != null && totalItems > pageSize);

  if (!hasMultiplePages) return null;

  const items = getPageItems(page, pages);

  const controlProps = (targetPage) =>
    onPageChange
      ? { onSelect: () => onPageChange(targetPage) }
      : { href: hrefBuilder?.(targetPage) };

  return (
    <Pagination className={cn("mt-10", className)}>
      <PaginationContent>
        <PaginationItem>
          <PageControl
            {...(page > 1 ? controlProps(page - 1) : {})}
            disabled={page <= 1}
            size="default"
            className="gap-1 px-2.5 sm:pe-4"
          >
            <ChevronLeftIcon className="size-4 rtl:rotate-180" />
            <span className="hidden sm:inline">
              {labels.previous ?? "Previous"}
            </span>
          </PageControl>
        </PaginationItem>

        {items.map((item, index) =>
          item === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <span
                aria-hidden
                className="flex size-8 items-center justify-center"
              >
                <MoreHorizontalIcon className="size-4" />
              </span>
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PageControl {...controlProps(item)} isActive={item === page}>
                {item}
              </PageControl>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PageControl
            {...(page < pages ? controlProps(page + 1) : {})}
            disabled={page >= pages}
            size="default"
            className="gap-1 px-2.5 sm:ps-4"
          >
            <span className="hidden sm:inline">{labels.next ?? "Next"}</span>
            <ChevronRightIcon className="size-4 rtl:rotate-180" />
          </PageControl>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
