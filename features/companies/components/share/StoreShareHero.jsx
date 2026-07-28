"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { useLocale } from "next-intl";
import { ImageIcon } from "lucide-react";

import MediaImage from "@/components/common/MediaImage";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const HERO_HEIGHT =
  "h-[240px] sm:h-[340px] md:h-[420px]";

/**
 * Full-bleed identity banner using the project Shadcn/Embla carousel.
 * Fixed slide height + object-cover so mixed admin upload sizes stay stable.
 */
export default function StoreShareHero({
  images = [],
  companyName = "",
  autoplayDelay = 3000,
  className,
}) {
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const slides = (images ?? []).filter(
    (url) => typeof url === "string" && url.trim() !== "",
  );
  const multi = slides.length > 1;

  const plugin = React.useRef(
    Autoplay({
      delay: autoplayDelay,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );

  const [api, setApi] = React.useState(null);
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  if (!slides.length) {
    return (
      <div
        className={cn(
          "relative w-full overflow-hidden bg-muted",
          HERO_HEIGHT,
          className,
        )}
        aria-hidden
      >
        <div className="absolute inset-0 gradient-water opacity-80" />
        <div className="absolute inset-0 bg-linear-to-t from-background/55 via-background/15 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <ImageIcon
            className="size-14 text-muted-foreground/40 sm:size-16"
            strokeWidth={1.25}
          />
        </div>
      </div>
    );
  }

  return (
    <section
      className={cn("relative w-full overflow-hidden", className)}
      aria-label={companyName}
    >
      <Carousel
        setApi={setApi}
        dir={dir}
        opts={{
          loop: multi,
          direction: dir,
          duration: 28,
        }}
        plugins={multi ? [plugin.current] : undefined}
        className="w-full"
        onMouseEnter={multi ? plugin.current.stop : undefined}
        onMouseLeave={multi ? plugin.current.reset : undefined}
      >
        <CarouselContent className="-ml-0">
          {slides.map((url, index) => (
            <CarouselItem key={`${url}-${index}`} className="basis-full pl-0">
              <div
                className={cn(
                  "relative w-full overflow-hidden bg-muted",
                  HERO_HEIGHT,
                )}
              >
                <MediaImage
                  src={url}
                  alt={`${companyName} — ${index + 1}`}
                  kind="company"
                  loading={index === 0 ? "eager" : "lazy"}
                  className="object-cover object-center"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/60 via-background/15 to-transparent"
      />

      {multi ? (
        <div
          className="absolute inset-x-0 bottom-4 z-10 flex items-center justify-center gap-2"
          role="tablist"
          aria-label="Identity slides"
        >
          {slides.map((_, index) => {
            const isActive = current === index;

            return (
              <button
                key={index}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to slide ${index + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  isActive
                    ? "w-6 bg-primary"
                    : "w-1.5 bg-background/55 hover:bg-background/80",
                )}
                onClick={() => api?.scrollTo(index)}
              />
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
