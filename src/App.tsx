
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import GlobalChatBot from "@/components/GlobalChatBot";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DirectorDashboard from "./pages/DirectorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import StudentDiary from "./pages/StudentDiary";
import TrainerPanel from "./pages/TrainerPanel";
import DirectorPanel from "./pages/DirectorPanel";
import KineticUniverse from "./pages/KineticUniverse";
import CharacterCreation from "./pages/CharacterCreation";
import KineticAdmin from "./pages/KineticAdmin";

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
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      
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
      
      
      <Route 
        path="/diary" 
        element={
          <ProtectedRoute allowedRoles={['student', 'parent', 'client']}>
            <StudentDiary />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/trainer" 
        element={
          <ProtectedRoute allowedRoles={['trainer', 'admin']}>
            <TrainerPanel />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/director-panel" 
        element={
          <ProtectedRoute allowedRoles={['director']}>
            <DirectorPanel />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/kinetic-universe" 
        element={
          <ProtectedRoute allowedRoles={['client', 'admin', 'director']}>
            <KineticUniverse />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/character-creation" 
        element={
          <ProtectedRoute allowedRoles={['client', 'admin', 'director']}>
            <CharacterCreation />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/kinetic-admin" 
        element={
          <ProtectedRoute allowedRoles={['admin', 'director']}>
            <KineticAdmin />
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
          <GlobalChatBot />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;