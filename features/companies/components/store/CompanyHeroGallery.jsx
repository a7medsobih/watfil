"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "./CompanyHeroGallery.module.css";

/**
 * Full-bleed company gallery hero (Swiper).
 * Fixed-height slides + object-cover for mixed image aspect ratios.
 */
export default function CompanyHeroGallery({
  images = [],
  companyName = "",
  className,
}) {
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const uid = useId().replace(/:/g, "");
  const prevClass = `company-hero-prev-${uid}`;
  const nextClass = `company-hero-next-${uid}`;
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);
  const [swiperReady, setSwiperReady] = useState(false);

  const slides = (images ?? []).filter((item) => item?.url);
  const multi = slides.length > 1;

  useEffect(() => {
    const swiper = swiperRef.current;

    if (!swiperReady || !swiper || !multi) return;
    if (!prevRef.current || !nextRef.current) return;

    swiper.params.navigation.prevEl = prevRef.current;
    swiper.params.navigation.nextEl = nextRef.current;
    swiper.navigation.destroy();
    swiper.navigation.init();
    swiper.navigation.update();
  }, [swiperReady, multi, dir]);

  if (!slides.length) return null;

  return (
    <section className={cn("relative w-full", className)}>
      {multi && (
        <>
          <Button
            ref={prevRef}
            type="button"
            variant="outline"
            size="icon"
            aria-label="Previous slide"
            className={cn(
              prevClass,
              "absolute start-3 top-[42%] z-20 -translate-y-1/2 border-border/70 bg-card/95 shadow-soft backdrop-blur-sm sm:start-5 sm:size-10",
            )}
          >
            <ChevronLeft className="size-5 rtl:rotate-180" />
          </Button>
          <Button
            ref={nextRef}
            type="button"
            variant="outline"
            size="icon"
            aria-label="Next slide"
            className={cn(
              nextClass,
              "absolute end-3 top-[42%] z-20 -translate-y-1/2 border-border/70 bg-card/95 shadow-soft backdrop-blur-sm sm:end-5 sm:size-10",
            )}
          >
            <ChevronRight className="size-5 rtl:rotate-180" />
          </Button>
        </>
      )}

      <Swiper
        key={dir}
        dir={dir}
        modules={[Autoplay, Pagination, Navigation]}
        loop={multi}
        speed={650}
        autoplay={
          multi
            ? {
                delay: 4500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
            : false
        }
        pagination={multi ? { clickable: true } : false}
        navigation={
          multi
            ? {
                prevEl: `.${prevClass}`,
                nextEl: `.${nextClass}`,
              }
            : false
        }
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setSwiperReady(true);
        }}
        className={cn(styles.companyHeroSwiper, "w-full")}
      >
        {slides.map((image, index) => (
          <SwiperSlide key={image.id ?? image.url}>
            <div className="relative h-[240px] w-full overflow-hidden bg-muted sm:h-[340px] md:h-[440px] lg:h-[500px]">
              <img
                src={image.url}
                alt={`${companyName} — ${index + 1}`}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                className="h-full w-full object-cover"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
