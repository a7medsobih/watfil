"use client";

import { useTranslations } from "next-intl";

import SectionCarousel from "@/components/common/SectionCarousel";
import { Badge } from "@/components/ui/badge";
import { resolveLucideIcon } from "@/features/companies/utils/resolve-lucide-icon";
import { cn } from "@/lib/utils";

function ServiceCard({ service, index, emptyDescription }) {
  const Icon = resolveLucideIcon(service.icon);
  const order = String(index + 1).padStart(2, "0");

  return (
    <article
      className={cn(
        "relative flex h-full min-h-[11.5rem] flex-col overflow-hidden rounded-3xl",
        "border border-border/60 bg-card p-5 shadow-soft sm:p-6",
        "transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-elegant",
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -end-1 -top-3 select-none text-6xl font-black tracking-tighter text-primary/[0.07]"
      >
        {order}
      </span>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary via-accent-mint to-transparent opacity-80"
      />

      <div className="relative mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
        <Icon className="size-5" aria-hidden />
      </div>

      <h3 className="relative text-base font-semibold tracking-tight sm:text-lg">
        {service.title}
      </h3>

      <p className="relative mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        {service.description || emptyDescription}
      </p>
    </article>
  );
}

/**
 * Competitive services section — Embla carousel on mobile, grid from md+.
 * Hidden entirely when the API returns no services.
 */
export default function CompanyServicesSection({ services = [], className }) {
  const t = useTranslations("company");

  if (!services.length) return null;

  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
            {t("tabs.services")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("servicesSubtitle")}
          </p>
        </div>
        <Badge variant="secondary" className="rounded-full">
          {services.length} {t("tabs.services")}
        </Badge>
      </div>

      <SectionCarousel
        ariaLabel={t("tabs.services")}
        gridClassName="md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        itemClassName="basis-[85%] sm:basis-[48%]"
      >
        {services.map((service, index) => (
          <ServiceCard
            key={service.id}
            service={service}
            index={index}
            emptyDescription={t("servicesEmpty")}
          />
        ))}
      </SectionCarousel>
    </section>
  );
}
