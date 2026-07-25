"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  BadgeCheck,
  Box,
  CalendarDays,
  Eye,
  Heart,
  Layers,
  Package,
  Store,
  Tag,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
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

function InfoRow({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 py-4 text-sm sm:px-6">
      <span className="text-muted-foreground">{label}</span>
      <div className="max-w-[65%] text-end font-semibold">{children}</div>
    </div>
  );
}

function OverviewPanel({ product, locale, currency, t }) {
  const showSalePrice =
    product.isOnSale &&
    product.originalPrice != null &&
    product.originalPrice > product.cashPrice;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-4">
        {product.description && (
          <div className="rounded-3xl border border-border/60 bg-card p-5 sm:p-6">
            <h3 className="text-sm font-semibold">{t("overview.description")}</h3>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          </div>
        )}

        <div className="rounded-3xl border border-border/60 bg-card p-5 sm:p-6">
          <h3 className="text-sm font-semibold">{t("overview.pricing")}</h3>
          <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-3xl font-black text-primary">
              {product.cashPrice.toLocaleString(
                locale === "ar" ? "ar-EG" : "en-EG",
              )}
            </span>
            <span className="text-sm text-muted-foreground">{currency}</span>
            {showSalePrice && (
              <span className="text-sm text-muted-foreground line-through">
                {product.originalPrice.toLocaleString(
                  locale === "ar" ? "ar-EG" : "en-EG",
                )}
              </span>
            )}
          </div>
          {product.isOnSale && (
            <Badge variant="destructive" className="mt-3 rounded-full">
              {t("badges.sale")}
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {product.supplier && (
          <div className="rounded-3xl border border-border/60 bg-card p-5 sm:p-6">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Store className="size-4 text-primary" aria-hidden />
              {t("overview.supplier")}
            </div>
            <div className="mt-4 flex items-center gap-3">
              {product.supplier.logo ? (
                <img
                  src={product.supplier.logo}
                  alt=""
                  className="size-12 rounded-2xl object-cover ring-1 ring-border/60"
                />
              ) : (
                <div className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <Store className="size-5" aria-hidden />
                </div>
              )}
              <div>
                <div className="font-semibold">{product.supplier.name}</div>
                {product.sku && (
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {t("sku")}: {product.sku}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-3xl border border-border/60 bg-card divide-y divide-border/60">
          {product.category?.name && (
            <InfoRow label={t("overview.category")}>{product.category.name}</InfoRow>
          )}
          {product.sku && <InfoRow label={t("sku")}>{product.sku}</InfoRow>}
          <InfoRow label={t("overview.status")}>
            <Badge
              variant={product.isAvailable ? "default" : "outline"}
              className="rounded-full"
            >
              {product.isAvailable
                ? t("availability.available")
                : t("availability.unavailable")}
            </Badge>
          </InfoRow>
          {product.stockStatus && (
            <InfoRow label={t("overview.stock")}>
              {stockLabel(product.stockStatus, t)}
            </InfoRow>
          )}
        </div>
      </div>
    </div>
  );
}

function InstallmentsPanel({ product, locale, currency, t }) {
  const plans = product.installmentPlans ?? [];

  if (!plans.length) {
    return (
      <div className="rounded-3xl border border-border/60 bg-card p-6 text-sm text-muted-foreground">
        {t("installments.empty")}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-border/60 bg-card">
      <div className="hidden grid-cols-3 gap-4 border-b border-border/60 bg-muted/40 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:grid">
        <span>{t("installments.months")}</span>
        <span>{t("installments.downPayment")}</span>
        <span>{t("installments.amount")}</span>
      </div>
      <div className="divide-y divide-border/60">
        {plans.map((plan, index) => (
          <div
            key={`${plan.months}-${plan.installmentAmount}-${index}`}
            className="grid gap-2 px-5 py-4 sm:grid-cols-3 sm:gap-4 sm:px-6"
          >
            <div>
              <div className="text-xs text-muted-foreground sm:hidden">
                {t("installments.months")}
              </div>
              <div className="font-semibold">
                {t("installments.monthsValue", { count: plan.months })}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground sm:hidden">
                {t("installments.downPayment")}
              </div>
              <div className="font-semibold">
                {formatMoney(plan.downPayment, locale, currency)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground sm:hidden">
                {t("installments.amount")}
              </div>
              <div className="font-semibold text-primary">
                {formatMoney(plan.installmentAmount, locale, currency)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductInfoPanel({ product, locale, t }) {
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
    product.category?.name && {
      icon: Tag,
      label: t("overview.category"),
      value: product.category.name,
    },
  ].filter(Boolean);

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {rows.map((row) => {
        const Icon = row.icon;
        return (
          <div
            key={row.label}
            className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card p-5"
          >
            <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <Icon className="size-4" aria-hidden />
            </div>
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">{row.label}</div>
              <div className="mt-1 text-sm font-semibold">{row.value}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PerksPanel({ product, t }) {
  const perks = product.hasPerks ? (product.perks ?? []) : [];

  if (!perks.length) {
    return (
      <div className="rounded-3xl border border-border/60 bg-card p-6 text-sm text-muted-foreground">
        {t("perks.empty")}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {perks.map((perk) => {
        const Icon = resolveLucideIcon(perk.icon);
        return (
          <article
            key={perk.id ?? `${perk.title}-${perk.icon}`}
            className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card p-5"
          >
            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <Icon className="size-4" aria-hidden />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold">{perk.title}</h3>
              {perk.description ? (
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {perk.description}
                </p>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}

/**
 * Product detail tabs driven by real catalog / company-offer fields.
 * Tabs: Overview · Installments · Perks · Product Information
 */
export default function ProductDetailsTabs({ product, locale = "ar", className }) {
  const t = useTranslations("product");
  const currency = locale === "ar" ? "ج.م" : "EGP";

  const tabs = useMemo(() => {
    const list = [
      { key: "overview", label: t("tabs.overview") },
      product.hasInstallment
        ? { key: "installments", label: t("tabs.installments") }
        : null,
      product.hasPerks && (product.perks?.length ?? 0) > 0
        ? { key: "perks", label: t("tabs.perks") }
        : null,
      { key: "info", label: t("tabs.info") },
    ];
    return list.filter(Boolean);
  }, [product?.hasInstallment, product?.hasPerks, product?.perks?.length, t]);

  const [active, setActive] = useState("overview");
  const current = tabs.some((tab) => tab.key === active) ? active : "overview";

  if (!product) return null;

  return (
    <section className={cn("mt-16 space-y-6", className)}>
      <div
        role="tablist"
        aria-label={t("tabsLabel")}
        className="flex h-auto flex-wrap gap-1.5 rounded-full bg-muted p-1.5"
      >
        {tabs.map((tab) => {
          const isActive = current === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(tab.key)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-card text-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div role="tabpanel">
        {current === "overview" && (
          <OverviewPanel
            product={product}
            locale={locale}
            currency={currency}
            t={t}
          />
        )}
        {current === "installments" && (
          <InstallmentsPanel
            product={product}
            locale={locale}
            currency={currency}
            t={t}
          />
        )}
        {current === "perks" && <PerksPanel product={product} t={t} />}
        {current === "info" && (
          <ProductInfoPanel product={product} locale={locale} t={t} />
        )}
      </div>
    </section>
  );
}
