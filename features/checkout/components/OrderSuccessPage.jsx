"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Circle } from "lucide-react";
import { useTranslations } from "next-intl";

import DownloadAppSection from "@/components/common/DownloadAppSection";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const TIMELINE_KEYS = [
  "received",
  "review",
  "contact",
  "installation",
  "maintenance",
];

export default function OrderSuccessPage() {
  const t = useTranslations("orderSuccess");
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const companyName = searchParams.get("company");

  const benefits = useMemo(
    () => [
      t("app.benefits.track"),
      t("app.benefits.installation"),
      t("app.benefits.maintenance"),
      t("app.benefits.filters"),
      t("app.benefits.warranty"),
      t("app.benefits.notifications"),
    ],
    [t],
  );

  return (
    <div className="container pb-16 pt-8 md:pt-12">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-border/60 bg-linear-to-b from-primary/10 via-card to-card px-6 py-10 text-center sm:px-10">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-primary/15 text-primary">
            <CheckCircle2 className="size-9" strokeWidth={1.75} />
          </div>

          <p className="mt-5 text-3xl" aria-hidden>
            🎉
          </p>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
            {companyName
              ? t("subtitleWithCompany", { company: companyName })
              : t("subtitle")}
          </p>

          {orderId ? (
            <p className="mt-4 inline-flex rounded-full border border-border/60 bg-background/80 px-4 py-1.5 text-xs text-muted-foreground">
              {t("orderNumber", { id: orderId })}
            </p>
          ) : null}
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-bold tracking-tight">{t("timeline.title")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("timeline.subtitle")}
          </p>

          <ol className="relative mt-6 space-y-0 border-s border-border/70 ms-3 ps-6">
            {TIMELINE_KEYS.map((key, index) => {
              const isFirst = index === 0;
              return (
                <li key={key} className="relative pb-8 last:pb-0">
                  <span
                    className={cn(
                      "absolute -start-[1.9rem] top-0 grid size-7 place-items-center rounded-full border bg-background",
                      isFirst
                        ? "border-primary text-primary"
                        : "border-border text-muted-foreground",
                    )}
                  >
                    {isFirst ? (
                      <CheckCircle2 className="size-4" />
                    ) : (
                      <Circle className="size-3.5" />
                    )}
                  </span>
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      isFirst ? "text-primary" : "text-foreground",
                    )}
                  >
                    {t(`timeline.steps.${key}`)}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {t(`timeline.hints.${key}`)}
                  </p>
                </li>
              );
            })}
          </ol>
        </section>

        <div className="mt-10">
          <DownloadAppSection
            title={t("app.title")}
            description={t("app.description")}
            benefits={benefits}
          />
        </div>

        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/products">{t("cta.browse")}</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/">{t("cta.home")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
