import {
    Droplets,
    Facebook,
    Instagram,
    Send,
    Twitter,
    Youtube,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default async function Footer() {
    const t = await getTranslations();

    return (
        <footer className="border-t border-border/60 bg-surface">
            <div className="container py-8">
                <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
                    <div>
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="grid h-10 w-10 place-items-center rounded-2xl gradient-hero shadow-glow">
                                <Droplets className="h-5 w-5 text-white" strokeWidth={2.5} />
                            </div>
                            <span className="text-xl font-extrabold">{t("brand.name")}</span>
                        </Link>

                        <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
                            {t("footer.tagline")}
                        </p>

                        <form className="mt-6 flex max-w-md gap-2">
                            <input
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                            />
                            <Button type="submit" variant="hero" size="icon" aria-label="Subscribe">
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>

                        <div className="mt-6 flex gap-2">
                            {[Facebook, Instagram, Twitter, Youtube].map((Icon, index) => (
                                <Button
                                    key={index}
                                    type="button"
                                    variant="outline"
                                    size="icon-sm"
                                    aria-label="social"
                                >
                                    <Icon className="h-4 w-4" />
                                </Button>
                            ))}
                        </div>
                    </div>

                    <FooterCol
                        title={t("footer.explore")}
                        links={[
                            { href: "/products", label: t("nav.products") },
                            { href: "/companies", label: t("nav.companies") },
                            { href: "/blog", label: t("nav.blog") },
                            { href: "/search", label: t("nav.search") },
                        ]}
                    />
                    <FooterCol
                        title={t("footer.company")}
                        links={[
                            { href: "/about", label: t("nav.about") },
                            { href: "/contact", label: t("nav.contact") },
                            { href: "/", label: "Careers" },
                            { href: "/", label: "Press" },
                        ]}
                    />
                    <FooterCol
                        title={t("footer.support")}
                        links={[
                            { href: "/wishlist", label: t("nav.wishlist") },
                            { href: "/", label: "Help center" },
                            { href: "/", label: "Privacy" },
                        ]}
                    />
                </div>

                <div className="mt-12 flex flex-wrap justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground">
                    <span>
                        © {new Date().getFullYear()} {t("brand.name")}. {t("footer.rights")}
                    </span>
                    <span>{t("brand.tagline")}</span>
                </div>
            </div>
        </footer>
    );
}

function FooterCol({ title, links }) {
    return (
        <div>
            <h4 className="mb-4 text-sm font-semibold">{title}</h4>
            <ul className="space-y-2.5">
                {links.map((link) => (
                    <li key={`${link.href}-${link.label}`}>
                        <Link
                            href={link.href}
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
