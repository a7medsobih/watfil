/**
 * Maps public statistics payload into a stable UI model.
 */
export function mapStatistics(data = {}) {
  return {
    productsCount: Number(data.products_count ?? 0),
    companiesCount: Number(data.companies_count ?? 0),
    verifiedRatingsCount: Number(data.verified_ratings_count ?? 0),
    governoratesCount: Number(data.governorates_count ?? 0),
  };
}
