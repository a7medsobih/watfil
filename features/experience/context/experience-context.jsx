"use client";

import { createContext, useContext, useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { EXPERIENCE } from "@/features/experience/constants";
import {
  isCampaignExperience,
  resolveExperience,
} from "@/features/experience/utils";

const ExperienceContext = createContext({
  experience: EXPERIENCE.WEBSITE,
  isCampaign: false,
});

/**
 * Experience layer — UI shell only (website | campaign).
 * Content routes, SEO, and company components stay shared.
 *
 * @param {{
 *   children: import("react").ReactNode,
 *   forceExperience?: "website"|"campaign"|null,
 * }} props
 */
export function ExperienceProvider({ children, forceExperience = null }) {
  const searchParams = useSearchParams();

  const value = useMemo(() => {
    const experience =
      forceExperience === EXPERIENCE.CAMPAIGN ||
      forceExperience === EXPERIENCE.WEBSITE
        ? forceExperience
        : resolveExperience(searchParams);

    return {
      experience,
      isCampaign: isCampaignExperience(experience),
    };
  }, [forceExperience, searchParams]);

  return (
    <ExperienceContext.Provider value={value}>
      {children}
    </ExperienceContext.Provider>
  );
}

export function useExperience() {
  return useContext(ExperienceContext);
}
