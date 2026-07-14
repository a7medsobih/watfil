// component/animations/Reveal.jsx 
"use client";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";

export default function Reveal({
    children,
    direction = "up",
    delay = 0,
}) {
    const controls = useAnimation();
    const ref = useRef(null);

    const hidden = {
        opacity: 0,
        x: direction === "left" ? -40 : direction === "right" ? 40 : 0,
        y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
    };

    const visible = { opacity: 1, x: 0, y: 0 };

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                const rect = element.getBoundingClientRect();
                const isBelow = rect.top > 0; // العنصر تحت الـ viewport

                if (entry.isIntersecting) {
                    // دخل الـ viewport → شغّل ✅
                    controls.start(visible);
                } else if (isBelow) {
                    // خرج لتحت → reset (عشان لما تنزل يشتغل تاني) ✅
                    controls.start(hidden);
                }
                // خرج لفوق → مفيش حاجة (فضل visible) ✅
            },
            { rootMargin: "-80px" }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    return (
        <motion.div
            ref={ref}
            initial={hidden}
            animate={controls}
            transition={{ duration: 0.4, ease: "easeOut", delay }}
        >
            {children}
        </motion.div>
    );
}