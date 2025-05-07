
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/Rooms";
import RoomDetail from "./pages/RoomDetail";
import Reservations from "./pages/Reservations";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/rooms" element={<Layout><Rooms /></Layout>} />
          <Route path="/rooms/:id" element={<Layout><RoomDetail /></Layout>} />
          <Route path="/reservations" element={<Layout><Reservations /></Layout>} />
          <Route path="/profile" element={<Layout><Profile /></Layout>} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
