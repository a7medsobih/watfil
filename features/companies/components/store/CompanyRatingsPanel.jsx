"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { MessageSquareQuote, Star, Trash2 } from "lucide-react";

import EmptyState from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRequireAuth } from "@/features/auth";
import {
  deleteCompanyRating,
  rateCompany,
} from "@/features/companies/api";
import { useRouter } from "@/i18n/navigation";
import { useAuthStore, useIsAuthenticated } from "@/stores/auth-store";
import { cn } from "@/lib/utils";

function Stars({
  value = 0,
  interactive = false,
  onSelect,
  size = "md",
  className,
}) {
  const starClass =
    size === "lg" ? "size-7" : size === "sm" ? "size-3.5" : "size-4";
  const rounded = Math.round(Number(value) || 0);

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      role={interactive ? "radiogroup" : undefined}
    >
      {Array.from({ length: 5 }).map((_, index) => {
        const score = index + 1;
        const active = score <= rounded;

        if (!interactive) {
          return (
            <Star
              key={score}
              className={cn(
                starClass,
                active
                  ? "fill-warning text-warning"
                  : "text-muted-foreground/35",
              )}
              aria-hidden
            />
          );
        }

        return (
          <button
            key={score}
            type="button"
            role="radio"
            aria-checked={score === rounded}
            aria-label={`${score}`}
            className="rounded-full p-0.5 transition-transform hover:scale-110"
            onClick={() => onSelect?.(score)}
          >
            <Star
              className={cn(
                starClass,
                active
                  ? "fill-warning text-warning"
                  : "text-muted-foreground/35",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

function formatDate(value, locale) {
  if (!value) return "";
  const date = new Date(String(value).replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function RatingCard({ item, locale, labels }) {
  const name = item.customer?.fullName?.trim() || labels.anonymous;
  const initial = (name[0] || "?").toUpperCase();

  return (
    <article className="rounded-3xl border border-border/60 bg-card p-5">
      <div className="flex items-start gap-3">
        <Avatar size="lg">
          <AvatarFallback className="bg-primary/10 font-semibold text-primary">
            {initial}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className="font-semibold">{name}</h3>
            <Stars value={item.rating} size="sm" />
          </div>

          {item.comment ? (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {item.comment}
            </p>
          ) : null}

          {item.createdAt ? (
            <p className="text-xs text-muted-foreground">
              {formatDate(item.createdAt, locale)}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

/**
 * Company ratings: public reviews first, then create/update/delete form.
 * Matches customer company rating API (not product ratings).
 */
export default function CompanyRatingsPanel({
  companyId,
  ratings: initialRatings = [],
  myRating: initialMyRating = null,
  averageRating: initialAverage = null,
  ratingsCount: initialCount = 0,
  viewsCount = 0,
  likesCount = 0,
  locale = "ar",
  onSummaryChange,
}) {
  const t = useTranslations("company");
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const { openLogin } = useRequireAuth("login");

  const [ratings, setRatings] = useState(initialRatings);
  const [myRating, setMyRating] = useState(initialMyRating);
  const [averageRating, setAverageRating] = useState(initialAverage);
  const [ratingsCount, setRatingsCount] = useState(initialCount);
  const [draftRating, setDraftRating] = useState(initialMyRating ?? 0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("newest");

  const ownRating = useMemo(() => {
    const userId = user?.id;
    if (userId == null) return null;
    return (
      ratings.find((item) => item.customer?.id != null && Number(item.customer.id) === Number(userId)) ??
      null
    );
  }, [ratings, user?.id]);

  useEffect(() => {
    setRatings(initialRatings);
    setMyRating(initialMyRating);
    setAverageRating(initialAverage);
    setRatingsCount(initialCount);
    setDraftRating(initialMyRating ?? 0);
  }, [
    companyId,
    initialRatings,
    initialMyRating,
    initialAverage,
    initialCount,
  ]);

  // Prefer explicit my_rating; fall back to matching the logged-in customer in ratings[].
  useEffect(() => {
    if (initialMyRating != null) return;
    if (ownRating?.rating == null) return;
    setMyRating(ownRating.rating);
    setDraftRating(ownRating.rating);
  }, [initialMyRating, ownRating]);

  // Prefill optional comment from the customer's existing review.
  useEffect(() => {
    setComment(ownRating?.comment ?? "");
  }, [companyId, ownRating?.id, ownRating?.comment]);

  const labels = useMemo(
    () => ({
      anonymous: t("ratings.anonymous"),
    }),
    [t],
  );

  const sortedRatings = useMemo(() => {
    const list = [...ratings];
    if (sort === "highest") {
      return list.sort((a, b) => Number(b.rating ?? 0) - Number(a.rating ?? 0));
    }
    return list.sort((a, b) => {
      const aTime = new Date(String(a.createdAt ?? "").replace(" ", "T")).getTime();
      const bTime = new Date(String(b.createdAt ?? "").replace(" ", "T")).getTime();
      return (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime);
    });
  }, [ratings, sort]);

  const applySummary = (data) => {
    if (!data) return;
    const nextAverage =
      data.average_rating != null ? Number(data.average_rating) : null;
    const nextCount = Number(data.ratings_count ?? 0);
    const nextMy =
      data.my_rating != null && data.my_rating !== ""
        ? Number(data.my_rating)
        : null;

    setAverageRating(nextAverage);
    setRatingsCount(nextCount);
    setMyRating(nextMy);
    setDraftRating(nextMy ?? 0);
    onSummaryChange?.({
      rating: nextAverage,
      reviews: nextCount,
      myRating: nextMy,
    });
  };

  const submit = async () => {
    if (!isAuthenticated || !token) {
      openLogin();
      return;
    }

    if (!draftRating || draftRating < 1 || draftRating > 5) {
      toast.error(t("ratings.validation"));
      return;
    }

    setLoading(true);
    try {
      const trimmed = comment.trim();
      const response = await rateCompany(
        companyId,
        {
          rating: draftRating,
          // Send comment key so empty clears; API only updates when key is present.
          comment: trimmed.length > 0 ? trimmed : null,
        },
        token,
      );
      applySummary(response?.data ?? response);
      toast.success(t("ratings.toast.saved"));
      router.refresh();
    } catch (error) {
      toast.error(error?.message || t("ratings.toast.error"));
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    if (!isAuthenticated || !token) {
      openLogin();
      return;
    }

    setLoading(true);
    try {
      const response = await deleteCompanyRating(companyId, token);
      applySummary(response?.data ?? response);
      setDraftRating(0);
      setComment("");
      toast(t("ratings.toast.deleted"));
      router.refresh();
    } catch (error) {
      toast.error(error?.message || t("ratings.toast.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="rounded-3xl border border-border/60 bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="text-3xl font-bold tabular-nums text-primary">
              {averageRating != null ? Number(averageRating).toFixed(1) : "--"}
            </p>
            <Stars value={averageRating ?? 0} className="mt-1" />
          </div>
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground">
              {t("ratings.summary", { count: ratingsCount })}
            </p>
            <p className="mt-1">
              {viewsCount} {t("views")} · {likesCount} {t("likes")}
            </p>
            {myRating != null && (
              <p className="mt-1">{t("myRating", { rating: myRating })}</p>
            )}
          </div>
        </div>
      </div>

      {/* Customer reviews first */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-semibold">
          {t("ratings.customerReviews")}
        </h3>
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant={sort === "newest" ? "default" : "outline"}
            onClick={() => setSort("newest")}
          >
            {t("ratings.sortNewest")}
          </Button>
          <Button
            type="button"
            size="sm"
            variant={sort === "highest" ? "default" : "outline"}
            onClick={() => setSort("highest")}
          >
            {t("ratings.sortHighest")}
          </Button>
        </div>
      </div>

      {sortedRatings.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {sortedRatings.map((item) => (
            <RatingCard
              key={item.id}
              item={item}
              locale={locale}
              labels={labels}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<MessageSquareQuote className="size-7 sm:size-8" aria-hidden />}
          title={t("ratings.emptyTitle")}
          description={t("ratings.empty")}
        />
      )}

      {/* Write / edit rating at the bottom */}
      <div className="rounded-3xl border border-border/60 bg-card p-5 sm:p-6">
        <h3 className="text-base font-semibold">
          {myRating != null ? t("ratings.editTitle") : t("ratings.addTitle")}
        </h3>

        {!isAuthenticated ? (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <p className="text-sm text-muted-foreground">
              {t("ratings.loginRequired")}
            </p>
            <Button type="button" variant="outline" onClick={openLogin}>
              {t("ratings.signIn")}
            </Button>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <Stars
              value={draftRating}
              interactive
              size="lg"
              onSelect={setDraftRating}
            />

            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              maxLength={1000}
              rows={3}
              placeholder={t("ratings.commentPlaceholder")}
              className="w-full resize-y rounded-2xl border border-border/60 bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />

            <div className="flex flex-wrap gap-2">
              <Button type="button" disabled={loading} onClick={submit}>
                {loading ? (
                  <span
                    className="size-2 animate-pulse rounded-full bg-current"
                    aria-hidden
                  />
                ) : null}
                {myRating != null ? t("ratings.update") : t("ratings.submit")}
              </Button>

              {myRating != null && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                  onClick={remove}
                >
                  <Trash2 aria-hidden />
                  {t("ratings.delete")}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
