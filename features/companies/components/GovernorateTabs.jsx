"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { buildCompaniesHref } from "@/features/companies/utils/resolve-companies-params";
import { cn } from "@/lib/utils";

const SCROLL_STEP = 0.7;

function getEdges(el) {
  if (!el) return { prev: false, next: false };

  const max = el.scrollWidth - el.clientWidth;
  if (max <= 4) return { prev: false, next: false };

  const rtl = getComputedStyle(el).direction === "rtl";
  const left = el.scrollLeft;

  // LTR: 0 → max | Chrome RTL: 0 → -max | Firefox RTL: max → 0
  if (rtl) {
    if (left > 0) {
      return { prev: left < max - 4, next: left > 4 };
    }
    return { prev: left < -4, next: left > -(max - 4) };
  }

  return { prev: left > 4, next: left < max - 4 };
}

/**
 * Governorate tabs with simple horizontal scroll + arrow controls.
 * Selection uses searchParams via Link (no client fetch).
 *
 * @param {object} props
 * @param {object[]} [props.governorates]
 * @param {string|number} [props.selectedId]
 * @param {string} [props.className]
 * @param {{ previous?: string, next?: string }} [props.labels]
 * @param {string} [props.ariaLabel]
 * @param {(governorateId: string|number) => string} [props.hrefBuilder]
 */
export default function GovernorateTabs({
  governorates = [],
  selectedId,
  className,
  labels = {},
  ariaLabel = "Governorates",
  hrefBuilder,
}) {
  const scrollerRef = useRef(null);
  const dragRef = useRef(null);
  const [edges, setEdges] = useState({ prev: false, next: false });

  const syncEdges = () => setEdges(getEdges(scrollerRef.current));

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return undefined;

    syncEdges();
    el.addEventListener("scroll", syncEdges, { passive: true });
    window.addEventListener("resize", syncEdges);

    const ro = new ResizeObserver(syncEdges);
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", syncEdges);
      window.removeEventListener("resize", syncEdges);
      ro.disconnect();
    };
  }, [governorates.length]);

  const scrollByDir = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;

    const amount = Math.max(160, el.clientWidth * SCROLL_STEP);
    const rtl = getComputedStyle(el).direction === "rtl";
    const delta = dir === "next" ? amount : -amount;

    el.scrollBy({
      left: rtl ? -delta : delta,
      behavior: "smooth",
    });
  };

  const onPointerDown = (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = scrollerRef.current;
    if (!el) return;

    dragRef.current = {
      id: e.pointerId,
      x: e.clientX,
      scroll: el.scrollLeft,
      moved: false,
    };
  };

  const onPointerMove = (e) => {
    const drag = dragRef.current;
    const el = scrollerRef.current;
    if (!drag || drag.id !== e.pointerId || !el) return;

    const dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) < 6) return;

    if (!drag.moved) {
      drag.moved = true;
      el.setPointerCapture?.(e.pointerId);
    }

    el.scrollLeft = drag.scroll - dx;
  };

  const onPointerUp = (e) => {
    const drag = dragRef.current;
    const el = scrollerRef.current;
    if (!drag) return;

    if (drag.moved && el) {
      try {
        el.releasePointerCapture?.(e.pointerId);
      } catch {
        // already released
      }

      const block = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        el.removeEventListener("click", block, true);
      };
      el.addEventListener("click", block, true);
    }

    dragRef.current = null;
    syncEdges();
  };

  if (!governorates.length) return null;

  const showArrows = edges.prev || edges.next;

  return (
    <div className={cn("relative mb-8 sm:mb-10", className)}>
      {showArrows && (
        <>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label={labels.previous ?? "Previous"}
            disabled={!edges.prev}
            onClick={() => scrollByDir("prev")}
            className={cn(
              "absolute start-0 top-1/2 z-20 -translate-y-1/2 border-border/70 bg-card/95 shadow-soft backdrop-blur-sm",
              !edges.prev && "pointer-events-none opacity-0",
            )}
          >
            <ChevronLeft className="rtl:rotate-180" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label={labels.next ?? "Next"}
            disabled={!edges.next}
            onClick={() => scrollByDir("next")}
            className={cn(
              "absolute end-0 top-1/2 z-20 -translate-y-1/2 border-border/70 bg-card/95 shadow-soft backdrop-blur-sm",
              !edges.next && "pointer-events-none opacity-0",
            )}
          >
            <ChevronRight className="rtl:rotate-180" />
          </Button>
        </>
      )}

      <div className="relative">
        {edges.prev && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 start-0 z-10 w-10 bg-gradient-to-r from-background to-transparent rtl:bg-gradient-to-l sm:w-12"
          />
        )}
        {edges.next && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 end-0 z-10 w-10 bg-gradient-to-l from-background to-transparent rtl:bg-gradient-to-r sm:w-12"
          />
        )}

        <div
          ref={scrollerRef}
          role="tablist"
          aria-label={ariaLabel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className={cn(
            "scrollbar-none flex flex-nowrap gap-2 overflow-x-auto scroll-smooth touch-pan-x py-1",
            showArrows && "px-9 sm:px-11",
          )}
        >
          {governorates.map((governorate) => {
            const isActive = String(governorate.id) === String(selectedId);
            const href = hrefBuilder
              ? hrefBuilder(governorate.id)
              : buildCompaniesHref({ governorate: governorate.id });

            return (
              <Link
                key={governorate.id}
                href={href}
                role="tab"
                aria-selected={isActive}
                draggable={false}
                className={cn(
                  "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-accent",
                )}
              >
                {governorate.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
