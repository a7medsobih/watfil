import Image from "next/image";
import {
    Facebook,
    Instagram,
    Send,
    Twitter,
    Youtube,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import logo from "@/assets/watfil-logo.png";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { WATFIL_PLAY_STORE_URL } from "@/lib/constants/app-store";

export default async function Footer() {
    const t = await getTranslations();

    return (
        <footer className="border-t border-border/60 bg-surface">
            <div className="container py-8">
                <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
                    <div>
                        <Link href="/" className="inline-flex items-center">
                            <Image
                                src={logo}
                                alt={t("brand.name")}
                                width={140}
                                height={40}
                                className="h-9 w-auto"
                            />
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
                        ]}
                    />
                    <FooterCol
                        title={t("footer.company")}
                        links={[
                            { href: "/join-us", label: t("nav.joinUs") },
                            { href: "/wishlist", label: t("nav.wishlist") },
                        ]}
                    />

                    <div>
                        <h4 className="mb-4 text-sm font-semibold">{t("footer.app")}</h4>
                        <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
                            <div className="mb-3 flex size-10 items-center justify-center overflow-hidden rounded-xl bg-background ring-1 ring-border/60">
                                <img
                                    src="/favicon.ico"
                                    alt=""
                                    width={28}
                                    height={28}
                                    className="size-7 object-contain"
                                />
                            </div>
                            <p className="text-sm font-semibold leading-snug">
                                {t("footer.appTitle")}
                            </p>
                            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                                {t("footer.appDescription")}
                            </p>
                            <a
                                href={WATFIL_PLAY_STORE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 inline-flex h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#111111] px-3 text-xs font-medium text-white transition-colors hover:bg-black"
                            >
                                {t("footer.appCta")}
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-3 flex flex-wrap justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground">
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
