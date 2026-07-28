"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "./CompanyHeroGallery.module.css";

/**
 * Full-bleed company hero carousel (Swiper).
 * Consumes normalized `slides` from buildHeroSlides — gallery or billboards.
 * Fixed-height slides + object-cover for mixed image aspect ratios.
 */
export default function CompanyHeroGallery({
  slides: slidesProp,
  /** @deprecated Prefer `slides` from buildHeroSlides */
  images = [],
  companyName = "",
  className,
}) {
  const locale = useLocale();
  const t = useTranslations("company");
  const dir = locale === "ar" ? "rtl" : "ltr";
  const uid = useId().replace(/:/g, "");
  const prevClass = `company-hero-prev-${uid}`;
  const nextClass = `company-hero-next-${uid}`;
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);
  const [swiperReady, setSwiperReady] = useState(false);

  const slides = (Array.isArray(slidesProp) ? slidesProp : images).filter(
    (item) => item?.url,
  );
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
        {slides.map((slide, index) => {
          const isBillboard = slide.kind === "billboard";
          const href = isBillboard ? slide.href : null;

          return (
            <SwiperSlide key={slide.id ?? slide.url}>
              <div className="relative h-[240px] w-full overflow-hidden bg-muted sm:h-[340px] md:h-[440px] lg:h-[500px]">
                {href ? (
                  <Link
                    href={href}
                    className="absolute inset-0 z-[1] block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                    aria-label={t("sponsoredProduct", { name: companyName })}
                  >
                    <img
                      src={slide.url}
                      alt={`${t("sponsored")} — ${companyName}`}
                      loading={index === 0 ? "eager" : "lazy"}
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </Link>
                ) : (
                  <img
                    src={slide.url}
                    alt={`${companyName} — ${index + 1}`}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                )}

                {isBillboard ? (
                  <Badge
                    variant="secondary"
                    className="pointer-events-none absolute top-3 start-3 z-[2] border-border/40 bg-card/90 text-[11px] font-medium text-foreground shadow-soft backdrop-blur-sm sm:top-4 sm:start-4"
                  >
                    {t("sponsored")}
                  </Badge>
                ) : null}

                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-background/70 via-background/10 to-transparent"
                />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}
