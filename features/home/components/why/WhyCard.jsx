

export default function WhyCard({ icon: Icon, title, description, index = 0 }) {
  return (
    <div
      className="rounded-3xl border border-border/60 bg-card p-6 hover-lift"
    >
      <div className="grid h-12 w-12 place-items-center rounded-2xl gradient-water">
        <Icon className="h-6 w-6 text-primary" />
      </div>

      <h3 className="mt-5 text-lg font-bold">{title}</h3>

      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
