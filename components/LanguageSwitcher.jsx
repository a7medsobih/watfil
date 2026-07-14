"use client";
import { Link, usePathname } from "@/i18n/navigation";

export default function LanguageSwitcher() {
    const pathname = usePathname();

    return (
        <div className="flex gap-2">
            <Link href={pathname} locale="en" className="px-3 py-1 border rounded">
                EN
            </Link>

            <Link href={pathname} locale="ar" className="px-3 py-1 border rounded">
                AR
            </Link>
        </div>
    );
}