"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Users } from "lucide-react";

import EmptyState from "@/components/common/EmptyState";
import CompanyRatingsPanel from "@/features/companies/components/store/CompanyRatingsPanel";
import TeamMemberCard from "@/features/companies/components/store/TeamMemberCard";
import { cn } from "@/lib/utils";

function CompanyTeamPanel({ team = [] }) {
  const t = useTranslations("company");

  if (!team.length) {
    return (
      <EmptyState
        icon={<Users className="size-7 sm:size-8" aria-hidden />}
        title={t("tabs.team")}
        description={t("teamEmpty")}
      />
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {team.map((member) => (
        <TeamMemberCard key={member.id} member={member} />
      ))}
    </div>
  );
}

/**
 * Secondary tabs for social proof and trust.
 * Only reviews and team are included (no contact tab).
 */
export default function CompanyStoreTabs({
  company,
  className,
  onRatingSummaryChange,
}) {
  const t = useTranslations("company");
  const locale = useLocale();
  const [current, setCurrent] = useState("ratings");
  const tabs = ["ratings", "team"];
  const active = tabs.includes(current) ? current : "ratings";

  return (
    <section className={cn("space-y-6", className)}>
      <div
        role="tablist"
        aria-label={t("tabsLabel")}
        className="scrollbar-none flex gap-2 overflow-x-auto pb-1"
      >
        {tabs.map((key) => {
          const isActive = current === key;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              data-company-tab={key}
              aria-selected={isActive}
              onClick={() => setCurrent(key)}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-accent",
              )}
            >
              {t(`tabs.${key}`)}
            </button>
          );
        })}
      </div>

      <div role="tabpanel">
        {current === "team" && <CompanyTeamPanel team={company.team} />}
        {current === "ratings" ? (
          <CompanyRatingsPanel
            companyId={company.id}
            ratings={company.ratings ?? []}
            myRating={company.myRating}
            averageRating={company.rating}
            ratingsCount={company.reviews ?? 0}
            viewsCount={company.viewsCount ?? 0}
            likesCount={company.likes ?? 0}
            locale={locale}
            onSummaryChange={onRatingSummaryChange}
          />
        ) : null}
      </div>
    </section>
  );
}
