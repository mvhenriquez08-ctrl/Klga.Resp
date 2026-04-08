import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Wind,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "../lib/trpc";
import { formatDate, scoreColor, cn } from "../lib/utils";

export function History() {
  const [page, setPage] = useState(0);
  const limit = 15;
  const utils = trpc.useUtils();

  const {
    data: scans,
    isLoading,
    refetch,
  } = trpc.scan.list.useQuery({ limit, offset: page * limit });
  const deleteScan = trpc.scan.delete.useMutation({
    onSuccess: () => {
      toast.success("Scan deleted");
      utils.scan.list.invalidate();
    },
    onError: () => toast.error("Failed to delete scan"),
  });

  const statusIcon = (status: string) => {
    if (status === "done")
      return <CheckCircle className="w-4 h-4 text-emerald-400" />;
    if (status === "processing")
      return <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />;
    if (status === "error")
      return <AlertTriangle className="w-4 h-4 text-red-400" />;
    return <div className="w-4 h-4 rounded-full border-2 border-gray-600" />;
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Scan History</h1>
        <p className="text-gray-400 mt-1">
          All your breath scans, newest first
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3 bg-gray-800/50 border-b border-gray-800 text-xs text-gray-500 uppercase tracking-wider">
          <span>Date</span>
          <span>Pattern</span>
          <span>SpO₂</span>
          <span>Rate</span>
          <span></span>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
          </div>
        )}

        {!isLoading && (!scans || scans.length === 0) && (
          <div className="py-16 text-center">
            <Wind className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-400">No scans recorded yet</p>
            <Link
              to="/scan/new"
              className="mt-2 inline-block text-cyan-400 hover:underline text-sm"
            >
              Start your first scan
            </Link>
          </div>
        )}

        <div className="divide-y divide-gray-800">
          {scans?.map(scan => (
            <div
              key={scan.id}
              className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-5 py-3.5 hover:bg-gray-800/30 transition-colors group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {statusIcon(scan.status)}
                <div className="min-w-0">
                  <p className="text-sm text-white">
                    {formatDate(scan.recordedAt)}
                  </p>
                  {scan.notes && (
                    <p className="text-xs text-gray-500 truncate max-w-xs">
                      {scan.notes}
                    </p>
                  )}
                </div>
              </div>

              <span className="text-sm text-gray-300 capitalize">
                {scan.patternType?.replace("_", " ") ?? "—"}
              </span>

              <span
                className={cn(
                  "text-sm font-medium w-16 text-right",
                  scan.oxygenEstimate != null
                    ? scoreColor(scan.oxygenEstimate)
                    : "text-gray-600"
                )}
              >
                {scan.oxygenEstimate != null
                  ? `${scan.oxygenEstimate.toFixed(1)}%`
                  : "—"}
              </span>

              <span className="text-sm text-gray-400 w-16 text-right">
                {scan.breathingRate != null
                  ? `${scan.breathingRate.toFixed(0)} bpm`
                  : "—"}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={e => {
                    e.preventDefault();
                    if (confirm("Delete this scan?"))
                      deleteScan.mutate({ scanId: scan.id });
                  }}
                  className="p-1.5 rounded hover:bg-red-500/10 text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <Link
                  to={`/scan/${scan.id}`}
                  className="p-1.5 rounded hover:bg-gray-700 text-gray-500 hover:text-white transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {scans && scans.length >= limit && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-800">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="text-sm text-gray-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <span className="text-sm text-gray-500">Page {page + 1}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={scans.length < limit}
              className="text-sm text-gray-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
