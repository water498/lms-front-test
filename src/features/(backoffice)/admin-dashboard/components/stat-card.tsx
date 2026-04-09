interface StatCardProps {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}

export default function StatCard({ label, value, change, positive }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 px-5 py-4">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className={`text-xs mt-1 font-medium ${positive ? "text-emerald-600" : "text-red-500"}`}>
        {change} <span className="text-slate-400 font-normal">지난달 대비</span>
      </p>
    </div>
  );
}
