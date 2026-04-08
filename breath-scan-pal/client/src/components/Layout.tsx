import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  Wind,
  LayoutDashboard,
  Clock,
  Bell,
  Stethoscope,
  LogOut,
  PlusCircle,
  Bot,
  Activity,
} from "lucide-react";
import { trpc } from "../lib/trpc";
import { toast } from "sonner";

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/scan/new", icon: PlusCircle, label: "New Scan" },
  { to: "/history", icon: Clock, label: "History" },
  { to: "/alerts", icon: Bell, label: "Alerts" },
  { to: "/pulmoia", icon: Bot, label: "PulmoIA" },
  { to: "/vm/biblioteca", icon: Activity, label: "VMI" },
  { to: "/niv", icon: Wind, label: "VNI" },
  { to: "/doctor", icon: Stethoscope, label: "Doctor Panel" },
];

export function Layout() {
  const navigate = useNavigate();
  const { data: user } = trpc.auth.me.useQuery();
  const { data: unread } = trpc.alert.unreadCount.useQuery(undefined, {
    refetchInterval: 30_000,
  });
  const logout = trpc.auth.logout.useMutation({
    onSuccess: () => {
      toast.success("Logged out");
      navigate("/");
    },
  });

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      <aside className="w-64 flex flex-col bg-gray-900 border-r border-gray-800">
        <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-800">
          <div className="p-2 bg-cyan-500/10 rounded-lg">
            <Wind className="w-5 h-5 text-cyan-400" />
          </div>
          <span className="font-semibold text-white tracking-tight">
            BreathScan Pal
          </span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-cyan-500/15 text-cyan-400"
                    : "text-gray-400 hover:text-gray-100 hover:bg-gray-800"
                )
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{label}</span>
              {label === "Alerts" && unread && unread.count > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {unread.count > 9 ? "9+" : unread.count}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs text-cyan-400 font-bold">
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name ?? "User"}
              </p>
              <p className="text-xs text-gray-500 truncate capitalize">
                {user?.role ?? ""}
              </p>
            </div>
          </div>
          <button
            onClick={() => logout.mutate()}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
