import {
  BookOpen,
  Image,
  Brain,
  FileText,
  MapPin,
  Calculator,
  Users,
  Home,
  Stethoscope,
  Scan,
  Activity,
  TrendingUp,
  AlertTriangle,
  HeartPulse,
  FileImage,
  Eye,
  Map,
  Camera,
  ClipboardList,
  BarChart3,
  Columns2,
  FileDown,
  Database,
  Library,
  ShieldCheck,
  MessageCircle,
  GraduationCap,
  FlaskConical,
  LogOut,
  Link2,
  Wind,
} from "lucide-react";
import { Link } from "wouter";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const homeItems = [{ title: "Inicio", url: "/", icon: Home }];

const lusItems = [
  { title: "Biblioteca LUS", url: "/biblioteca", icon: BookOpen },
  { title: "Atlas Ecográfico", url: "/atlas", icon: Image },
  { title: "Simulador", url: "/simulador", icon: Brain },
  { title: "Protocolos", url: "/protocolos", icon: FileText },
  { title: "Mapa Pulmonar", url: "/mapa", icon: MapPin },
  { title: "LUS Score", url: "/calculadora", icon: Calculator },
  { title: "Adquisición", url: "/adquisicion", icon: Scan },
];

const vmItems = [
  { title: "Biblioteca VMI", url: "/vm/biblioteca", icon: Activity },
  { title: "Curvas y Loops", url: "/vm/curvas", icon: TrendingUp },
  { title: "Asistente Curvas", url: "/vm/asistente", icon: Camera },
  { title: "Asincronías", url: "/vm/asincronias", icon: AlertTriangle },
  { title: "Weaning", url: "/vm/weaning", icon: HeartPulse },
  { title: "Índices Avanzados", url: "/vm/indices", icon: Calculator },
  { title: "Registro VMI", url: "/vm/registro", icon: ClipboardList },
];

const rxItems = [
  { title: "Biblioteca RX", url: "/rx/biblioteca", icon: FileImage },
  { title: "Visor Radiográfico", url: "/rx/visor", icon: Eye },
  { title: "Mapa Torácico", url: "/rx/mapa", icon: Map },
  { title: "Registro RX", url: "/rx/registro", icon: ClipboardList },
];

const ctItems = [{ title: "Biblioteca TC", url: "/tc/biblioteca", icon: Scan }];

const arrhythmiaItems = [
  {
    title: "Biblioteca Arritmias",
    url: "/arritmias/biblioteca",
    icon: HeartPulse,
  },
];

const ecmoItems = [{ title: "Módulo ECMO", url: "/ecmo", icon: Activity }];

const nivItems = [{ title: "Biblioteca VNI", url: "/niv", icon: Wind }];

const clinicalItems = [
  { title: "Pacientes", url: "/pacientes", icon: Users },
  { title: "Scores UCI", url: "/scores", icon: Calculator },
  { title: "Hemodinamia", url: "/hemodinamia", icon: Activity },
  { title: "Farmacología UCI", url: "/vademecum", icon: ShieldCheck },
  { title: "Gasometría", url: "/gasometria", icon: FlaskConical },
  { title: "Informe PDF", url: "/informe", icon: FileDown },
];

const iaItems = [
  { title: "Biblioteca Inteligente", url: "/conocimiento", icon: Library },
  { title: "Chat Clínico", url: "/chat", icon: MessageCircle },
];

const educationItems = [
  { title: "Centro de Evaluación", url: "/quiz", icon: GraduationCap },
];

const interopItems = [
  { title: "Interoperabilidad", url: "/interoperabilidad", icon: Link2 },
];

const groups = [
  { label: "General", items: homeItems },
  { label: "Clínico", items: clinicalItems },
  { label: "Ultrasonido Pulmonar", items: lusItems },
  { label: "Ventilación Mecánica Invasiva (VMI)", items: vmItems },
  { label: "Ventilación No Invasiva", items: nivItems },
  { label: "Radiografía de Tórax", items: rxItems },
  { label: "Tomografía de Tórax", items: ctItems },
  { label: "Arritmias & ECG", items: arrhythmiaItems },
  { label: "ECMO", items: ecmoItems },
  { label: "IA & Datos", items: iaItems },
  { label: "Educación", items: educationItems },
  { label: "Integración", items: interopItems },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const [location, setLocation] = useLocation();

  const isActive = (path: string) =>
    path === "/" ? location === "/" : location.startsWith(path);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-primary">
            <Stethoscope className="h-5 w-5 text-accent-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-display text-sm font-bold text-sidebar-foreground">
                Resp Academy
              </span>
              <span className="text-[10px] text-sidebar-foreground/60">
                Plataforma Respiratoria
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {groups.map(group => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-sidebar-foreground/40 text-[10px] uppercase tracking-wider">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={isActive(item.url)}
                      onClick={() => setLocation(item.url)}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="text-sm truncate">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-2">
        <LogoutButton collapsed={collapsed} />
        {!collapsed && (
          <div className="rounded-lg bg-sidebar-accent/50 p-3">
            <p className="text-[10px] text-sidebar-foreground/50">
              Versión 3.0 · Educativo y Clínico
            </p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

function LogoutButton({ collapsed }: { collapsed: boolean }) {
  const { user, logout } = useAuth();
  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-start text-sidebar-foreground/60 hover:text-sidebar-foreground"
      onClick={logout}
    >
      <LogOut className="h-4 w-4 mr-2" />
      {!collapsed && (
        <span className="text-xs truncate">
          {user?.email || "Cerrar sesión"}
        </span>
      )}
    </Button>
  );
}
