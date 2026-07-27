import { getCompanyPersonalization } from "@/features/companies/api/get-company-personalization";
import CompanyLikeCluster from "@/features/companies/components/store/CompanyLikeCluster";

/**
 * Suspense island: company like without blocking the ISR shell.
 */
export default async function PersonalizedCompanyActions({
  slugOrId,
  company,
}) {
  const { isLiked, myRating } = await getCompanyPersonalization(slugOrId);

  return (
    <CompanyLikeCluster
      company={{ ...company, isLiked, myRating }}
      initialLiked={isLiked}
      initialLikesCount={company.likes ?? 0}
    />
  );
}

export function CompanyLikeFallback() {
  return (
    <div className="size-10 animate-pulse rounded-full bg-muted" aria-hidden />
  );
}
