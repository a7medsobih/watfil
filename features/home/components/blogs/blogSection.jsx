import { ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import BlogCard from "@/components/common/BlogCard";
import SectionCarousel from "@/components/common/SectionCarousel";
import SectionHeader from "@/components/common/SectionHeader";
import { Button } from "@/components/ui/button";
import { getFeaturedArticles } from "@/features/blog/api";
import { Link } from "@/i18n/navigation";

const HOME_ARTICLES_LIMIT = 6;

export default async function BlogSection() {
  const t = await getTranslations();
  const locale = await getLocale();
  const { articles } = await getFeaturedArticles({
    limit: HOME_ARTICLES_LIMIT,
  });

  if (!articles.length) return null;

  return (
    <section className="container py-10">
      <SectionHeader
        eyebrow={locale === "ar" ? "من المدونة" : "From the blog"}
        title={t("blog.latest")}
        subtitle={t("home.blog.subtitle")}
        actions={
          <Button variant="outline" className="text-xs md:text-sm" asChild>
            <Link href="/blog" className="group">
              {t("cta.viewAll")}{" "}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Link>
          </Button>
        }
      />

      <SectionCarousel
        ariaLabel={t("blog.latest")}
        gridClassName="md:grid-cols-2 lg:grid-cols-3"
        itemClassName="basis-[88%] sm:basis-[60%]"
      >
        {articles.map((article) => (
          <BlogCard
            key={article.id}
            article={article}
            locale={locale}
            readMoreLabel={t("cta.readMore")}
            readTimeLabel={t("blog.readTime")}
          />
        ))}
      </SectionCarousel>
    </section>
  );
}
