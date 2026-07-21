export default function StatsCard({ value, label }) {
  return (
    <div className="text-center text-white">
      <div className="text-4xl font-black tracking-tight md:text-6xl">
        {Number(value ?? 0).toLocaleString()}+
      </div>

      <p className="mt-2 text-sm opacity-90 md:text-base">{label}</p>
    </div>
  );
}
