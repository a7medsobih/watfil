"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

import CampanyCard from "@/components/common/CampanyCard";
import EmptyState from "@/components/common/EmptyState";
import PageHeader from "@/components/common/PageHeader";
import ProductCard from "@/components/common/ProductCard";
import { SearchResultsSkeleton } from "@/components/skeletons";
import { Button } from "@/components/ui/button";
import { searchCatalog } from "@/features/search/api/search-catalog";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const DEBOUNCE_MS = 300;
const FILTERS = ["all", "products", "companies"];

function readParam(searchParams, key, fallback = "") {
  const value = searchParams.get(key);
  return value != null && value !== "" ? value : fallback;
}

/**
 * Global search page: debounce → URL sync → abortable no-store fetch.
 * Keeps previous results visible (dimmed) while a new request is in flight.
 */
export default function SearchPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlQ = readParam(searchParams, "q");
  const urlType = FILTERS.includes(readParam(searchParams, "type", "all"))
    ? readParam(searchParams, "type", "all")
    : "all";

  const [input, setInput] = useState(urlQ);
  const [syncedQ, setSyncedQ] = useState(urlQ);
  const [type, setType] = useState(urlType);

  const [results, setResults] = useState({
    products: [],
    companies: [],
    query: "",
  });
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(Boolean(urlQ));
  const abortRef = useRef(null);

  if (urlQ !== syncedQ) {
    setSyncedQ(urlQ);
    setInput(urlQ);
  }

  const syncUrl = useCallback(
    (nextQ, nextType) => {
      const params = new URLSearchParams();
      const q = String(nextQ || "").trim();
      if (q) params.set("q", q);
      if (nextType && nextType !== "all") params.set("type", nextType);
      const qs = params.toString();
      router.replace(qs ? `/search?${qs}` : "/search", { scroll: false });
    },
    [router],
  );

  // Debounce input → URL
  useEffect(() => {
    const next = input.trim();
    const current = urlQ.trim();
    if (next === current) return undefined;

    const timer = setTimeout(() => {
      syncUrl(next, type);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [input, urlQ, type, syncUrl]);

  // Sync type filter → URL immediately
  useEffect(() => {
    if (type === urlType) return;
    syncUrl(urlQ, type);
  }, [type, urlType, urlQ, syncUrl]);

  // Fetch when URL q/type change
  useEffect(() => {
    const q = urlQ.trim();
    if (!q) {
      setResults({ products: [], companies: [], query: "" });
      setHasSearched(false);
      setLoading(false);
      return undefined;
    }

    setHasSearched(true);
    setLoading(true);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    searchCatalog({
      q,
      type: urlType,
      locale,
      signal: controller.signal,
    })
      .then((data) => {
        if (controller.signal.aborted) return;
        setResults({
          products: data.products.products ?? [],
          companies: data.companies.companies ?? [],
          query: data.query,
        });
      })
      .catch((error) => {
        if (error?.name === "AbortError" || controller.signal.aborted) return;
        setResults({ products: [], companies: [], query: q });
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [urlQ, urlType, locale]);

  const showProducts = urlType === "all" || urlType === "products";
  const showCompanies = urlType === "all" || urlType === "companies";
  const hasResults =
    (showProducts && results.products.length > 0) ||
    (showCompanies && results.companies.length > 0);
  const showSkeleton = loading && !hasResults;
  const dimResults = loading && hasResults;

  return (
    <>
      <PageHeader
        title={t("nav.search")}
        subtitle={t("hero.searchPlaceholder")}
        breadcrumbs={[
          { label: t("nav.home"), href: "/" },
          { label: t("nav.search") },
        ]}
      />

      <section className="container pb-16 pt-2 sm:pt-4">
        <div
          className={cn(
            "mb-6 flex h-12 w-full max-w-xl items-center gap-2 rounded-full border border-border/60 bg-card px-4 shadow-sm",
          )}
        >
          <SearchIcon
            className="h-4 w-4 shrink-0 text-muted-foreground"
            aria-hidden
          />
          <input
            type="search"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={t("hero.searchPlaceholder")}
            className="h-full w-full border-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            aria-label={t("nav.search")}
            autoComplete="off"
            autoFocus
          />
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {FILTERS.map((filter) => (
            <Button
              key={filter}
              type="button"
              size="sm"
              variant={type === filter ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setType(filter)}
            >
              {filter === "all"
                ? t("blog.allCategories")
                : filter === "products"
                  ? t("nav.products")
                  : t("nav.companies")}
            </Button>
          ))}
        </div>

        {!hasSearched ? (
          <p className="text-sm text-muted-foreground">
            {t("hero.searchPlaceholder")}
          </p>
        ) : showSkeleton ? (
          <SearchResultsSkeleton count={6} />
        ) : !hasResults ? (
          <EmptyState
            icon={<SearchIcon className="size-7 sm:size-8" aria-hidden />}
            title={t("products.emptyTitle")}
            description={t("products.empty")}
          />
        ) : (
          <div
            className={cn(
              "space-y-10 transition-opacity duration-200",
              dimResults && "opacity-50",
            )}
            aria-busy={loading || undefined}
          >
            {showProducts && results.products.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">{t("nav.products")}</h2>
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {results.products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      locale={locale}
                      variant="catalog"
                    />
                  ))}
                </div>
              </div>
            )}

            {showCompanies && results.companies.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">{t("nav.companies")}</h2>
                <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {results.companies.map((company) => (
                    <CampanyCard
                      key={company.id}
                      company={company}
                      className="h-full"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </>
  );
}
