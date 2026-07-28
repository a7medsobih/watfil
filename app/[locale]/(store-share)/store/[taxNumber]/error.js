"use client";

import ErrorState from "@/components/common/ErrorState";

export default function Error({ reset }) {
  return (
    <section className="container flex min-h-[50vh] items-center justify-center py-16">
      <ErrorState onRetry={reset} />
    </section>
  );
}
