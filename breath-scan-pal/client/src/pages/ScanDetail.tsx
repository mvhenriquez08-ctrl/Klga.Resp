import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Wind,
  Droplets,
  Activity,
  Heart,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { trpc } from "../lib/trpc";
import {
  formatDate,
  scoreColor,
  scoreLabel,
  oxygenColor,
  cn,
} from "../lib/utils";

function MetricCard({
  label,
  value,
  unit,
  icon: Icon,
  color,
  valueColor = scoreColor,
}: {
  label: string;
  value: number | null | undefined;
  unit?: string;
  icon: React.ElementType;
  color: string;
  valueColor?: (v: number | null | undefined) => string;
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className={cn("p-1.5 rounded-lg", color)}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      {value != null ? (
        <p className={cn("text-2xl font-bold", valueColor(value))}>
          {value.toFixed(1)}
          {unit && (
            <span className="text-sm font-normal text-gray-400 ml-1">
              {unit}
            </span>
          )}
        </p>
      ) : (
        <p className="text-2xl font-bold text-gray-600">—</p>
      )}
    </div>
  );
}

type Finding = {
  label: string;
  value: string;
  status: "normal" | "warning" | "critical";
};

export function ScanDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: scan, isLoading } = trpc.scan.get.useQuery(
    { scanId: Number(id) },
    { refetchInterval: d => (d?.status === "processing" ? 3000 : false) }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (!scan) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-400">Scan not found.</p>
        <Link
          to="/history"
          className="text-cyan-400 hover:underline text-sm mt-2 inline-block"
        >
          Back to history
        </Link>
      </div>
    );
  }

  const findings = scan.aiFindings as Finding[] | null;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/history"
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Scan #{scan.id}</h1>
          <p className="text-gray-400 text-sm">{formatDate(scan.recordedAt)}</p>
        </div>
        <div className="ml-auto">
          {scan.status === "done" && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
              <CheckCircle className="w-3.5 h-3.5" /> Analysis complete
            </span>
          )}
          {scan.status === "processing" && (
            <span className="flex items-center gap-1.5 text-sm text-yellow-400 bg-yellow-500/10 px-3 py-1 rounded-full">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Processing…
            </span>
          )}
          {scan.status === "error" && (
            <span className="flex items-center gap-1.5 text-sm text-red-400 bg-red-500/10 px-3 py-1 rounded-full">
              <AlertTriangle className="w-3.5 h-3.5" /> Error
            </span>
          )}
          {scan.status === "pending" && (
            <span className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
              Pending
            </span>
          )}
        </div>
      </div>

      {scan.status === "processing" && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-sm text-yellow-300">
          Analysis in progress. This page will update automatically.
        </div>
      )}

      {scan.status === "error" && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-300">
          {scan.errorMessage ?? "Analysis failed. Please try again."}
        </div>
      )}

      {/* Metrics */}
      {scan.status === "done" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              label="Breathing Rate"
              value={scan.breathingRate}
              unit="bpm"
              icon={Wind}
              color="bg-cyan-500/10 text-cyan-400"
            />
            <MetricCard
              label="SpO₂ Estimate"
              value={scan.oxygenEstimate}
              unit="%"
              icon={Droplets}
              color="bg-blue-500/10 text-blue-400"
              valueColor={oxygenColor}
            />
            <MetricCard
              label="Rhythm Score"
              value={scan.rhythmScore}
              unit="/100"
              icon={Activity}
              color="bg-violet-500/10 text-violet-400"
            />
            <MetricCard
              label="Depth Score"
              value={scan.depthScore}
              unit="/100"
              icon={Heart}
              color="bg-rose-500/10 text-rose-400"
            />
          </div>

          {/* AI Summary */}
          {scan.aiSummary && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="font-semibold text-white mb-3">AI Summary</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                {scan.aiSummary}
              </p>
              {scan.patternType && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-gray-500">Pattern:</span>
                  <span className="text-xs font-medium text-cyan-400 capitalize">
                    {scan.patternType.replace("_", " ")}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Detailed Findings */}
          {findings && findings.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="font-semibold text-white mb-4">
                Detailed Findings
              </h2>
              <div className="space-y-3">
                {findings.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      {f.status === "normal" && (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      )}
                      {f.status === "warning" && (
                        <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      )}
                      {f.status === "critical" && (
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                      )}
                      <span className="text-sm text-gray-300">{f.label}</span>
                    </div>
                    <span
                      className={cn(
                        "text-sm font-medium",
                        f.status === "normal"
                          ? "text-emerald-400"
                          : f.status === "warning"
                            ? "text-yellow-400"
                            : "text-red-400"
                      )}
                    >
                      {f.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Uploaded image */}
          {scan.imageUrl && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="font-semibold text-white mb-3">Scan Image</h2>
              <img
                src={scan.imageUrl}
                alt="Scan"
                className="rounded-lg max-h-80 object-contain w-full bg-gray-800"
              />
            </div>
          )}
        </>
      )}

      {/* Notes */}
      {scan.notes && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="font-semibold text-white mb-2">Patient Notes</h2>
          <p className="text-gray-300 text-sm">{scan.notes}</p>
        </div>
      )}
    </div>
  );
}
