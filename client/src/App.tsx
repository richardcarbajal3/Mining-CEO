import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { PhilosophyBanner } from "@/components/philosophy-banner";
import { FloatingButtons } from "@/components/floating-buttons";
import Dashboard from "@/pages/dashboard";
import Bloques from "@/pages/bloques";
import BlockDetail from "@/pages/block-detail";
import Contratos from "@/pages/contratos";
import Stakeholders from "@/pages/stakeholders";
import Evidencias from "@/pages/evidencias";
import KPIs from "@/pages/kpis";
import Procedimientos from "@/pages/procedimientos";
import Accionistas from "@/pages/accionistas";
import Demografico from "@/pages/demografico";
import FeedbackAdmin from "@/pages/feedback-admin";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/bloques" component={Bloques} />
      <Route path="/bloques/:id" component={BlockDetail} />
      <Route path="/contratos" component={Contratos} />
      <Route path="/stakeholders" component={Stakeholders} />
      <Route path="/evidencias" component={Evidencias} />
      <Route path="/kpis" component={KPIs} />
      <Route path="/procedimientos" component={Procedimientos} />
      <Route path="/accionistas" component={Accionistas} />
      <Route path="/demografico" component={Demografico} />
      <Route path="/feedback" component={FeedbackAdmin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <SidebarProvider style={style as React.CSSProperties}>
            <div className="flex h-screen w-full">
              <AppSidebar />
              <div className="flex flex-col flex-1">
                <header className="flex items-center justify-between p-4 border-b">
                  <SidebarTrigger data-testid="button-sidebar-toggle" />
                  <ThemeToggle />
                </header>
                <main className="flex-1 overflow-auto">
                  <div className="container mx-auto p-6 max-w-[1400px]">
                    <Router />
                  </div>
                </main>
              </div>
            </div>
            <FloatingButtons />
            <PhilosophyBanner />
          </SidebarProvider>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
