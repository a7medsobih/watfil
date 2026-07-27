"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useLocale } from "next-intl";

// import hero1 from "@/assets/carousel/slide1.png";
// import hero2 from "@/assets/carousel/slide2.png";
// import hero3 from "@/assets/carousel/slide3.png";
// import hero4 from "@/assets/carousel/slide4.jpg";
import hero5 from "@/assets/carousel/slide5.jpg";
import hero6 from "@/assets/carousel/slide6.jpg";
// import hero7 from "@/assets/carousel/slide7.jpg";
import hero8 from "@/assets/carousel/slide8.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const DEFAULT_IMAGES = [
  // {
  //   src: hero1,
  //   alt: "Pure water glass",
  // },
  // {
  //   src: hero2,
  //   alt: "Water filtration system",
  // },
  // {
  //   src: hero3,
  //   alt: "Clean drinking water",
  // },
  // {
  //   src: hero4,
  //   alt: "Clean drinking water",
  // },
  {
    src: hero8,
    alt: "Clean drinking water",
  },
  {
    src: hero5,
    alt: "Clean drinking water",
  },
  {
    src: hero6,
    alt: "Clean drinking water",
  },
  // {
  //   src: hero7,
  //   alt: "Clean drinking water",
  // },
];

export default function HeroCarousel({
  images = DEFAULT_IMAGES,
  className,
  autoplayDelay = 4000,
  children,
}) {
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

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

  return (
    <div className={cn("w-full", className)}>
      <div className="relative mx-auto w-full max-w-[520px]">
        <div className="overflow-hidden rounded-[2.5rem] shadow-elegant">
          <Carousel
            setApi={setApi}
            dir={dir}
            opts={{ loop: true, direction: dir }}
            plugins={[plugin.current]}
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent className="-ml-0">
              {images.map((image, index) => (
                <CarouselItem key={index} className="basis-full pl-0">
                  <div className="relative aspect-square w-full">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, 520px"
                      className="object-cover object-center"
                      priority={index === 0}
                    />
                    {/* <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-deep/55 via-primary/20 to-secondary/10"
                    /> */}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {children}
      </div>

      <div
        className="mt-5 flex items-center justify-center gap-2"
        role="tablist"
        aria-label="Hero slides"
      >
        {images.map((_, index) => {
          const isActive = current === index;

          return (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Go to slide ${index + 1}`}
              className={cn(
                "h-2 rounded-full transition-all",
                isActive
                  ? "w-6 bg-primary"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50",
              )}
              onClick={() => api?.scrollTo(index)}
            />
          );
        })}
      </div>
    </div>
  );
}
