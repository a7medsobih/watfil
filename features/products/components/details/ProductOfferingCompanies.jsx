import { Building2 } from "lucide-react";

import EmptyState from "@/components/common/EmptyState";
import SectionHeader from "@/components/common/SectionHeader";
import ProductGovernorateTabs from "@/features/products/components/details/ProductGovernorateTabs";
import ProductOfferingCompanyCard from "@/features/products/components/details/ProductOfferingCompanyCard";

/**
 * Companies selling this catalog product, filtered by governorate.
 */
export default function ProductOfferingCompanies({
  productSlug,
  offerings = [],
  governorates = [],
  selectedGovernorateId,
  locale = "ar",
  labels = {},
}) {
  return (
    <section className="mt-16 space-y-6 sm:mt-20">
      <SectionHeader
        title={labels.title}
        subtitle={labels.subtitle}
        className="mb-0"
      />

      <ProductGovernorateTabs
        productSlug={productSlug}
        governorates={governorates}
        selectedId={selectedGovernorateId}
        ariaLabel={labels.filterByGov}
        labels={{
          previous: labels.previous,
          next: labels.next,
        }}
      />

      {offerings.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {offerings.map((offering) => (
            <ProductOfferingCompanyCard
              key={offering.id}
              offering={offering}
              locale={locale}
              labels={{
                verified: labels.verified,
                installment: labels.installment,
                price: labels.price,
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
