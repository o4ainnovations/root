import { CountUp } from "@/components/animations/count-up";

interface Stat {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
}

export function StatCounter({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div key={i} className="card-depth-1 p-6 text-center">
          <CountUp
            end={stat.value}
            prefix={stat.prefix}
            suffix={stat.suffix}
            className="font-heading text-3xl font-bold text-ink block mb-2"
          />
          <p className="label-uppercase">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
