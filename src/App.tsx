import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Flowbite } from 'flowbite-react';
import { useTranslation } from 'react-i18next';

// Pages
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import AppList from './pages/AppList';
import AppDetail from './pages/AppDetail';
import Campaigns from './pages/Campaigns';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Context
import { AuthProvider } from './contexts/AuthContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Theme
import { flowbiteTheme } from './theme';

function App() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  console.log(" App isAuthenticated:", isAuthenticated)

  useEffect(() => {
    // Check if user is authenticated
    const user = localStorage.getItem('user');
    setIsAuthenticated(!!user);
  }, [location]);

  return (
    <Flowbite theme={{ theme: flowbiteTheme }}>
      <AuthProvider>
        <CurrencyProvider>
          <NotificationProvider>
            <div dir={i18n.dir()} className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/apps" element={
                  <ProtectedRoute>
                    <Layout>
                      <AppList />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/apps/:id" element={
                  <ProtectedRoute>
                    <Layout>
                      <AppDetail />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/campaigns" element={
                  <ProtectedRoute>
                    <Layout>
                      <Campaigns />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/notifications" element={
                  <ProtectedRoute>
                    <Layout>
                      <Notifications />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Layout>
                      <Settings />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </div>
          </NotificationProvider>
        </CurrencyProvider>
      </AuthProvider>
    </Flowbite>
  );
}

export default App;