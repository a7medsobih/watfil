"use client";

import { ShieldCheck, Sparkles, Truck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import HeroCarousel from "@/components/common/HeroCarousel";

import HeroFloatingBadge from "./HeroFloatingBadge";
import { WaterBackdrop } from "./WaterBackdrop";

export default function HeroSection() {
  const t = useTranslations();
  const locale = useLocale();
  const [titleLine1, titleLine2] = t("hero.title").split("\n");

  return (
    <section className="relative overflow-hidden pt-8 pb-24 md:pt-16 md:pb-32">
      <WaterBackdrop />

      <div className="container relative">
        <div className="flex flex-col items-center gap-5 lg:flex-row lg:gap-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-muted-foreground">{t("hero.eyebrow")}</span>
            </div>

            <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl md:text-7xl whitespace-pre-line">
              {titleLine1}
              <br />
              <span className="gradient-text">{titleLine2}</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("hero.subtitle")}
            </p>

            {/* <form
              onSubmit={(event) => event.preventDefault()}
              className="mt-8 flex max-w-xl items-center gap-2 rounded-full border border-border/60 bg-card p-1.5 shadow-elegant"
            >
              <div className="grid place-items-center ps-4">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="search"
                placeholder={t("hero.searchPlaceholder")}
                className="h-11 flex-1 border-0 bg-transparent text-base shadow-none outline-none placeholder:text-muted-foreground focus-visible:ring-0"
                aria-label={t("hero.searchPlaceholder")}
              />
              <Button variant="hero" size="lg" type="submit">
                {t("nav.search")}
              </Button>
            </form> */}

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
                {locale === "ar" ? "شركات معتمدة" : "Verified suppliers"}
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 shrink-0 text-primary" />
                {locale === "ar"
                  ? "تركيب في جميع المحافظات"
                  : "Nationwide installation"}
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[520px] lg:mx-0 lg:ms-auto">
            <HeroCarousel>
              <HeroFloatingBadge />
            </HeroCarousel>
          </div>
        </div>
      </div>
    </section>
  );
}
