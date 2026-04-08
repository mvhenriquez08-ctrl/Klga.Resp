import { useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Stethoscope, LogIn } from "lucide-react";

export default function Auth() {
  const { user, loading } = useAuth();

  useEffect(() => {
    // Si el usuario ya está autenticado, redirigir al inicio
    if (user && !loading) {
      window.location.href = "/";
    }
  }, [user, loading]);

  const handleLogin = () => {
    window.location.href = getLoginUrl();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <Card className="w-full max-w-md mx-4 shadow-xl border-0 bg-card/95 backdrop-blur-sm">
        <CardContent className="pt-12 pb-12 text-center space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent">
                <Stethoscope className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
          </div>

          {/* Contenido */}
          <div className="space-y-3">
            <h1 className="font-display text-3xl font-bold text-foreground">
              Resp Academy
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Plataforma de interpretación respiratoria avanzada y formación
              clínica
            </p>
          </div>

          {/* Descripción */}
          <div className="space-y-2 text-left bg-muted/50 rounded-lg p-4">
            <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
              Acceso a:
            </p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>✓ Biblioteca de ultrasonido pulmonar</li>
              <li>✓ Módulos de ventilación mecánica</li>
              <li>✓ Registro de pacientes y estudios</li>
              <li>✓ Herramientas de análisis clínico</li>
              <li>✓ Chat clínico con IA</li>
            </ul>
          </div>

          {/* Botón de login */}
          <Button
            onClick={handleLogin}
            size="lg"
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold py-6"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Iniciar Sesión
          </Button>

          {/* Footer */}
          <p className="text-xs text-muted-foreground">
            Al iniciar sesión, aceptas nuestros términos de uso
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
