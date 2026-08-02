"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import AppBreadcrumb from "@/components/common/AppBreadcrumb";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useRouter } from "@/i18n/navigation";
import { env } from "@/lib/env";
import { useRequireAuth } from "@/features/auth";
import CheckoutSummary from "@/features/checkout/components/CheckoutSummary";
import { createCustomerOrder } from "@/features/checkout/api/create-customer-order";
import { buildOrderPayload } from "@/features/checkout/utils/build-order-payload";
import { createOrderIdempotencyKey } from "@/features/checkout/utils/idempotency";
import {
  clearOrderSource,
  resolveOrderSourcePayload,
} from "@/features/checkout/utils/order-source";
import { resolveOrderErrorMessage } from "@/features/checkout/utils/resolve-order-error-message";
import { PAYMENT_TYPE, useCartStore } from "@/stores/cart-store";
import { useAuthStore, useIsAuthenticated } from "@/stores/auth-store";
import { cn } from "@/lib/utils";

const GOV_NONE = "none";

function planKey(plan) {
  return `${plan.months}-${plan.downPayment}-${plan.installmentAmount}`;
}

export default function CheckoutPage({
  breadcrumbs = [],
  governorates = [],
}) {
  const t = useTranslations("checkout");
  const tCart = useTranslations("cart");
  const locale = useLocale();
  const router = useRouter();
  const currency = locale === "ar" ? "ج.م" : "EGP";

  const company = useCartStore((state) => state.company);
  const items = useCartStore((state) => state.items);
  const paymentType = useCartStore((state) => state.paymentType);
  const installmentPlan = useCartStore((state) => state.installmentPlan);
  const governorateId = useCartStore((state) => state.governorateId);
  const setPaymentType = useCartStore((state) => state.setPaymentType);
  const setInstallmentPlan = useCartStore((state) => state.setInstallmentPlan);
  const setGovernorateId = useCartStore((state) => state.setGovernorateId);
  const clearCart = useCartStore((state) => state.clear);
  const openMiniCart = useCartStore((state) => state.openMiniCart);

  const isAuthenticated = useIsAuthenticated();
  const token = useAuthStore((state) => state.token);
  const { openLogin } = useRequireAuth("login");

  const [notes, setNotes] = useState("");
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const firstItem = items[0] ?? null;
  const availablePlans = firstItem?.installmentPlans ?? [];
  const canInstallment =
    items.length === 1 &&
    items[0]?.quantity === 1 &&
    Boolean(items[0]?.hasInstallment) &&
    availablePlans.length > 0;

  const selectedPlanKey = useMemo(
    () => (installmentPlan ? planKey(installmentPlan) : null),
    [installmentPlan],
  );

  const isEmpty = hydrated && (!company || items.length === 0);

  const onSelectCash = () => {
    setPaymentType(PAYMENT_TYPE.CASH);
    setError(null);
  };

  const onSelectInstallment = () => {
    const result = setPaymentType(PAYMENT_TYPE.INSTALLMENT);
    if (!result.ok) {
      toast.message(tCart("toast.installmentSingle"));
      return;
    }
    if (!installmentPlan && availablePlans[0]) {
      setInstallmentPlan(availablePlans[0]);
    }
    setError(null);
  };

  const submit = () => {
    setError(null);

    if (!isAuthenticated || !token) {
      openLogin({ companyId: company?.id ?? null });
      return;
    }

    if (!company || items.length === 0) {
      setError(t("errors.empty"));
      return;
    }

    const sellerCompanyId = Number(company.id);
    if (!Number.isFinite(sellerCompanyId) || sellerCompanyId <= 0) {
      setError(t("errors.invalidCompany"));
      return;
    }

    if (paymentType === PAYMENT_TYPE.INSTALLMENT) {
      if (!canInstallment) {
        setError(t("errors.installmentSingle"));
        return;
      }
      if (!installmentPlan) {
        setError(t("errors.installmentPlan"));
        return;
      }
    }

    startTransition(async () => {
      try {
        // source = attribution only (store share → link, else direct/ad).
        // company_id = seller company from cart — never confused with source.
        const source = resolveOrderSourcePayload(sellerCompanyId);
        const payload = buildOrderPayload({
          companyId: sellerCompanyId,
          items,
          paymentType,
          installmentPlan,
          governorateId,
          notes,
          idempotencyKey: createOrderIdempotencyKey(),
          source,
        });

        if (env.isDev) {
          console.info("[checkout] POST /customer/orders", payload);
        }

        const response = await createCustomerOrder(payload, token);
        const order =
          response?.data ?? response?.order ?? response;
        const orderId = order?.id ?? order?.order_id ?? null;

        clearCart();
        clearOrderSource();

        const qs = new URLSearchParams();
        if (orderId != null) qs.set("orderId", String(orderId));
        if (company.name) qs.set("company", company.name);
        router.push(`/checkout/success?${qs.toString()}`);
      } catch (err) {
        if (
          err?.message === "invalid_company_id" ||
          err?.message === "invalid_company_product_id" ||
          err?.message === "empty_items"
        ) {
          const message = t("errors.invalidCompany");
          setError(message);
          toast.error(message);
          return;
        }

        const message = resolveOrderErrorMessage(err, t, {
          companyName: company.name,
        });

        setError(message);
        toast.error(message);
        if (err?.status === 401) openLogin({ companyId: company?.id ?? null });
      }
    });
  };

  if (!hydrated) {
    return (
      <div className="container py-16">
        <div className="h-40 animate-pulse rounded-3xl bg-muted" />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="container py-16">
        <div className="mx-auto max-w-lg rounded-3xl border border-border/60 bg-card p-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight">{t("empty.title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("empty.description")}
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link href="/products">{t("empty.browse")}</Link>
            </Button>
            <Button type="button" variant="outline" onClick={openMiniCart}>
              {tCart("title")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container pb-16 pt-4 md:pt-8">
      {breadcrumbs.length > 0 ? (
        <div className="mb-6 md:mb-8">
          <AppBreadcrumb items={breadcrumbs} />
        </div>
      ) : null}

      <div className="mb-8 max-w-2xl">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="space-y-6">
          <section className="rounded-3xl border border-border/60 bg-card p-5 sm:p-6">
            <h2 className="text-base font-bold">{t("payment.title")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("payment.hint")}
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={onSelectCash}
                className={cn(
                  "rounded-2xl border p-4 text-start transition-colors",
                  paymentType === PAYMENT_TYPE.CASH
                    ? "border-primary bg-primary/5"
                    : "border-border/60 hover:border-primary/30",
                )}
              >
                <p className="font-semibold">{t("payment.cash")}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("payment.cashHint")}
                </p>
              </button>

              <button
                type="button"
                onClick={onSelectInstallment}
                disabled={!canInstallment}
                className={cn(
                  "rounded-2xl border p-4 text-start transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                  paymentType === PAYMENT_TYPE.INSTALLMENT
                    ? "border-primary bg-primary/5"
                    : "border-border/60 hover:border-primary/30",
                )}
              >
                <p className="font-semibold">{t("payment.installment")}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {canInstallment
                    ? t("payment.installmentHint")
                    : t("payment.installmentDisabled")}
                </p>
              </button>
            </div>

            {paymentType === PAYMENT_TYPE.INSTALLMENT && canInstallment ? (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">{t("payment.choosePlan")}</p>
                <div className="grid gap-2">
                  {availablePlans.map((plan) => {
                    const key = planKey(plan);
                    const selected = selectedPlanKey === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setInstallmentPlan(plan)}
                        className={cn(
                          "flex flex-wrap items-center justify-between gap-2 rounded-2xl border px-4 py-3 text-sm transition-colors",
                          selected
                            ? "border-primary bg-primary/5"
                            : "border-border/60",
                        )}
                      >
                        <span className="font-semibold">
                          {t("payment.monthsValue", { count: plan.months })}
                        </span>
                        <span className="text-muted-foreground tabular-nums">
                          {t("payment.downPayment")}:{" "}
                          {Number(plan.downPayment).toLocaleString(
                            locale === "ar" ? "ar-EG" : "en-EG",
                          )}{" "}
                          {currency}
                          {" · "}
                          {Number(plan.installmentAmount).toLocaleString(
                            locale === "ar" ? "ar-EG" : "en-EG",
                          )}{" "}
                          {currency}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </section>

          {governorates.length > 0 ? (
            <section className="rounded-3xl border border-border/60 bg-card p-5 sm:p-6">
              <Label
                htmlFor="checkout-governorate"
                className="mb-2 block text-base font-bold"
              >
                {t("governorate.label")}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t("governorate.hint")}
              </p>
              <Select
                value={
                  governorateId != null && governorateId !== ""
                    ? String(governorateId)
                    : GOV_NONE
                }
                onValueChange={(next) => {
                  setGovernorateId(
                    next === GOV_NONE ? null : Number(next),
                  );
                }}
              >
                <SelectTrigger
                  id="checkout-governorate"
                  className="mt-3 w-full max-w-sm"
                  aria-label={t("governorate.label")}
                >
                  <SelectValue placeholder={t("governorate.placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={GOV_NONE}>
                    {t("governorate.placeholder")}
                  </SelectItem>
                  {governorates.map((gov) => (
                    <SelectItem key={gov.id} value={String(gov.id)}>
                      {gov.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </section>
          ) : null}

          <section className="rounded-3xl border border-border/60 bg-card p-5 sm:p-6">
            <Label htmlFor="checkout-notes" className="text-base font-bold">
              {t("notes.label")}
            </Label>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("notes.hint")}
            </p>
            <textarea
              id="checkout-notes"
              rows={4}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder={t("notes.placeholder")}
              className="mt-3 w-full resize-y rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </section>

          {error ? (
            <p className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <Button
            type="button"
            size="lg"
            className="w-full sm:w-auto sm:min-w-56"
            disabled={isPending}
            onClick={submit}
          >
            {isPending ? t("submitting") : t("submit")}
          </Button>
        </div>

        <CheckoutSummary />
      </div>
    </div>
  );
}
