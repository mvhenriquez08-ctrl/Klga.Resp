import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Activity,
  TrendingUp,
  Shield,
  Search,
  Download,
  Loader2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { isOwner } from "@/lib/roles";
import { exportPatientsToExcel } from "@/lib/excel";
import * as XLSX from "xlsx";

interface UserInfo {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  full_name: string | null;
  roles: string[];
}

export default function OwnerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    async function checkAccess() {
      if (!user) {
        setAuthorized(false);
        return;
      }
      const ownerCheck = await isOwner(user.id);
      setAuthorized(ownerCheck);
      if (ownerCheck) loadData();
    }
    checkAccess();
  }, [user]);

  async function loadData() {
    setLoading(true);
    try {
      // Get profiles
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      // Get roles
      const { data: roles } = await supabase.from("user_roles").select("*");

      // Get activity
      const { data: activity } = await supabase
        .from("user_activity")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      // Get audit logs
      const { data: logs } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      const userMap: UserInfo[] = (profiles || []).map((p: any) => ({
        id: p.id,
        email: p.full_name || p.id,
        created_at: p.created_at,
        last_sign_in_at: null,
        full_name: p.full_name,
        roles: (roles || [])
          .filter((r: any) => r.user_id === p.id)
          .map((r: any) => r.role),
      }));

      // Enrich with activity data
      (activity || []).forEach((a: any) => {
        const u = userMap.find(u => u.id === a.user_id);
        if (u) {
          u.email = a.user_email || u.email;
          if (
            !u.last_sign_in_at ||
            new Date(a.created_at) > new Date(u.last_sign_in_at)
          ) {
            u.last_sign_in_at = a.created_at;
          }
        }
      });

      setUsers(userMap);
      setAuditLogs(logs || []);
    } catch (err) {
      console.error("Error loading owner data", err);
    } finally {
      setLoading(false);
    }
  }

  if (authorized === null) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Shield className="h-16 w-16 text-muted-foreground/30" />
        <h2 className="text-xl font-bold text-muted-foreground">
          Acceso restringido
        </h2>
        <p className="text-sm text-muted-foreground">
          Solo el propietario de la plataforma puede acceder a esta sección.
        </p>
        <Button variant="outline" onClick={() => navigate("/")}>
          Volver al inicio
        </Button>
      </div>
    );
  }

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const activeLastWeek = users.filter(
    u => u.last_sign_in_at && new Date(u.last_sign_in_at) >= sevenDaysAgo
  ).length;
  const activeLastMonth = users.filter(
    u => u.last_sign_in_at && new Date(u.last_sign_in_at) >= thirtyDaysAgo
  ).length;
  const newThisMonth = users.filter(
    u => new Date(u.created_at) >= monthStart
  ).length;

  const filteredUsers = users.filter(u => {
    if (roleFilter !== "all" && !u.roles.includes(roleFilter)) return false;
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      u.email.toLowerCase().includes(s) ||
      (u.full_name || "").toLowerCase().includes(s)
    );
  });

  const exportUsers = () => {
    const rows = filteredUsers.map(u => ({
      Nombre: u.full_name || "",
      Email: u.email,
      "Fecha registro": new Date(u.created_at).toLocaleDateString("es-CL"),
      "Último acceso": u.last_sign_in_at
        ? new Date(u.last_sign_in_at).toLocaleDateString("es-CL")
        : "—",
      Roles: u.roles.join(", ") || "Sin rol",
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Usuarios");
    XLSX.writeFile(
      wb,
      `usuarios_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1 flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" /> Panel del Propietario
          </h1>
          <p className="text-muted-foreground text-sm">
            Analítica de uso y gestión de usuarios
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          icon={<Users className="h-5 w-5 text-primary" />}
          label="Total usuarios"
          value={users.length}
        />
        <MetricCard
          icon={<Activity className="h-5 w-5 text-accent-foreground" />}
          label="Activos (7d)"
          value={activeLastWeek}
        />
        <MetricCard
          icon={<TrendingUp className="h-5 w-5 text-primary" />}
          label="Activos (30d)"
          value={activeLastMonth}
        />
        <MetricCard
          icon={<Users className="h-5 w-5 text-accent-foreground" />}
          label="Nuevos este mes"
          value={newThisMonth}
        />
      </div>

      {/* User List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-sm font-display">
              Usuarios registrados
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar..."
                  className="pl-8 h-8 w-48 text-xs"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="h-8 w-32 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="medico">Médico</SelectItem>
                  <SelectItem value="kinesiologo">Kinesiólogo</SelectItem>
                  <SelectItem value="enfermeria">Enfermería</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={exportUsers}>
                <Download className="h-3.5 w-3.5 mr-1" /> Excel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Nombre</TableHead>
                  <TableHead className="text-xs">Email</TableHead>
                  <TableHead className="text-xs">Registro</TableHead>
                  <TableHead className="text-xs">Último acceso</TableHead>
                  <TableHead className="text-xs">Roles</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map(u => (
                  <TableRow key={u.id}>
                    <TableCell className="text-xs font-medium">
                      {u.full_name || "—"}
                    </TableCell>
                    <TableCell className="text-xs">{u.email}</TableCell>
                    <TableCell className="text-xs">
                      {new Date(u.created_at).toLocaleDateString("es-CL")}
                    </TableCell>
                    <TableCell className="text-xs">
                      {u.last_sign_in_at
                        ? new Date(u.last_sign_in_at).toLocaleDateString(
                            "es-CL"
                          )
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {u.roles.length > 0 ? (
                        u.roles.map(r => (
                          <Badge
                            key={r}
                            variant="secondary"
                            className="text-[9px] mr-1 capitalize"
                          >
                            {r}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline" className="text-[9px]">
                          Sin rol
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Audit Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-display">
            Registro de auditoría (últimos 50)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {auditLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              Sin registros de auditoría aún.
            </p>
          ) : (
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {auditLogs.map((log: any) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between text-xs py-1.5 border-b border-border/30 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[9px] capitalize">
                      {log.action}
                    </Badge>
                    <span className="text-muted-foreground">
                      {log.entity_type}
                    </span>
                    <span className="text-muted-foreground/60 truncate max-w-[120px]">
                      {log.user_email}
                    </span>
                  </div>
                  <span className="text-muted-foreground/60">
                    {new Date(log.created_at).toLocaleString("es-CL")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">{icon}</div>
        <div>
          <p className="text-2xl font-display font-bold">{value}</p>
          <p className="text-[10px] text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
