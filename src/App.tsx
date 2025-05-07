
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/Rooms";
import RoomDetail from "./pages/RoomDetail";
import Reservations from "./pages/Reservations";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRooms from "./pages/admin/AdminRooms";
import AdminReservations from "./pages/admin/AdminReservations";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Client routes */}
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/rooms" element={<Layout><Rooms /></Layout>} />
          <Route path="/rooms/:id" element={<Layout><RoomDetail /></Layout>} />
          <Route path="/reservations" element={<Layout><Reservations /></Layout>} />
          <Route path="/profile" element={<Layout><Profile /></Layout>} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/rooms" element={<AdminLayout><AdminRooms /></AdminLayout>} />
          <Route path="/admin/reservations" element={<AdminLayout><AdminReservations /></AdminLayout>} />
          <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
