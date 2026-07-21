import React from 'react'

const CampanyCard = ({ company, locale }) => {
    return (
        <article className="group overflow-hidden rounded-3xl border border-border/60 bg-card transition-all duration-300 hover:border-primary/20 hover:shadow-card">
            <Link
                to="/companies/$slug"
                params={{ slug: company.slug }}
                className="block"
            >
                <div className="relative h-44 overflow-hidden bg-muted">
                    <img
                        src={company.cover || "/images/company-placeholder.webp"}
                        alt={company.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {company.verified && (
                        <Badge className="absolute end-3 top-3">
                            <BadgeCheck className="mr-1 h-3.5 w-3.5" />
                            {locale === "ar" ? "موثقة" : "Verified"}
                        </Badge>
                    )}
                </div>

                <div className="space-y-4 p-5">
                    <h3 className="line-clamp-1 text-lg font-semibold transition-colors group-hover:text-primary">
                        {company.name}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-sm">

                        <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-warning" />
                            <span className="font-semibold">
                                {company.rating ?? "--"}
                            </span>
                            <span className="text-muted-foreground">
                                ({company.reviews ?? 0})
                            </span>
                        </div>

                        <div className="flex items-center gap-1 text-muted-foreground">
                            <Package className="h-4 w-4" />
                            <span>{company.productsCount}</span>
                        </div>

                        <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{company.governoratesCount}</span>
                        </div>

                    </div>
                </div>
            </Link>
        </article>
    )
}



