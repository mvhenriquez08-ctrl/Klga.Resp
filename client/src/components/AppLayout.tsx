import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useRoute } from "wouter";
import { Search, WifiOff, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AlertsPanel } from "@/components/clinical/AlertsPanel";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    window.addEventListener("beforeinstallprompt", e => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => setDeferredPrompt(null));
    }
  };

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
              {deferredPrompt && (
                <button
                  onClick={handleInstall}
                  className="hidden sm:flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" /> Instalar App
                </button>
              )}
              <AlertsPanel />
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                Modo Clínico
              </span>
            </div>
          </header>
          {isOffline && (
            <div className="bg-destructive/10 border-b border-destructive/20 text-destructive text-xs py-1.5 px-4 flex items-center justify-center gap-2 font-medium">
              <WifiOff className="h-3.5 w-3.5" />
              Modo Offline Activo. Algunos datos se sincronizarán al recuperar
              la conexión.
            </div>
          )}
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
