# Soluciones de Código para el Proyecto Breath-Scan-Pal

A continuación, se presenta el código corregido para abordar los errores identificados en el informe anterior. Cada sección incluye el contexto del archivo, los cambios realizados y una breve explicación.

## 1. Corrección de Rutas en `client/src/App.tsx`

**Problema:** Las páginas de autenticación (`Auth.tsx`) y restablecimiento de contraseña (`ResetPassword.tsx`) no tenían rutas definidas, haciéndolas inaccesibles.

**Solución:** Se han añadido las rutas correspondientes en el componente `Switch` de `wouter`.

```typescript
// client/src/App.tsx

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AppLayout } from "./components/AppLayout";

// Import all pages
// ... (otras importaciones)
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword"; // <-- Nueva importación
import PulmoIA from "./pages/Pulmoia";
// ... (otras importaciones)

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Home} />
        {/* ... (otras rutas) */}

        {/* Rutas añadidas para Auth y ResetPassword */}
        <Route path="/auth" component={Auth} />
        <Route path="/reset-password" component={ResetPassword} />

        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

// ... (resto del archivo)
```

## 2. Refactorización de `client/src/pages/ResetPassword.tsx`

**Problema:** El componente `ResetPassword.tsx` utilizaba `react-router-dom` (`useNavigate`) mientras que el resto de la aplicación usaba `wouter`, causando inconsistencias y posibles errores.

**Solución:** Se ha refactorizado el componente para utilizar `useLocation` de `wouter`.

```typescript
// client/src/pages/ResetPassword.tsx

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Lock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter"; // <-- Cambio aquí: de useNavigate a useLocation

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation(); // <-- Cambio aquí: uso de useLocation para navegar

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes("type=recovery")) {
      // Supabase handles the session automatically
    }
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Contraseña actualizada",
        description: "Ya puedes iniciar sesión.",
      });
      navigate("/"); // <-- Uso de navigate de wouter
    }
  };

  // ... (resto del componente)
}
```

## 3. Mejora del Manejo de Errores en `client/src/main.tsx`

**Problema:** El frontend silenciaba intencionalmente los errores de tRPC no relacionados con la autenticación, dificultando la depuración.

**Solución:** Se ha modificado el código para que todos los errores de tRPC (tanto de `queryCache` como de `mutationCache`) se registren en la consola, permitiendo una mejor visibilidad de los problemas.

```typescript
// client/src/main.tsx

// ... (otras importaciones)

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    // Ahora se registran todos los errores de tRPC en la consola
    if (error instanceof TRPCClientError) {
      console.error("tRPC Query Error:", error);
    }
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    // Ahora se registran todos los errores de tRPC en la consola
    if (error instanceof TRPCClientError) {
      console.error("tRPC Mutation Error:", error);
    }
  }
});

// ... (resto del archivo)
```

## 4. Simplificación de Variables de Entorno en `server/aiExpressRouter.ts`

**Problema:** La carga de las claves de la API de Google AI era inconsistente y mezclaba variables de entorno de cliente (`VITE_GOOGLE_AI_KEY`) con las del servidor.

**Solución:** Se ha simplificado la lógica para buscar las claves de la API de Google AI, priorizando las variables de entorno del servidor.

```typescript
// server/aiExpressRouter.ts

// ... (otras importaciones)

const router = Router();

// ─── AI Clients ─────────────────────────────────────────────────────────────
const googleApiKey = process.env.GOOGLE_AI_KEY || process.env.GEMINI_API_KEY || ""; // <-- Cambio aquí
const openAiKey = process.env.OPENAI_API_KEY || "";

const genAI = googleApiKey ? new GoogleGenerativeAI(googleApiKey) : null;

// ... (resto del archivo)
```

## 5. Recomendaciones Adicionales

### Errores de Compilación de TypeScript

Aunque `tsc --noEmit` no reportó errores directamente, es crucial asegurar que la configuración de `tsconfig.json` sea robusta. Se recomienda revisar las opciones de compilación para garantizar que se detecten todos los posibles problemas de tipo. Si persisten dudas, un análisis manual de los archivos TypeScript más complejos puede revelar errores que el compilador, bajo ciertas configuraciones, podría pasar por alto.

### Puerto del Servidor en Producción

Para evitar problemas de conexión en entornos de producción debido al sondeo automático de puertos, se recomienda configurar explícitamente el puerto del servidor. Esto se puede hacer estableciendo la variable de entorno `PORT` en el entorno de despliegue. Por ejemplo, si la aplicación frontend espera el backend en el puerto `3001`, asegúrese de que la variable `PORT` esté configurada a `3001` en el entorno de producción del servidor.

## Conclusión

Estas correcciones abordan los problemas más críticos relacionados con la accesibilidad de rutas, la consistencia del enrutamiento, el manejo de errores y la configuración de variables de entorno. Implementar estos cambios mejorará la estabilidad, la depuración y la mantenibilidad del proyecto `breath-scan-pal`.
