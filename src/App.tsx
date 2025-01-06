import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AdminPanel } from "./components/AdminPanel";
import { ManagerDashboard } from "./components/ManagerDashboard";
import { PasswordProtected } from "./components/PasswordProtected";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <nav className="bg-white shadow-sm mb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex-shrink-0 flex items-center">
                  <img
                    src="/lovable-uploads/5a049243-a2a0-44ec-b4ad-8fbd562d9ae4.png"
                    alt="BLK Logo"
                    className="h-8 w-auto"
                  />
                </Link>
                <div className="ml-6 flex space-x-4">
                  <Link 
                    to="/dashboard" 
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/admin" 
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    Admin Panel
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/admin" element={<PasswordProtected><AdminPanel /></PasswordProtected>} />
          <Route path="/dashboard" element={<ManagerDashboard />} />
          <Route path="/" element={<ManagerDashboard />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;