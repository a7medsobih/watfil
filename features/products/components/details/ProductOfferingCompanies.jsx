import { Building2 } from "lucide-react";

import EmptyState from "@/components/common/EmptyState";
import SectionHeader from "@/components/common/SectionHeader";
import ProductGovernorateSelect from "@/features/products/components/details/ProductGovernorateSelect";
import ProductOfferingCompanyCard from "@/features/products/components/details/ProductOfferingCompanyCard";

/**
 * Companies selling this catalog product, filtered by governorate.
 */
export default function ProductOfferingCompanies({
  productId,
  offerings = [],
  governorates = [],
  selectedGovernorateId,
  locale = "ar",
  labels = {},
}) {
  return (
    <section className="mt-12 space-y-5 sm:mt-16 sm:space-y-6" id="choose-company">
      <SectionHeader
        title={labels.title}
        subtitle={labels.subtitle}
        className="mb-0"
      />

      <ProductGovernorateSelect
        productId={productId}
        governorates={governorates}
        selectedId={selectedGovernorateId}
        ariaLabel={labels.filterByGov}
        label={labels.filterByGov}
        className="max-w-sm"
      />

      {offerings.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {offerings.map((offering) => (
            <ProductOfferingCompanyCard
              key={offering.id}
              offering={offering}
              locale={locale}
              selectedGovernorateId={selectedGovernorateId}
              labels={{
                verified: labels.verified,
                installment: labels.installment,
                price: labels.price,
                buyNow: labels.buyNow,
                browseCompany: labels.browseCompany,
                buyFromCompany: labels.buyFromCompany,
                warranty: labels.warranty,
                installation: labels.installation,
                offers: labels.offers,
                branchesCount: labels.branchesCount,
              }}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Building2 className="size-7 sm:size-8" aria-hidden />}
          title={labels.emptyTitle}
          description={labels.empty}
        />
      )}
    </section>
  );
}
