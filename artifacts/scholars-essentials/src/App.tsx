import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// Pages
import { Home } from "@/pages/home";
import { Essentials } from "@/pages/essentials";
import { ItemDetail } from "@/pages/item-detail";
import { Pgs } from "@/pages/pgs";
import { PgDetail } from "@/pages/pg-detail";
import { MapPage } from "@/pages/map-page";
import { Dashboard } from "@/pages/dashboard";
import { Login } from "@/pages/login";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/essentials" component={Essentials} />
          <Route path="/essentials/:id" component={ItemDetail} />
          <Route path="/pgs" component={Pgs} />
          <Route path="/pgs/:id" component={PgDetail} />
          <Route path="/map" component={MapPage} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/login" component={Login} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
