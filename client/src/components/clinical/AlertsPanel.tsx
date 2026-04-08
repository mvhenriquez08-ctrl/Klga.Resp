import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell,
  BellOff,
  AlertTriangle,
  TrendingDown,
  Activity,
  X,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function AlertsPanel() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: alerts = [] } = useQuery({
    queryKey: ["clinical-alerts"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("clinical_alerts")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50);

        if (error) {
          // Silent handling for missing table (common in initial dev)
          if (
            error.code === "PGRST116" ||
            error.message.includes('relation "clinical_alerts" does not exist')
          ) {
            return [];
          }
          console.warn("clinical_alerts query warning:", error.message);
          return [];
        }
        return data || [];
      } catch (err) {
        return [];
      }
    },
    retry: false,
  });

  // Realtime subscription
  useEffect(() => {
    // Only subscribe if we want to risk the error, or handle it
    const channel = supabase
      .channel("alerts-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "clinical_alerts",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["clinical-alerts"] });
        }
      )
      .subscribe(status => {
        if (status === "CHANNEL_ERROR") {
          console.log(
            "[Alerts] Realtime subscription unavailable (likely table missing)"
          );
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const unreadCount = alerts ? alerts.filter((a: any) => !a.is_read).length : 0;

  const dismissAlert = async (id: string) => {
    try {
      await supabase
        .from("clinical_alerts")
        .update({ is_dismissed: true })
        .eq("id", id);
      queryClient.invalidateQueries({ queryKey: ["clinical-alerts"] });
    } catch (e) {}
  };

  const markRead = async (id: string) => {
    try {
      await supabase
        .from("clinical_alerts")
        .update({ is_read: true })
        .eq("id", id);
      queryClient.invalidateQueries({ queryKey: ["clinical-alerts"] });
    } catch (e) {}
  };

  const severityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "warning":
        return <TrendingDown className="h-4 w-4 text-warning" />;
      default:
        return <Activity className="h-4 w-4 text-info" />;
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] text-destructive-foreground flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="font-display flex items-center gap-2">
            <Bell className="h-4 w-4" /> Alertas Clínicas
          </SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-2 overflow-auto max-h-[calc(100vh-120px)]">
          {alerts.length === 0 ? (
            <div className="text-center py-12">
              <BellOff className="h-10 w-10 mx-auto mb-3 text-muted-foreground/20" />
              <p className="text-sm text-muted-foreground">
                Sin alertas activas
              </p>
            </div>
          ) : (
            alerts.map((alert: any) => (
              <div
                key={alert.id}
                className={`rounded-lg border p-3 ${!alert.is_read ? "bg-muted/50 border-primary/20" : "border-border/50"}`}
                onClick={() => markRead(alert.id)}
              >
                <div className="flex items-start gap-2">
                  {severityIcon(alert.severity)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">
                        {alert.title}
                      </p>
                      <Badge
                        variant={
                          alert.severity === "critical"
                            ? "destructive"
                            : "secondary"
                        }
                        className="text-[10px] shrink-0"
                      >
                        {alert.severity}
                      </Badge>
                    </div>
                    {alert.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {alert.description}
                      </p>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {new Date(alert.created_at).toLocaleString("es")}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 h-6 w-6"
                    onClick={e => {
                      e.stopPropagation();
                      dismissAlert(alert.id);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
