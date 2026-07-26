"use client";

import { useTranslations } from "next-intl";
import {
  BadgeCheck,
  Box,
  CalendarDays,
  Eye,
  Heart,
  Layers,
  Package,
  Tag,
} from "lucide-react";

import { resolveLucideIcon } from "@/features/companies/utils/resolve-lucide-icon";
import { cn } from "@/lib/utils";

function formatDate(value, locale) {
  if (!value) return null;
  const date = new Date(String(value).replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatMoney(value, locale, currency) {
  return `${Number(value ?? 0).toLocaleString(
    locale === "ar" ? "ar-EG" : "en-EG",
  )} ${currency}`;
}

function stockLabel(status, t) {
  if (!status) return null;
  if (status === "in_stock") return t("stock.in_stock");
  if (status === "out_of_stock") return t("stock.out_of_stock");
  if (status === "limited") return t("stock.limited");
  return String(status).replaceAll("_", " ");
}

function SectionTitle({ children }) {
  return (
    <h2 className="text-base font-bold tracking-tight md:text-lg">{children}</h2>
  );
}

function DescriptionPanel({ product, t }) {
  if (!product.description) return null;

  return (
    <section className="space-y-3">
      <SectionTitle>{t("overview.description")}</SectionTitle>
      <div className="rounded-2xl border border-border/60 bg-card p-4 sm:rounded-3xl sm:p-5">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
          {product.description}
        </p>
      </div>
    </section>
  );
}

function SpecificationsPanel({ product, locale, t }) {
  const createdAt = formatDate(product.createdAt, locale);

  const rows = [
    product.numberOfStages != null && {
      icon: Layers,
      label: t("info.stages"),
      value: t("stagesCount", { count: product.numberOfStages }),
    },
    product.productType?.label && {
      icon: Box,
      label: t("info.type"),
      value: product.productType.label,
    },
    product.category?.name && {
      icon: Tag,
      label: t("overview.category"),
      value: product.category.name,
    },
    {
      icon: BadgeCheck,
      label: t("info.availability"),
      value: product.isAvailable
        ? t("availability.available")
        : t("availability.unavailable"),
    },
    product.stockStatus && {
      icon: Package,
      label: t("info.stock"),
      value: stockLabel(product.stockStatus, t),
    },
    {
      icon: Eye,
      label: t("views"),
      value: String(product.viewsCount ?? 0),
    },
    {
      icon: Heart,
      label: t("likes"),
      value: String(product.likesCount ?? 0),
    },
    createdAt && {
      icon: CalendarDays,
      label: t("info.addedAt"),
      value: createdAt,
    },
  ].filter(Boolean);

  if (!rows.length) return null;

  return (
    <section className="space-y-3">
      <SectionTitle>{t("tabs.specifications")}</SectionTitle>
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((row) => {
          const Icon = row.icon;
          return (
            <div
              key={row.label}
              className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card p-4"
            >
              <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-3.5" aria-hidden />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">{row.label}</div>
                <div className="mt-0.5 text-sm font-semibold">{row.value}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function InstallmentsPanel({ product, locale, currency, t }) {
  const plans = product.installmentPlans ?? [];
  if (!plans.length) return null;

  return (
    <section className="space-y-3">
      <SectionTitle>{t("tabs.installments")}</SectionTitle>
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <article
            key={`${plan.months}-${plan.installmentAmount}-${index}`}
            className="rounded-2xl border border-border/60 bg-card p-4"
          >
            <div className="text-sm font-bold text-primary">
              {t("installments.monthsValue", { count: plan.months })}
            </div>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-muted-foreground">
                  {t("installments.downPayment")}
                </dt>
                <dd className="font-semibold">
                  {formatMoney(plan.downPayment, locale, currency)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-muted-foreground">
                  {t("installments.amount")}
                </dt>
                <dd className="font-semibold text-primary">
                  {formatMoney(plan.installmentAmount, locale, currency)}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}

function PerksPanel({ product, t }) {
  const perks = product.hasPerks ? (product.perks ?? []) : [];
  if (!perks.length) return null;

  return (
    <section className="space-y-3">
      <SectionTitle>{t("tabs.perks")}</SectionTitle>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {perks.map((perk) => {
          const Icon = resolveLucideIcon(perk.icon);
          return (
            <article
              key={perk.id ?? `${perk.title}-${perk.icon}`}
              className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card p-4"
            >
              <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-4" aria-hidden />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold">{perk.title}</h3>
                {perk.description ? (
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {perk.description}
                  </p>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/**
 * Product detail information — always-visible cards (no tabs).
 * catalog: Description · Specifications · Perks
 * company: same + Installments when available
 */
export default function ProductDetailsTabs({
  product,
  locale = "ar",
  className,
  mode = "catalog",
}) {
  const t = useTranslations("product");
  const currency = locale === "ar" ? "ج.م" : "EGP";
  const isCompany = mode === "company";

  if (!product) return null;

  const showInstallments =
    isCompany &&
    product.hasInstallment &&
    (product.installmentPlans?.length ?? 0) > 0;

  const showPerks =
    product.hasPerks && (product.perks?.length ?? 0) > 0;

  return (
    <section
      className={cn("mt-10 space-y-8 sm:mt-12", className)}
      aria-label={t("tabsLabel")}
    >
      <DescriptionPanel product={product} t={t} />
      <SpecificationsPanel product={product} locale={locale} t={t} />
      {showInstallments ? (
        <InstallmentsPanel
          product={product}
          locale={locale}
          currency={currency}
          t={t}
        />
      ) : null}
      {showPerks ? <PerksPanel product={product} t={t} /> : null}
    </section>
  );
}
