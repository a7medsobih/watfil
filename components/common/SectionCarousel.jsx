"use client";

import { Children, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Autoplay from "embla-carousel-autoplay";
import { useLocale, useTranslations } from "next-intl";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

/** Above this width the carousel deactivates and the list renders as a grid. */
const GRID_BREAKPOINT = "(min-width: 768px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getReducedMotion() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionOnServer() {
  return false;
}

/**
 * Shared list presentation for home sections (products / companies / articles).
 *
 * Mobile renders an Embla carousel (autoplay, loop, swipe, mouse drag, RTL aware);
 * from `md` upwards Embla deactivates itself and the exact same DOM renders as the
 * existing grid — so markup stays server-rendered and SEO/CLS are untouched.
 *
 * @param {object} props
 * @param {import("react").ReactNode} props.children One node per card.
 * @param {string} [props.gridClassName] Grid columns applied from `md` upwards.
 * @param {string} [props.itemClassName] Slide width on mobile.
 * @param {number} [props.autoplayDelay]
 * @param {string} [props.ariaLabel]
 * @param {string} [props.className]
 */
export default function SectionCarousel({
  children,
  gridClassName = "md:grid-cols-3 lg:grid-cols-4",
  itemClassName = "basis-[86%] sm:basis-[48%]",
  autoplayDelay = 4500,
  ariaLabel,
  className,
}) {
  const locale = useLocale();
  const t = useTranslations("pagination");
  const direction = locale === "ar" ? "rtl" : "ltr";
  const slides = Children.toArray(children);

  const autoplay = useRef(
    Autoplay({
      delay: autoplayDelay,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      stopOnFocusIn: true,
    }),
  );

  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getReducedMotionOnServer,
  );

  const [api, setApi] = useState(null);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!api) return undefined;

    const onSelect = () => setSelected(api.selectedScrollSnap());
    api.on("select", onSelect).on("reInit", onSelect);

    return () => {
      api.off("select", onSelect).off("reInit", onSelect);
    };
  }, [api]);

  if (!slides.length) return null;

  const isInteractive = slides.length > 1;

  return (
    <Carousel
      dir={direction}
      setApi={setApi}
      aria-label={ariaLabel}
      opts={{
        align: "start",
        direction,
        loop: isInteractive,
        watchDrag: isInteractive,
        breakpoints: { [GRID_BREAKPOINT]: { active: false } },
      }}
      plugins={
        isInteractive && !prefersReducedMotion ? [autoplay.current] : undefined
      }
      className={className}
    >
      <CarouselContent
        viewportClassName="md:overflow-visible"
        className={cn("ml-0 -ms-4 md:ms-0 md:grid md:gap-5", gridClassName)}
      >
        {slides.map((slide, index) => (
          <CarouselItem
            key={slide.key ?? index}
            className={cn("pl-0 ps-4 md:ps-0", itemClassName, "md:basis-auto")}
          >
            {slide}
          </CarouselItem>
        ))}
      </CarouselContent>

      {isInteractive && (
        <div className="mt-6 flex items-center justify-center gap-4 md:hidden">
          <CarouselPrevious
            aria-label={t("previous")}
            className="static my-0 size-9 translate-y-0"
          />

          <div className="flex items-center gap-1.5">
            {slides.map((slide, index) => (
              <button
                key={slide.key ?? index}
                type="button"
                aria-label={`${index + 1} / ${slides.length}`}
                aria-current={index === selected}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  index === selected
                    ? "w-5 bg-primary"
                    : "w-1.5 bg-muted-foreground/30",
                )}
              />
            ))}
          </div>

          <CarouselNext
            aria-label={t("next")}
            className="static my-0 size-9 translate-y-0"
          />
        </div>
      )}
    </Carousel>
  );
}
