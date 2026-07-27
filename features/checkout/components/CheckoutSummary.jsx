"use client";

import { useLocale, useTranslations } from "next-intl";

import MediaImage from "@/components/common/MediaImage";
import { PAYMENT_TYPE, useCartStore } from "@/stores/cart-store";

export default function CheckoutSummary() {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const currency = locale === "ar" ? "ج.م" : "EGP";
  const company = useCartStore((state) => state.company);
  const items = useCartStore((state) => state.items);
  const paymentType = useCartStore((state) => state.paymentType);
  const installmentPlan = useCartStore((state) => state.installmentPlan);
  const total = items.reduce(
    (sum, row) => sum + (row.price ?? 0) * row.quantity,
    0,
  );
  const quantityCount = items.reduce((sum, row) => sum + row.quantity, 0);

  if (!company || items.length === 0) return null;

  return (
    <aside className="rounded-3xl border border-border/60 bg-card p-5 sm:p-6">
      <h2 className="text-lg font-bold tracking-tight">{t("summary.title")}</h2>

      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-border/50 bg-muted/30 p-3">
        <div className="size-11 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-background">
          <MediaImage
            src={company.hasLogo ? company.logo : null}
            alt=""
            kind="company"
          />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{t("summary.company")}</p>
          <p className="truncate font-semibold">{company.name}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground tabular-nums">
            company_id: {company.id}
          </p>
        </div>
      </div>

      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.companyProductId} className="flex gap-3">
            <div className="size-14 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted">
              <MediaImage src={item.image} alt="" kind="product" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm font-medium">{item.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("summary.qty", { count: item.quantity })}
              </p>
              <p className="text-[11px] text-muted-foreground tabular-nums">
                company_product_id: {item.companyProductId}
              </p>
              <p className="mt-0.5 text-sm font-semibold tabular-nums text-primary">
                {(item.price * item.quantity).toLocaleString(
                  locale === "ar" ? "ar-EG" : "en-EG",
                )}{" "}
                {currency}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="my-4 h-px bg-border/60" />

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">{t("summary.items")}</dt>
          <dd className="font-medium tabular-nums">{quantityCount}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">{t("summary.payment")}</dt>
          <dd className="font-medium">
            {paymentType === PAYMENT_TYPE.INSTALLMENT
              ? t("payment.installment")
              : t("payment.cash")}
          </dd>
        </div>
        {paymentType === PAYMENT_TYPE.INSTALLMENT && installmentPlan ? (
          <>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">
                {t("payment.months")}
              </dt>
              <dd className="font-medium tabular-nums">
                {installmentPlan.months}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">
                {t("payment.downPayment")}
              </dt>
              <dd className="font-medium tabular-nums">
                {Number(installmentPlan.downPayment).toLocaleString(
                  locale === "ar" ? "ar-EG" : "en-EG",
                )}{" "}
                {currency}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">
                {t("payment.monthly")}
              </dt>
              <dd className="font-medium tabular-nums">
                {Number(installmentPlan.installmentAmount).toLocaleString(
                  locale === "ar" ? "ar-EG" : "en-EG",
                )}{" "}
                {currency}
              </dd>
            </div>
          </>
        ) : null}
        <div className="flex justify-between gap-3 pt-2 text-base">
          <dt className="font-semibold">{t("summary.total")}</dt>
          <dd className="font-bold text-primary tabular-nums">
            {total.toLocaleString(locale === "ar" ? "ar-EG" : "en-EG")}{" "}
            {currency}
          </dd>
        </div>
      </dl>
    </aside>
  );
}
