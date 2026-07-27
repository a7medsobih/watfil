import { Suspense } from "react";

import { SearchResultsSkeleton } from "@/components/skeletons";
import { SearchPage } from "@/features/search";

export default function Page() {
  return (
    <Suspense
      fallback={
        <section className="container pb-16 pt-10">
          <SearchResultsSkeleton count={6} />
        </section>
      }
    >
      <SearchPage />
    </Suspense>
  );
}
