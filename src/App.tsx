import { Toaster } from "@/componants/ui/toaster";
import { Toaster as Sonner } from "@/componants/ui/sonner";
import { TooltipProvider } from "@/componants/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./lib/pages/Index";
import Plans from "./lib/pages/Plans";
import Booking from "./lib/pages/Booking";
import Transport from "./lib/pages/Transport";
import Contact from "./lib/pages/Contact";
import Photos from "./lib/pages/Photos";
import Admin from "./lib/pages/Admin";
import NotFound from "./lib/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/photos" element={<Photos />} />
          <Route path="/admin" element={<Admin />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
