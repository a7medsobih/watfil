// features/home/components/WaterBackdrop.jsx
import { motion } from "motion/react";

export function WaterBackdrop() {
    return (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 gradient-mesh opacity-70" />
            {[
                { size: 320, x: "10%", y: "20%", delay: 0 },
                { size: 220, x: "80%", y: "15%", delay: 1.5 },
                { size: 180, x: "70%", y: "70%", delay: 3 },
                { size: 260, x: "20%", y: "75%", delay: 2 },
            ].map((b, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full blur-3xl"
                    style={{
                        width: b.size,
                        height: b.size,
                        left: b.x,
                        top: b.y,
                        background: i % 2 === 0 ? "var(--primary)" : "var(--secondary)",
                        opacity: 0.18,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        x: [0, 15, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 8 + i * 1.5,
                        delay: b.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}
            {/* Floating droplets */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={`d-${i}`}
                    className="absolute h-2 w-2 rounded-full bg-primary/40"
                    style={{
                        left: `${15 + i * 14}%`,
                        top: `${20 + (i % 3) * 20}%`,
                    }}
                    animate={{ y: [0, -20, 0], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                />
            ))}
        </div>
    );
}
