// src/components/common/SectionHeader.jsx

import { cn } from "@/lib/utils";

export default function SectionHeader({
    eyebrow,
    title,
    subtitle,
    actions,
    align = "start",
    className,
}) {
    return (
        <div
            className={cn(
                "mb-10",
                align === "center"
                    ? "flex flex-col items-center gap-3 text-center"
                    : "flex flex-wrap items-end justify-between gap-6",
                className,
            )}
        >
            <div className="max-w-2xl">
                {eyebrow && (
                    <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                        {eyebrow}
                    </span>
                )}

                <h2 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">
                    {title}
                </h2>

                {subtitle && (
                    <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                        {subtitle}
                    </p>
                )}
            </div>

            {actions && <div className="shrink-0">{actions}</div>}
        </div>
    );
}