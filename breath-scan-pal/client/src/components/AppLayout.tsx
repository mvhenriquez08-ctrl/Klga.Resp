import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useRoute } from "wouter";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AlertsPanel } from "@/components/clinical/AlertsPanel";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b bg-card/50 backdrop-blur-sm px-4 gap-4 shrink-0">
            <SidebarTrigger className="shrink-0" />
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar signos, protocolos..."
                className="pl-9 h-9 bg-muted/50 border-0"
              />
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <AlertsPanel />
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                Modo Clínico
              </span>
            </div>
          </header>
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
