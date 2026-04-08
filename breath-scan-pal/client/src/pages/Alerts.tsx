import { AlertTriangle, Bell, BellOff, CheckCheck, Info } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "../lib/trpc";
import { formatDate, cn } from "../lib/utils";

const severityConfig = {
  critical: {
    icon: AlertTriangle,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    badge: "bg-red-500/15 text-red-400",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    badge: "bg-yellow-500/15 text-yellow-400",
  },
  info: {
    icon: Info,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    badge: "bg-blue-500/15 text-blue-400",
  },
};

export function Alerts() {
  const utils = trpc.useUtils();
  const { data: alerts, isLoading } = trpc.alert.list.useQuery({ limit: 50 });
  const markRead = trpc.alert.markRead.useMutation({
    onSuccess: () => utils.alert.list.invalidate(),
  });
  const markAllRead = trpc.alert.markAllRead.useMutation({
    onSuccess: () => {
      toast.success("All alerts marked as read");
      utils.alert.list.invalidate();
      utils.alert.unreadCount.invalidate();
    },
  });

  const unreadCount = alerts?.filter(a => !a.read).length ?? 0;

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Alerts</h1>
          <p className="text-gray-400 mt-1">
            {unreadCount > 0
              ? `${unreadCount} unread alert${unreadCount > 1 ? "s" : ""}`
              : "All caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllRead.mutate()}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </div>

      {isLoading && (
        <div className="text-center py-12 text-gray-500">Loading…</div>
      )}

      {!isLoading && (!alerts || alerts.length === 0) && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-16 text-center">
          <BellOff className="w-10 h-10 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No alerts</p>
          <p className="text-gray-600 text-sm mt-1">
            Your respiratory patterns are looking good.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {alerts?.map(alert => {
          const cfg =
            severityConfig[alert.severity as keyof typeof severityConfig] ??
            severityConfig.info;
          const Icon = cfg.icon;

          return (
            <div
              key={alert.id}
              onClick={() => {
                if (!alert.read) markRead.mutate({ alertId: alert.id });
              }}
              className={cn(
                "bg-gray-900 border rounded-xl p-5 transition-all",
                alert.read
                  ? "border-gray-800 opacity-60"
                  : cn("border cursor-pointer hover:brightness-110", cfg.border)
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn("p-2 rounded-lg mt-0.5", cfg.bg)}>
                  <Icon className={cn("w-4 h-4", cfg.color)} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold text-white text-sm">
                      {alert.title}
                    </h3>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                        cfg.badge
                      )}
                    >
                      {alert.severity}
                    </span>
                    {!alert.read && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {alert.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {formatDate(alert.createdAt)}
                  </p>
                </div>
              </div>

              {!alert.read && (
                <p className="text-xs text-gray-500 mt-3 text-right">
                  Click to mark as read
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
