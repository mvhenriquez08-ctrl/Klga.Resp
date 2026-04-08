import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AppLayout } from "./components/AppLayout";

// Import all pages
import Home from "./pages/Home";
// import Library from "./pages/Library"; (Merged into Atlas)
// import Atlas from "./pages/Atlas";
// import Simulator from "./pages/Simulator"; (Merged into DynamicSimulator)
// import Protocols from "./pages/Protocols";
// import LUSCalculator from "./pages/LUSCalculator";
// import Acquisition from "./pages/Acquisition";
import VMLibrary from "./pages/VMLibrary";
import NIVLibrary from "./pages/NIVLibrary";
import VMCurves from "./pages/VMCurves";
import VMAsynchronies from "./pages/VMAsynchronies";
import VMWeaning from "./pages/VMWeaning";
import VMNIAsynchronyTeacher from "./pages/VMNIAsynchronyTeacher";
import VMIAsynchronyTeacher from "./pages/VMIAsynchronyTeacher";
// import VMCurvesAssistant from "./pages/VMCurvesAssistant"; (Merged into Pulmoia)
import VMIndices from "./pages/VMIndices";
import KnowledgeLibrary from "./pages/KnowledgeLibrary";
import ClinicalChat from "./pages/ClinicalChat";
import ABGModule from "./pages/ABGModule";
import ArrhythmiasLibrary from "./pages/ArrhythmiasLibrary";
import ComparisonMode from "./pages/ComparisonMode";
import ECMOLibrary from "./pages/ECMOLibrary";
import UCIScores from "./pages/UCIScores";
import Hemodynamics from "./pages/Hemodynamics";
import Vademecum from "./pages/Vademecum";
import ABGTrends from "./pages/ABGTrends";
import OwnerDashboard from "./pages/OwnerDashboard";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
// import Thorax3DMap from "./pages/Thorax3DMap";
import CommunityCases from "./pages/CommunityCases";

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Home} />
        {/* <Route path="/atlas" component={Atlas} /> */}
        {/* <Route path="/protocolos" component={Protocols} /> */}
        {/* <Route path="/adquisicion" component={Acquisition} /> */}
        <Route path="/vm/biblioteca" component={VMLibrary} />
        <Route path="/vm/noninvasiva" component={NIVLibrary} />
        <Route path="/vm/curvas" component={VMCurves} />
        <Route path="/vm/asincronias" component={VMAsynchronies} />
        <Route
          path="/vm/teacher-asincronias"
          component={VMIAsynchronyTeacher}
        />
        <Route path="/vm/weaning" component={VMWeaning} />
        <Route path="/vm/asincronias-vmni" component={VMNIAsynchronyTeacher} />
        <Route path="/vm/indices" component={VMIndices} />

        <Route path="/conocimiento" component={KnowledgeLibrary} />
        <Route path="/chat" component={ClinicalChat} />
        <Route path="/gasometria" component={ABGModule} />
        <Route path="/arritmias/biblioteca" component={ArrhythmiasLibrary} />
        <Route path="/arritmias/comparativo" component={ComparisonMode} />
        <Route path="/ecmo" component={ECMOLibrary} />
        <Route path="/scores" component={UCIScores} />
        <Route path="/hemodinamia" component={Hemodynamics} />
        <Route path="/vademecum" component={Vademecum} />
        <Route path="/owner" component={OwnerDashboard} />
        {/* <Route path="/3d-map" component={Thorax3DMap} /> */}

        <Route path="/auth" component={Auth} />
        <Route path="/reset-password" component={ResetPassword} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
