import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayoutSkeleton } from "@/components/DashboardLayoutSkeleton";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

import { UserRole } from "shared/roles";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[]; // Ej: ['owner', 'admin']
}

export function RoleProtectedRoute({
  children,
  allowedRoles,
}: RoleProtectedRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setLocation("/auth");
      return;
    }

    const checkRole = async () => {
      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id);

        if (error || !data) throw error;

        const userRoles = data.map(r => r.role);
        // Verifica si el usuario tiene al menos uno de los roles permitidos
        const hasAccess = allowedRoles.some(role => userRoles.includes(role));
        setIsAuthorized(hasAccess);
      } catch (err) {
        setIsAuthorized(false);
      }
    };

    checkRole();
  }, [user, authLoading, allowedRoles, setLocation]);

  if (authLoading || isAuthorized === null) return <DashboardLayoutSkeleton />;

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center p-6">
        <Shield className="h-16 w-16 text-muted-foreground/30" />
        <h2 className="text-2xl font-bold text-muted-foreground">
          Acceso restringido
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          No tienes los permisos o el rol necesario para acceder a esta sección.
        </p>
        <Button variant="outline" onClick={() => setLocation("/")}>
          Volver al inicio
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
