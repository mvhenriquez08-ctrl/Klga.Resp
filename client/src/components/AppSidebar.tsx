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
  FileDown,
  Library,
  ShieldCheck,
  GraduationCap,
  FlaskConical,
  LogOut,
  Link2,
  Bot,
  Wind,
  Layers,
  Box,
  Share2,
  PlayCircle,
} from "lucide-react";
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


const vmiItems = [
  { title: "Biblioteca", url: "/vm/biblioteca", icon: Activity },
  { title: "Curvas y Loops", url: "/vm/curvas", icon: TrendingUp },
  // { title: "Asistente PulmoIA", url: "/ia", icon: Bot }, (Centralized in IA & Datos)
  { title: "Asincronías", url: "/vm/asincronias", icon: AlertTriangle },
  { title: "Weaning", url: "/vm/weaning", icon: HeartPulse },
  { title: "Índices Avanzados", url: "/vm/indices", icon: Calculator },
];

const vmniItems = [
  { title: "Biblioteca", url: "/vm/noninvasiva", icon: Wind },
  { title: "Asincronías", url: "/vm/asincronias-vmni", icon: AlertTriangle },
];

const arrhythmiaItems = [
  {
    title: "Biblioteca Arritmias",
    url: "/arritmias/biblioteca",
    icon: HeartPulse,
  },
];

const ecmoItems = [{ title: "Módulo ECMO", url: "/ecmo", icon: Activity }];

const clinicalItems = [
  { title: "Scores UCI", url: "/scores", icon: Calculator },
  { title: "Hemodinamia", url: "/hemodinamia", icon: Activity },
  { title: "Vademécum", url: "/vademecum", icon: ShieldCheck },
  { title: "Gasometría", url: "/gasometria", icon: FlaskConical },
];

const iaItems = [
  { title: "Biblioteca Inteligente", url: "/conocimiento", icon: Library },
];

const educationItems = [
  { title: "Centro de Evaluación", url: "/quiz", icon: GraduationCap },
  { title: "Flashcards", url: "/flashcards", icon: Layers },
  {
    title: "Simulador de Paciente",
    url: "/simulador-dinamico",
    icon: PlayCircle,
  },
];


type SidebarItem = {
  title: string;
  url: string;
  icon: React.ElementType;
};

type SidebarNavGroup = {
  label: string;
  items: SidebarItem[];
};

const groups: SidebarNavGroup[] = [
  { label: "General", items: homeItems },
  { label: "Clínico", items: clinicalItems },
  { label: "Ventilación Invasiva (VMI)", items: vmiItems },
  { label: "Ventilación No Invasiva (VMNI)", items: vmniItems },
  { label: "Arritmias & ECG", items: arrhythmiaItems },
  { label: "ECMO", items: ecmoItems },
  { label: "IA & Datos", items: iaItems },
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
                      tooltip={item.title}
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
      className={`w-full text-sidebar-foreground/60 hover:text-sidebar-foreground ${collapsed ? "justify-center px-0" : "justify-start"}`}
      onClick={logout}
      title={collapsed ? "Cerrar sesión" : undefined}
    >
      <LogOut className={`h-4 w-4 ${collapsed ? "" : "mr-2"}`} />
      {!collapsed && (
        <span className="text-xs truncate">
          {user?.email || "Cerrar sesión"}
        </span>
      )}
    </Button>
  );
}
