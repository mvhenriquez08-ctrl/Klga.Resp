import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { trpc, trpcClient } from "./lib/trpc";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { NewScan } from "./pages/NewScan";
import { ScanDetail } from "./pages/ScanDetail";
import { History } from "./pages/History";
import { Alerts } from "./pages/Alerts";
import { DoctorPanel } from "./pages/DoctorPanel";
import { PulmoIA } from "./pages/PulmoIA";
import NIVLibrary from "./pages/NIVLibrary";
import VMLibrary from "./pages/VMLibrary";

export default function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
      })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/scan/new" element={<NewScan />} />
              <Route path="/scan/:id" element={<ScanDetail />} />
              <Route path="/history" element={<History />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/pulmoia" element={<PulmoIA />} />
              <Route path="/vm/biblioteca" element={<VMLibrary />} />
              <Route path="/niv" element={<NIVLibrary />} />
              <Route path="/doctor" element={<DoctorPanel />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
