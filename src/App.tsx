import { useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Flowbite } from "flowbite-react";
import { useTranslation } from "react-i18next";

// Pages
import Landing from "./features/Landing";
import Auth from "./features/Auth";
import Dashboard from "./features/Dashboard/container";
import AppList from "./features/AppList";
import AppDetail from "./features/AppDetail";
import Campaigns from "./features/Campaigns";
import Notifications from "./features/Notifications";
import Settings from "./features/Settings";
import NotFound from "./features/NotFound";

// Components
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Context
import { AuthProvider } from "./contexts/AuthContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { NotificationProvider } from "./contexts/NotificationContext";

// Theme
import { flowbiteTheme } from "./theme";
import Configurations from "./features/Configurations/Integration/container";

function App() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  console.log(" App isAuthenticated:", isAuthenticated);

  useEffect(() => {
    // Check if user is authenticated
    const user = localStorage.getItem("user");
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
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Dashboard />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/apps"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <AppList />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/apps/:id"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <AppDetail />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/campaigns"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Campaigns />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Notifications />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Settings />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/configurations"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Configurations />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
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
