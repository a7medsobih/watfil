import {
  Droplets,
  Hammer,
  Package,
  Phone,
  Settings,
  Shield,
  ShieldCheck,
  Sparkles,
  Truck,
  Wrench,
} from "lucide-react";

const ICON_MAP = {
  truck: Truck,
  wrench: Wrench,
  package: Package,
  shield: Shield,
  "shield-check": ShieldCheck,
  shieldcheck: ShieldCheck,
  hammer: Hammer,
  phone: Phone,
  settings: Settings,
  droplets: Droplets,
  sparkles: Sparkles,
  maintenance: Wrench,
  warranty: ShieldCheck,
  installation: Truck,
  delivery: Truck,
};

/**
 * Resolves a Lucide icon from an API icon string (kebab / snake / loose names).
 * @param {string|null|undefined} name
 * @param {import("lucide-react").LucideIcon} [fallback]
 */
export function resolveLucideIcon(name, fallback = Package) {
  if (!name || typeof name !== "string") return fallback;

  const key = name.trim().toLowerCase().replace(/[_\s]+/g, "-");
  return ICON_MAP[key] ?? ICON_MAP[key.replace(/-/g, "")] ?? fallback;
}
