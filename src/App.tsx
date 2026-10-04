import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AidaHubLayout } from "./pages/AidaHubLayout";
import { LoginGate } from "./pages/LoginGate";
import { LandingPageVSL } from "./pages/LandingPageVSL";
import { ManaTriagemQuiz } from "./pages/ManaTriagemQuiz";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function RootGateway() {
  const token = typeof window !== "undefined" ? localStorage.getItem("aida_access_token") : null;
  if (token) {
    return <AidaHubLayout />;
  }
  return <LandingPageVSL />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Gateway Raiz: Se autenticado vai pro Hub, se não vai pra Landing Page */}
          <Route path="/" element={<RootGateway />} />

          {/* Páginas Públicas do Funil de Conversão */}
          <Route path="/landing" element={<LandingPageVSL />} />
          <Route path="/triagem" element={<ManaTriagemQuiz />} />
          <Route path="/quiz" element={<Navigate to="/triagem" replace />} />

          {/* Autenticação & Acesso */}
          <Route path="/login" element={<LoginGate />} />

          {/* Hub do Jogador (rotas internas do cockpit) */}
          <Route path="/hub/*" element={<AidaHubLayout />} />
          <Route path="/*" element={<AidaHubLayout />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
