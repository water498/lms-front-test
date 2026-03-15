import StatCard from "../components/stat-card";
import { kpiStats } from "../mockData";

export default function StatsRow() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {kpiStats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
