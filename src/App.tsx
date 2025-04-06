
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PatientRecordsProvider } from "@/contexts/PatientRecordsContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoginScreen from "@/components/LoginScreen";
import Dashboard from "@/components/Dashboard";
import AddRecordForm from "@/components/AddRecordForm";
import SearchScreen from "@/components/SearchScreen";
import ViewRecord from "@/components/ViewRecord";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <PatientRecordsProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LoginScreen />} />
              
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/add-record" 
                element={
                  <ProtectedRoute>
                    <AddRecordForm />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/search" 
                element={
                  <ProtectedRoute>
                    <SearchScreen />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/view-record" 
                element={
                  <ProtectedRoute>
                    <ViewRecord />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </PatientRecordsProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
