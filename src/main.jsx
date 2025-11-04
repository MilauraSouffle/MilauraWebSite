import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
import '@/index.css';
import { CartProvider } from '@/hooks/useCart';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import { EmotionalDashboardProvider } from '@/contexts/EmotionalDashboardContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <EmotionalDashboardProvider>
            <App />
            <Toaster />
          </EmotionalDashboardProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </>
);