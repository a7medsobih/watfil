export default function CategoryCard({ name, count, Icon }) {
  return (
    <div className="group flex flex-col items-center gap-3 rounded-3xl border border-border/60 bg-card p-6 text-center hover-lift">
      <div className="grid h-14 w-14 place-items-center rounded-2xl gradient-water transition-all group-hover:[background:var(--gradient-hero)]">
        <Icon
          className="h-6 w-6 text-primary transition-colors group-hover:text-white"
          strokeWidth={2}
        />
      </div>
      <div>
        <div className="text-sm font-semibold">{name}</div>
        <div className="mt-0.5 text-xs text-muted-foreground">{count}</div>
      </div>
    </div>
  );
}
