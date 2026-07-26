"use client";

import ErrorState from "@/components/common/ErrorState";

export default function Error({ reset }) {
  return (
    <section className="container py-20">
      <ErrorState onRetry={reset} />
    </section>
  );
}
