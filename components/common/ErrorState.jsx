"use client";

import { AlertTriangle, RotateCw } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Generic error boundary UI for list pages.
 *
 * @param {object} props
 * @param {string} [props.title]
 * @param {string} [props.description]
 * @param {() => void} [props.onRetry]
 * @param {string} [props.className]
 */
export default function ErrorState({
  title,
  description,
  onRetry,
  className,
}) {
  const t = useTranslations("errors");

  return (
    <div
      role="alert"
      className={cn(
        "mx-auto max-w-md rounded-3xl border border-border/60 px-6 py-14 text-center shadow-soft sm:px-10 sm:py-16",
        className,
      )}
    >
      <div className="mx-auto mb-5 grid size-16 place-items-center rounded-2xl bg-destructive/10 text-destructive sm:size-[4.5rem]">
        <AlertTriangle className="size-7 sm:size-8" aria-hidden />
      </div>

      <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
        {title ?? t("title")}
      </h2>

      <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
        {description ?? t("description")}
      </p>

      {onRetry && (
        <Button type="button" className="mt-6" onClick={onRetry}>
          <RotateCw className="size-4" aria-hidden />
          {t("retry")}
        </Button>
      )}
    </div>
  );
}
