// src/components/common/ProductCard.jsx

import Image from "next/image";
import Link from "next/link";
import { Heart, GitCompare, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ProductCard({
    product,
    locale = "en",
    t = (value) => value,
    className = "",
    onWishlist,
    onCompare,
}) {
    return (
        <article
            className={`group relative flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card hover-lift ${className}`}
        >
            <Link
                href={`/products/${product.slug}`}
                className="relative block aspect-square overflow-hidden gradient-water"
            >
                <Image
                    src={product.image}
                    alt={t(product.name)}
                    fill
                    sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {product.badge && (
                    <Badge className="absolute top-3 start-3 rounded-full border-0 bg-primary px-3 py-1 text-primary-foreground shadow-card">
                        {t(product.badge)}
                    </Badge>
                )}

                <div className="absolute top-3 end-3 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                        variant="glass"
                        size="iconSm"
                        aria-label="Wishlist"
                        onClick={(e) => {
                            e.preventDefault();
                            onWishlist?.(product);
                        }}
                    >
                        <Heart className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="glass"
                        size="iconSm"
                        aria-label="Compare"
                        onClick={(e) => {
                            e.preventDefault();
                            onCompare?.(product);
                        }}
                    >
                        <GitCompare className="h-4 w-4" />
                    </Button>
                </div>
            </Link>

            <div className="flex flex-1 flex-col p-5">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {product.brand}
                </span>

                <h3 className="mt-1.5 min-h-[2.75rem] text-base font-semibold leading-snug line-clamp-2">
                    <Link
                        href={`/products/${product.slug}`}
                        className="transition-colors hover:text-primary"
                    >
                        {t(product.name)}
                    </Link>
                </h3>

                <div className="mt-3 flex items-center gap-1.5 text-xs">
                    <Star className="h-3.5 w-3.5 fill-warning text-warning" />

                    <span className="font-semibold">
                        {Number(product.rating).toFixed(1)}
                    </span>

                    <span className="text-muted-foreground">
                        ({product.reviews})
                    </span>

                    <span className="mx-1.5 text-muted-foreground">·</span>

                    <span className="text-muted-foreground">
                        {product.companiesCount}{" "}
                        {locale === "ar" ? "شركة" : "companies"}
                    </span>
                </div>

                <div className="mt-4 flex items-baseline gap-2 border-t border-border/60 pt-4">
                    <span className="text-xs text-muted-foreground">
                        {locale === "ar" ? "يبدأ من" : "From"}
                    </span>

                    <span className="gradient-text text-lg font-bold">
                        {Number(product.priceFrom).toLocaleString()}{" "}
                        {locale === "ar" ? "ج.م" : "EGP"}
                    </span>
                </div>
            </div>
        </article>
    );
}