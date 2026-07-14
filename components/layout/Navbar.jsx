import { Droplets } from "lucide-react";
import Link from "next/link";
import { navItems } from "@/lib/constants/nav";
import Image from "next/image";

const Navbar = () => {
    // return (
    //     <header className="sticky top-0 z-50 w-full">
    //         <div className="glass-strong border-b border-border/60">
    //             <div className="container-page flex h-16 items-center gap-4 md:h-20">
    //                 <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
    //                     <Image src="" alt="logo" width={100} height={100} />
    //                     <span className="text-xl font-extrabold tracking-tight">
    //                         {t("brand.name")}
    //                     </span>
    //                 </Link>

    //                 <nav className="hidden lg:flex items-center gap-1 ms-4">
    //                     {navItems.map((item) => {
    //                         const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
    //                         return (
    //                             <Link
    //                                 key={item.href}
    //                                 href={item.href}
    //                                 className={cn(
    //                                     "relative px-4 py-2 text-sm font-medium rounded-full transition-colors",
    //                                     active
    //                                         ? "text-primary"
    //                                         : "text-muted-foreground hover:text-foreground",
    //                                 )}
    //                             >
    //                                 {t(item.key)}
    //                                 {active && (
    //                                     <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full [background:var(--gradient-hero)]" />
    //                                 )}
    //                             </Link>
    //                         );
    //                     })}
    //                 </nav>

    //                 <div className="flex-1" />

    //                 <div className="hidden md:flex items-center gap-1">
    //                     <Button variant="ghost" size="icon" asChild aria-label={t("nav.search")}>
    //                         <Link to="/search"><Search className="h-4.5 w-4.5" /></Link>
    //                     </Button>
    //                     <Button variant="ghost" size="icon" asChild aria-label={t("nav.compare")}>
    //                         <Link to="/compare"><GitCompare className="h-4.5 w-4.5" /></Link>
    //                     </Button>
    //                     <Button variant="ghost" size="icon" asChild aria-label={t("nav.wishlist")}>
    //                         <Link to="/wishlist"><Heart className="h-4.5 w-4.5" /></Link>
    //                     </Button>
    //                     <Button variant="ghost" size="icon" onClick={toggleLocale} aria-label="Language">
    //                         <Globe className="h-4.5 w-4.5" />
    //                         <span className="sr-only">{locale}</span>
    //                     </Button>
    //                     <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Theme">
    //                         {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
    //                     </Button>
    //                 </div>

    //                 <div className="hidden md:flex items-center gap-2 ms-2">
    //                     <Button variant="ghost" size="sm" asChild>
    //                         <Link to="/auth/login">{t("nav.login")}</Link>
    //                     </Button>
    //                     <Button variant="hero" size="sm" asChild>
    //                         <Link to="/auth/register">{t("nav.register")}</Link>
    //                     </Button>
    //                 </div>

    //                 <Button
    //                     variant="ghost"
    //                     size="icon"
    //                     className="md:hidden"
    //                     onClick={() => setOpen((v) => !v)}
    //                     aria-label="Menu"
    //                 >
    //                     {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    //                 </Button>
    //             </div>

    //             {open && (
    //                 <div className="md:hidden border-t border-border/60 animate-fade-in">
    //                     <div className="container-page py-4 flex flex-col gap-1">
    //                         {navItems.map((item) => (
    //                             <Link
    //                                 key={item.to}
    //                                 to={item.to}
    //                                 onClick={() => setOpen(false)}
    //                                 className="px-4 py-3 rounded-xl text-sm font-medium hover:bg-accent"
    //                             >
    //                                 {t(item.key)}
    //                             </Link>
    //                         ))}
    //                         <div className="flex flex-wrap gap-2 mt-3">
    //                             <Button variant="ghost" size="sm" onClick={toggleLocale}>
    //                                 <Globe className="h-4 w-4" /> {locale === "en" ? "العربية" : "English"}
    //                             </Button>
    //                             <Button variant="ghost" size="sm" onClick={toggleTheme}>
    //                                 {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    //                                 {theme === "dark" ? "Light" : "Dark"}
    //                             </Button>
    //                         </div>
    //                         <div className="flex gap-2 mt-2">
    //                             <Button variant="outline" size="sm" asChild className="flex-1">
    //                                 <Link to="/auth/login" onClick={() => setOpen(false)}>{t("nav.login")}</Link>
    //                             </Button>
    //                             <Button variant="hero" size="sm" asChild className="flex-1">
    //                                 <Link to="/auth/register" onClick={() => setOpen(false)}>{t("nav.register")}</Link>
    //                             </Button>
    //                         </div>
    //                     </div>
    //                 </div>
    //             )}
    //         </div>
    //     </header>
    // )
}

export default Navbar