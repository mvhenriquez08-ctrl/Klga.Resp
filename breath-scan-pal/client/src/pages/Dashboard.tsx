import { Link } from "react-router-dom";
import {
  Wind,
  Activity,
  Droplets,
  TrendingUp,
  PlusCircle,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { trpc } from "../lib/trpc";
import { formatDate, scoreColor, oxygenColor } from "../lib/utils";
import { cn } from "../lib/utils";

function StatCard({
  label,
  value,
  unit,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  unit?: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm text-gray-400">{label}</span>
        <div className={cn("p-1.5 rounded-lg", color)}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-white">
        {value}
        {unit && (
          <span className="text-sm font-normal text-gray-400 ml-1">{unit}</span>
        )}
      </p>
    </div>
  );
}

function PatternBadge({ type }: { type: string | null | undefined }) {
  const map: Record<string, string> = {
    normal: "bg-emerald-500/15 text-emerald-400",
    shallow: "bg-yellow-500/15 text-yellow-400",
    rapid: "bg-orange-500/15 text-orange-400",
    irregular: "bg-red-500/15 text-red-400",
    slow: "bg-blue-500/15 text-blue-400",
    hyperventilation: "bg-red-500/15 text-red-400",
    apnea_risk: "bg-red-700/20 text-red-300",
  };
  const t = type ?? "normal";
  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
        map[t] ?? "bg-gray-700 text-gray-300"
      )}
    >
      {t.replace("_", " ")}
    </span>
  );
}

export function Dashboard() {
  const { data: scans, isLoading } = trpc.scan.list.useQuery({ limit: 5 });
  const { data: alerts } = trpc.alert.list.useQuery({
    limit: 3,
    onlyUnread: true,
  });

  const latest = scans?.[0];
  const avgOxygen = scans
    ?.filter(s => s.oxygenEstimate)
    .reduce((a, s, _, arr) => a + (s.oxygenEstimate ?? 0) / arr.length, 0);
  const avgRhythm = scans
    ?.filter(s => s.rhythmScore)
    .reduce((a, s, _, arr) => a + (s.rhythmScore ?? 0) / arr.length, 0);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Your respiratory health overview</p>
        </div>
        <Link
          to="/scan/new"
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          New Scan
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Scans"
          value={scans?.length ?? 0}
          icon={Activity}
          color="bg-cyan-500/10 text-cyan-400"
        />
        <StatCard
          label="Avg. SpO₂"
          value={avgOxygen ? avgOxygen.toFixed(1) : "—"}
          unit={avgOxygen ? "%" : undefined}
          icon={Droplets}
          color="bg-blue-500/10 text-blue-400"
        />
        <StatCard
          label="Avg. Rhythm"
          value={avgRhythm ? avgRhythm.toFixed(0) : "—"}
          unit={avgRhythm ? "/100" : undefined}
          icon={TrendingUp}
          color="bg-emerald-500/10 text-emerald-400"
        />
        <StatCard
          label="Last Breathing Rate"
          value={latest?.breathingRate ? latest.breathingRate.toFixed(0) : "—"}
          unit={latest?.breathingRate ? "bpm" : undefined}
          icon={Wind}
          color="bg-violet-500/10 text-violet-400"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent scans */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
            <h2 className="font-semibold text-white">Recent Scans</h2>
            <Link
              to="/history"
              className="text-xs text-cyan-400 hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-800">
            {isLoading && (
              <div className="px-5 py-8 text-center text-gray-500 text-sm">
                Loading…
              </div>
            )}
            {!isLoading && (!scans || scans.length === 0) && (
              <div className="px-5 py-10 text-center">
                <Wind className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">
                  No scans yet. Start with a new scan.
                </p>
              </div>
            )}
            {scans?.map(scan => (
              <Link
                key={scan.id}
                to={`/scan/${scan.id}`}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-800/50 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <PatternBadge type={scan.patternType} />
                    {scan.status === "processing" && (
                      <span className="text-xs text-yellow-400">
                        Processing…
                      </span>
                    )}
                    {scan.status === "error" && (
                      <span className="text-xs text-red-400">Error</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {formatDate(scan.recordedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  {scan.oxygenEstimate != null && (
                    <span
                      className={cn(
                        "font-medium",
                        oxygenColor(scan.oxygenEstimate)
                      )}
                    >
                      {scan.oxygenEstimate.toFixed(1)}%
                    </span>
                  )}
                  {scan.breathingRate != null && (
                    <span className="text-gray-400">
                      {scan.breathingRate.toFixed(0)} bpm
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent alerts */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
            <h2 className="font-semibold text-white">Active Alerts</h2>
            <Link
              to="/alerts"
              className="text-xs text-cyan-400 hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-800">
            {!alerts || alerts.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="text-gray-500 text-sm">
                  No active alerts. All looks good!
                </p>
              </div>
            ) : (
              alerts.map(alert => (
                <div key={alert.id} className="px-5 py-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle
                      className={cn(
                        "w-4 h-4 mt-0.5 flex-shrink-0",
                        alert.severity === "critical"
                          ? "text-red-400"
                          : alert.severity === "warning"
                            ? "text-yellow-400"
                            : "text-blue-400"
                      )}
                    />
                    <div>
                      <p className="text-sm font-medium text-white">
                        {alert.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                        {alert.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
