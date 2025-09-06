
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DirectorDashboard from "./pages/DirectorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ClientDashboard from "./pages/ClientDashboard";

const queryClient = new QueryClient();

// Компонент для защищенных маршрутов
const ProtectedRoute = ({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode; 
  allowedRoles: string[] 
}) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Компонент для автоматического перенаправления в нужную панель
const DashboardRedirect = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  switch (user.role) {
    case 'director':
      return <Navigate to="/director" replace />;
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'client':
      return <Navigate to="/client" replace />;
    default:
      return <Navigate to="/" replace />;
  }
};

const AppRoutes = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route 
        path="/" 
        element={user ? <Navigate to="/dashboard" replace /> : <Index />} 
      />
      
      <Route path="/dashboard" element={<DashboardRedirect />} />
      
      <Route 
        path="/director" 
        element={
          <ProtectedRoute allowedRoles={['director']}>
            <DirectorDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/client" 
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <ClientDashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;