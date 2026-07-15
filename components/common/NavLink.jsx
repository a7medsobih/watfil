"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * Locale-aware link with active-state handling.
 *
 * @param {{
 *   href: string;
 *   children: React.ReactNode;
 *   className?: string;
 *   activeClassName?: string;
 *   inactiveClassName?: string;
 *   showIndicator?: boolean;
 *   exact?: boolean;
 *   onClick?: () => void;
 *   prefetch?: boolean;
 * }} props
 */
export default function NavLink({
  href,
  children,
  className,
  activeClassName,
  inactiveClassName,
  showIndicator = true,
  exact,
  onClick,
  prefetch = true,
  ...props
}) {
  const pathname = usePathname();
  const isExact = exact ?? href === "/";
  const isActive = isExact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      prefetch={prefetch}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      data-active={isActive || undefined}
      className={cn(
        isActive
          ? (activeClassName ?? "text-primary")
          : (inactiveClassName ?? "text-muted-foreground hover:text-foreground"),
        className,
      )}
      {...props}
    >
      {children}
      {showIndicator && isActive ? (
        <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full [background:var(--gradient-hero)]" />
      ) : null}
    </Link>
  );
}
