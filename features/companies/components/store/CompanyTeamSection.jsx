"use client";

import { useTranslations } from "next-intl";

import SectionCarousel from "@/components/common/SectionCarousel";
import TeamMemberCard from "@/features/companies/components/store/TeamMemberCard";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * Company team — Embla carousel on mobile, grid from md+ (same as services).
 * Hidden entirely when the API returns no team members.
 */
export default function CompanyTeamSection({ team = [], className }) {
  const t = useTranslations("company");

  if (!team.length) return null;

  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
            {t("tabs.team")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("teamSubtitle")}
          </p>
        </div>
        <Badge variant="secondary" className="rounded-full">
          {team.length} {t("tabs.team")}
        </Badge>
      </div>

      <SectionCarousel
        ariaLabel={t("tabs.team")}
        gridClassName="md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        itemClassName="basis-[85%] sm:basis-[48%]"
      >
        {team.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </SectionCarousel>
    </section>
  );
}
