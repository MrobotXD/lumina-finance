import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { queryClient } from './services/queryClient';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Debts from './pages/Debts';
import Budgets from './pages/Budgets';
import Login from './pages/Login';
import Register from './pages/Register';
import ReportCenter from './pages/ReportCenter';
import Goals from './pages/Goals';
import Settings from './pages/Settings';
import Landing from './pages/Landing';
import { useAuth } from './hooks/useAuth';
import NotificationCenter from './components/ui/NotificationCenter';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center font-sans text-slate-500">Cargando la experiencia premium...</div>;
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <Toaster position="top-right" />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
              <Route path="/expenses" element={<PrivateRoute><Layout><Expenses /></Layout></PrivateRoute>} />
              <Route path="/debts" element={<PrivateRoute><Layout><Debts /></Layout></PrivateRoute>} />
              <Route path="/budgets" element={<PrivateRoute><Layout><Budgets /></Layout></PrivateRoute>} />
              <Route path="/reports" element={<PrivateRoute><Layout><ReportCenter /></Layout></PrivateRoute>} />
              <Route path="/goals" element={<PrivateRoute><Layout><Goals /></Layout></PrivateRoute>} />
              <Route path="/settings" element={<PrivateRoute><Layout><Settings /></Layout></PrivateRoute>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </BrowserRouter>
          <NotificationCenter />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
