import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './features/auth/AuthContext';
import PrivateRoute from './shared/components/PrivateRoute';
import AppShell from './shared/components/AppShell';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import DashboardPage from './features/dashboard/DashboardPage';
import InventoryPage from './features/inventory/InventoryPage';
import AlertsPage from './features/alerts/AlertsPage';
import OrdersPage from './features/orders/OrdersPage';
import SuppliersPage from './features/suppliers/SuppliersPage';
import AdminPage from './features/admin/AdminPage';

// Supplier Portal
import SupplierLayout from './features/supplier-portal/SupplierLayout';
import SupplierDashboard from './features/supplier-portal/SupplierDashboard';
import SupplierOrders from './features/supplier-portal/SupplierOrders';
import SupplierAlerts from './features/supplier-portal/SupplierAlerts';
import SupplierInvoices from './features/supplier-portal/SupplierInvoices';
import SupplierProfile from './features/supplier-portal/SupplierProfile';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30000, retry: 1 },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected — Manager/Staff inside AppShell */}
            <Route element={<PrivateRoute><AppShell /></PrivateRoute>}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/suppliers" element={<SuppliersPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Route>

            {/* Protected — Supplier Portal */}
            <Route element={<PrivateRoute><SupplierLayout /></PrivateRoute>}>
              <Route path="/supplier/dashboard" element={<SupplierDashboard />} />
              <Route path="/supplier/orders" element={<SupplierOrders />} />
              <Route path="/supplier/alerts" element={<SupplierAlerts />} />
              <Route path="/supplier/invoices" element={<SupplierInvoices />} />
              <Route path="/supplier/profile" element={<SupplierProfile />} />
            </Route>

            {/* Redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: "'Inter', sans-serif",
              fontSize: '13px',
              borderRadius: '8px',
              padding: '12px 16px',
            },
            success: { style: { borderLeft: '4px solid #27AE60' } },
            error: { style: { borderLeft: '4px solid #C0392B' } },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}