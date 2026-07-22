import { ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import BlogCard from "@/components/common/BlogCard";
import SectionHeader from "@/components/common/SectionHeader";
import { Button } from "@/components/ui/button";
import { getFeaturedArticles } from "@/features/blog/api";
import { Link } from "@/i18n/navigation";

export default async function BlogSection() {
  const t = await getTranslations();
  const locale = await getLocale();
  const { articles } = await getFeaturedArticles();

  return (
    <section className="container py-16">
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

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <BlogCard
            key={article.id}
            article={article}
            locale={locale}
            readMoreLabel={t("cta.readMore")}
          />
        ))}
      </div>
    </section>
  );
}
