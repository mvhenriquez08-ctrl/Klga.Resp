import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { logAudit } from "@/lib/audit";
import {
  type InstitutionalConnection,
  type FhirPatient,
  type SyncLogEntry,
  SYSTEM_TYPES,
  AUTH_METHODS,
  CONNECTION_STATUSES,
  mapFhirToPatient,
  parseCsvPatients,
  parseJsonPatients,
} from "@/lib/fhir";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { toast } from "sonner";
import {
  Settings,
  Search,
  Upload,
  Download,
  RefreshCw,
  Plus,
  Trash2,
  Wifi,
  WifiOff,
  Clock,
  CheckCircle2,
  XCircle,
  FileUp,
  History,
} from "lucide-react";

export default function Interoperability() {
  const { user } = useAuth();
  const [connections, setConnections] = useState<InstitutionalConnection[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(
    null
  );
  const [syncLogs, setSyncLogs] = useState<SyncLogEntry[]>([]);
  const [searchResults, setSearchResults] = useState<FhirPatient[]>([]);
  const [loading, setLoading] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  // Config form
  const [configForm, setConfigForm] = useState({
    institution_name: "",
    system_type: "fhir_r4",
    base_url: "",
    auth_method: "bearer_token",
    token: "",
    username: "",
    password: "",
    api_key_header: "",
    api_key_value: "",
  });

  // Search form
  const [searchForm, setSearchForm] = useState({
    rut: "",
    name: "",
    external_id: "",
  });

  const loadConnections = useCallback(async () => {
    const { data } = (await supabase
      .from("institutional_connections")
      .select("*")
      .order("created_at", { ascending: false })) as any;
    if (data) setConnections(data);
  }, []);

  const loadSyncLogs = useCallback(async () => {
    const { data } = (await supabase
      .from("sync_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)) as any;
    if (data) setSyncLogs(data);
  }, []);

  const loadPendingCount = useCallback(async () => {
    const { count } = (await supabase
      .from("pending_sync_queue")
      .select("*", { count: "exact", head: true })
      .eq("status", "pendiente")) as any;
    setPendingCount(count || 0);
  }, []);

  useEffect(() => {
    loadConnections();
    loadSyncLogs();
    loadPendingCount();
  }, [loadConnections, loadSyncLogs, loadPendingCount]);

  const saveConnection = async () => {
    if (!user || !configForm.institution_name) return;
    setLoading(true);

    const metadata: Record<string, any> = {};
    if (configForm.auth_method === "bearer_token")
      metadata.token = configForm.token;
    if (configForm.auth_method === "basic") {
      metadata.username = configForm.username;
      metadata.password = configForm.password;
    }
    if (configForm.auth_method === "api_key") {
      metadata.api_key_header = configForm.api_key_header;
      metadata.api_key_value = configForm.api_key_value;
    }

    const payload = {
      user_id: user.id,
      institution_name: configForm.institution_name,
      system_type: configForm.system_type,
      base_url: configForm.base_url || null,
      auth_method: configForm.auth_method,
      metadata,
      connection_status: "pendiente",
    };

    const { error } = await supabase
      .from("institutional_connections")
      .insert(payload as any);
    if (error) {
      toast.error("Error al guardar conexión");
    } else {
      toast.success("Conexión institucional guardada");
      logAudit("create_connection", "institutional_connection", undefined, {
        institution: configForm.institution_name,
      });
      setConfigForm({
        institution_name: "",
        system_type: "fhir_r4",
        base_url: "",
        auth_method: "bearer_token",
        token: "",
        username: "",
        password: "",
        api_key_header: "",
        api_key_value: "",
      });
      loadConnections();
    }
    setLoading(false);
  };

  const testConnection = async (connId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("interop-sync", {
        body: { action: "test_connection", connection_id: connId },
      });
      if (error) throw error;
      if (data?.status === "conectado") {
        toast.success("Conexión exitosa");
      } else {
        toast.error("No se pudo conectar");
      }
      loadConnections();
      loadSyncLogs();
    } catch {
      toast.error("Error al probar la conexión");
    }
    setLoading(false);
  };

  const deleteConnection = async (connId: string) => {
    const { error } = (await supabase
      .from("institutional_connections")
      .delete()
      .eq("id", connId)) as any;
    if (!error) {
      toast.success("Conexión eliminada");
      loadConnections();
    }
  };

  const searchPatients = async () => {
    if (!selectedConnection) {
      toast.error("Seleccione una conexión primero");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("interop-sync", {
        body: {
          action: "search_patient",
          connection_id: selectedConnection,
          search_params: searchForm,
        },
      });
      if (error) throw error;
      setSearchResults(data?.patients || []);
      if (!data?.patients?.length) toast.info("Sin resultados");
      loadSyncLogs();
    } catch {
      toast.error("Error en la búsqueda");
    }
    setLoading(false);
  };

  const importPatient = async (patient: FhirPatient) => {
    if (!user) return;
    const mapped = mapFhirToPatient(patient, user.id);
    const { error } = await supabase.from("patients").insert(mapped as any);
    if (error) {
      toast.error("Error al importar paciente");
    } else {
      toast.success(`Paciente ${patient.name} importado`);
      logAudit("import_patient", "patient", undefined, {
        source: "interop",
        rut: patient.rut,
        connection_id: selectedConnection,
      });
    }
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    let patients: FhirPatient[] = [];

    if (file.name.endsWith(".csv")) {
      patients = parseCsvPatients(text);
    } else if (file.name.endsWith(".json")) {
      patients = parseJsonPatients(text);
    } else {
      toast.error("Formato no soportado. Use CSV o JSON.");
      return;
    }

    if (!patients.length) {
      toast.error("No se encontraron pacientes en el archivo");
      return;
    }

    setSearchResults(patients);
    toast.success(`${patients.length} pacientes encontrados en archivo`);
  };

  // Queue for offline sync
  const queueForSync = async (action: string, payload: any) => {
    if (!user || !selectedConnection) return;
    await supabase.from("pending_sync_queue").insert({
      user_id: user.id,
      connection_id: selectedConnection,
      action,
      direction: "export",
      payload,
    } as any);
    toast.info("Acción encolada para sincronización posterior");
    loadPendingCount();
  };

  const processPendingSync = async () => {
    toast.info("Procesando cola de sincronización...");
    const { data: pending } = (await supabase
      .from("pending_sync_queue")
      .select("*")
      .eq("status", "pendiente")
      .order("created_at")) as any;

    if (!pending?.length) {
      toast.info("No hay elementos pendientes");
      return;
    }

    let ok = 0;
    let fail = 0;
    for (const item of pending) {
      try {
        const { error } = await supabase.functions.invoke("interop-sync", {
          body: {
            action: item.action,
            connection_id: item.connection_id,
            export_data: item.payload,
            patient_id: item.patient_id,
          },
        });
        if (error) throw error;
        await supabase
          .from("pending_sync_queue")
          .update({ status: "completado" } as any)
          .eq("id", item.id);
        ok++;
      } catch {
        const retries = (item.retry_count || 0) + 1;
        await supabase
          .from("pending_sync_queue")
          .update({
            retry_count: retries,
            status: retries >= item.max_retries ? "fallido" : "pendiente",
            error_message: "Error en sincronización",
          } as any)
          .eq("id", item.id);
        fail++;
      }
    }

    toast.success(`Sincronización: ${ok} exitosos, ${fail} fallidos`);
    loadPendingCount();
    loadSyncLogs();
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const cfg = CONNECTION_STATUSES[status] || CONNECTION_STATUSES.pendiente;
    return (
      <Badge variant="outline" className="gap-1">
        <span className={`h-2 w-2 rounded-full ${cfg.color}`} />
        {cfg.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Interoperabilidad
          </h1>
          <p className="text-sm text-muted-foreground">
            Conexión con sistemas institucionales · HL7 FHIR R4 · API REST ·
            CSV/JSON
          </p>
        </div>
        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <Button variant="outline" size="sm" onClick={processPendingSync}>
              <Clock className="h-4 w-4 mr-1" />
              {pendingCount} pendientes
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="config">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="config" className="gap-1">
            <Settings className="h-4 w-4" /> Configuración
          </TabsTrigger>
          <TabsTrigger value="search" className="gap-1">
            <Search className="h-4 w-4" /> Buscar Pacientes
          </TabsTrigger>
          <TabsTrigger value="import" className="gap-1">
            <Upload className="h-4 w-4" /> Importar / Exportar
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1">
            <History className="h-4 w-4" /> Historial
          </TabsTrigger>
        </TabsList>

        {/* CONFIG TAB */}
        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" /> Nueva Conexión Institucional
              </CardTitle>
              <CardDescription>
                Configure la conexión con el sistema de salud de su institución
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre de Institución</Label>
                  <Input
                    placeholder="Hospital Regional, CESFAM..."
                    value={configForm.institution_name}
                    onChange={e =>
                      setConfigForm({
                        ...configForm,
                        institution_name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Sistema</Label>
                  <Select
                    value={configForm.system_type}
                    onValueChange={v =>
                      setConfigForm({ ...configForm, system_type: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SYSTEM_TYPES.map(t => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {configForm.system_type !== "manual" && (
                  <>
                    <div className="space-y-2">
                      <Label>URL Base</Label>
                      <Input
                        placeholder="https://fhir.hospital.cl/api"
                        value={configForm.base_url}
                        onChange={e =>
                          setConfigForm({
                            ...configForm,
                            base_url: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Método de Autenticación</Label>
                      <Select
                        value={configForm.auth_method}
                        onValueChange={v =>
                          setConfigForm({ ...configForm, auth_method: v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {AUTH_METHODS.map(m => (
                            <SelectItem key={m.value} value={m.value}>
                              {m.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {configForm.auth_method === "bearer_token" && (
                      <div className="space-y-2 md:col-span-2">
                        <Label>Token</Label>
                        <Input
                          type="password"
                          placeholder="Token de acceso"
                          value={configForm.token}
                          onChange={e =>
                            setConfigForm({
                              ...configForm,
                              token: e.target.value,
                            })
                          }
                        />
                      </div>
                    )}
                    {configForm.auth_method === "basic" && (
                      <>
                        <div className="space-y-2">
                          <Label>Usuario</Label>
                          <Input
                            value={configForm.username}
                            onChange={e =>
                              setConfigForm({
                                ...configForm,
                                username: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Contraseña</Label>
                          <Input
                            type="password"
                            value={configForm.password}
                            onChange={e =>
                              setConfigForm({
                                ...configForm,
                                password: e.target.value,
                              })
                            }
                          />
                        </div>
                      </>
                    )}
                    {configForm.auth_method === "api_key" && (
                      <>
                        <div className="space-y-2">
                          <Label>Header de API Key</Label>
                          <Input
                            placeholder="X-API-Key"
                            value={configForm.api_key_header}
                            onChange={e =>
                              setConfigForm({
                                ...configForm,
                                api_key_header: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Valor de API Key</Label>
                          <Input
                            type="password"
                            value={configForm.api_key_value}
                            onChange={e =>
                              setConfigForm({
                                ...configForm,
                                api_key_value: e.target.value,
                              })
                            }
                          />
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
              <Button
                onClick={saveConnection}
                disabled={loading || !configForm.institution_name}
              >
                <Plus className="h-4 w-4 mr-1" /> Guardar Conexión
              </Button>
            </CardContent>
          </Card>

          {/* Connections list */}
          <Card>
            <CardHeader>
              <CardTitle>Conexiones Configuradas</CardTitle>
            </CardHeader>
            <CardContent>
              {connections.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No hay conexiones configuradas
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Institución</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Última Sincronización</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {connections.map(conn => (
                      <TableRow key={conn.id}>
                        <TableCell className="font-medium">
                          {conn.institution_name}
                        </TableCell>
                        <TableCell>
                          {SYSTEM_TYPES.find(t => t.value === conn.system_type)
                            ?.label || conn.system_type}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={conn.connection_status} />
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {conn.last_sync_at
                            ? new Date(conn.last_sync_at).toLocaleString(
                                "es-CL"
                              )
                            : "Nunca"}
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => testConnection(conn.id)}
                            disabled={loading || conn.system_type === "manual"}
                          >
                            <Wifi className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedConnection(conn.id)}
                          >
                            <CheckCircle2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteConnection(conn.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              {selectedConnection && (
                <p className="text-xs text-muted-foreground mt-2">
                  Conexión activa:{" "}
                  <span className="font-medium text-foreground">
                    {
                      connections.find(c => c.id === selectedConnection)
                        ?.institution_name
                    }
                  </span>
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEARCH TAB */}
        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" /> Buscar Pacientes en Sistema
                Externo
              </CardTitle>
              <CardDescription>
                Busque por RUT, nombre o ID institucional
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!selectedConnection && (
                <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                  <WifiOff className="h-6 w-6 mx-auto mb-2 opacity-50" />
                  Seleccione una conexión en la pestaña Configuración primero
                </div>
              )}
              {selectedConnection && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>RUT</Label>
                      <Input
                        placeholder="12.345.678-9"
                        value={searchForm.rut}
                        onChange={e =>
                          setSearchForm({ ...searchForm, rut: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Nombre</Label>
                      <Input
                        placeholder="Nombre del paciente"
                        value={searchForm.name}
                        onChange={e =>
                          setSearchForm({ ...searchForm, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>ID Institucional</Label>
                      <Input
                        placeholder="ID interno"
                        value={searchForm.external_id}
                        onChange={e =>
                          setSearchForm({
                            ...searchForm,
                            external_id: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <Button onClick={searchPatients} disabled={loading}>
                    <Search className="h-4 w-4 mr-1" /> Buscar en Sistema
                    Externo
                  </Button>
                </>
              )}

              {searchResults.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>RUT</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Sexo</TableHead>
                      <TableHead>Fecha Nac.</TableHead>
                      <TableHead>ID Externo</TableHead>
                      <TableHead className="text-right">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchResults.map((p, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{p.rut || "—"}</TableCell>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell>{p.sex || "—"}</TableCell>
                        <TableCell>{p.birth_date || "—"}</TableCell>
                        <TableCell className="text-xs">
                          {p.external_id || "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" onClick={() => importPatient(p)}>
                            <Download className="h-3 w-3 mr-1" /> Importar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* IMPORT/EXPORT TAB */}
        <TabsContent value="import" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileUp className="h-5 w-5" /> Carga Manual
                </CardTitle>
                <CardDescription>
                  Importe pacientes desde archivo CSV o JSON
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  type="file"
                  accept=".csv,.json"
                  onChange={handleFileImport}
                />
                <p className="text-xs text-muted-foreground">
                  CSV: columnas rut, nombre, fecha_nacimiento, sexo, servicio,
                  cama, fecha_ingreso, diagnostico
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" /> Exportar Informe
                </CardTitle>
                <CardDescription>
                  Envíe informes de ecografía a la ficha clínica electrónica
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!selectedConnection ? (
                  <p className="text-sm text-muted-foreground">
                    Seleccione una conexión para exportar
                  </p>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Los informes se envían desde la ficha del paciente con el
                      botón "Enviar a ficha clínica".
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => queueForSync("export_report", {})}
                    >
                      <Clock className="h-4 w-4 mr-1" /> Encolar para envío
                      posterior
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" /> Cola de Sincronización Offline
              </CardTitle>
              <CardDescription>
                Elementos pendientes de envío al sistema externo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-sm">
                  {pendingCount > 0
                    ? `${pendingCount} elemento(s) pendiente(s)`
                    : "Sin elementos pendientes"}
                </p>
                {pendingCount > 0 && (
                  <Button size="sm" onClick={processPendingSync}>
                    <RefreshCw className="h-4 w-4 mr-1" /> Sincronizar Ahora
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* HISTORY TAB */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" /> Historial de Sincronizaciones
              </CardTitle>
              <CardDescription>
                Registro de auditoría de todas las operaciones de
                interoperabilidad
              </CardDescription>
            </CardHeader>
            <CardContent>
              {syncLogs.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Sin registros de sincronización
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Acción</TableHead>
                      <TableHead>Dirección</TableHead>
                      <TableHead>Recurso</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Error</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {syncLogs.map(log => (
                      <TableRow key={log.id}>
                        <TableCell className="text-xs">
                          {new Date(log.created_at).toLocaleString("es-CL")}
                        </TableCell>
                        <TableCell className="text-sm">{log.action}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {log.direction === "import"
                              ? "⬇ Import"
                              : "⬆ Export"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">
                          {log.resource_type || "—"}
                        </TableCell>
                        <TableCell>
                          {log.status === "exitoso" ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-destructive" />
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-destructive max-w-[200px] truncate">
                          {log.error_message || "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
