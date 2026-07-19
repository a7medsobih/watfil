// features/home/components/HeroFloatingBadge.jsx
"use client";

import { motion } from "motion/react";
import { Droplets } from "lucide-react";
import { useLocale } from "next-intl";

export default function HeroFloatingBadge() {
  const locale = useLocale();

  return (
    <motion.div
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -bottom-4 -start-4 glass-strong rounded-2xl p-4 shadow-elegant md:-start-8"
    >
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-xl [background:var(--gradient-hero)]">
          <Droplets className="h-6 w-6 text-white" />
        </div>
        <div>
          <div className="text-2xl font-black gradient-text">99.9%</div>
          <div className="text-xs text-muted-foreground">
            {locale === "ar" ? "إزالة الملوثات" : "Contaminants removed"}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
