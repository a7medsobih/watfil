import { getCompanyPersonalization } from "@/features/companies/api/get-company-personalization";
import CompanyLikeCluster from "@/features/companies/components/store/CompanyLikeCluster";
import { CompanyPersonalizationHydrator } from "@/features/companies/context/company-personalization-context";

/**
 * Suspense island: company like + my_rating without blocking the ISR shell.
 */
export default async function PersonalizedCompanyActions({
  slugOrId,
  company,
}) {
  const { isLiked, myRating } = await getCompanyPersonalization(slugOrId);

  return (
    <>
      <CompanyPersonalizationHydrator myRating={myRating} isLiked={isLiked} />
      <CompanyLikeCluster
        company={{ ...company, isLiked, myRating }}
        initialLiked={isLiked}
        initialLikesCount={company.likes ?? 0}
      />
    </>
  );
}

export function CompanyLikeFallback() {
  return (
    <div className="size-10 animate-pulse rounded-full bg-muted" aria-hidden />
  );
}
