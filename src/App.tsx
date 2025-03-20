import { Flowbite } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { Navigate, Route, Routes } from "react-router-dom";

// Pages
import AppDetail from "./features/Apps/container/AppDetails";
import AppList from "./features/Apps/container/AppList";
import CampaignDetail from "./features/Campaigns/container/CampaignDetails";
import Campaigns from "./features/Campaigns/container/CampaignList";
import Dashboard from "./features/Dashboard/container";
import Landing from "./features/Landing";
import NotFound from "./features/NotFound";
import Notifications from "./features/Notifications";
import Settings from "./features/Settings";
import Configurations from "./features/Configurations/Integration/container";
import Auth from "./features/Auth";

// Components
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Context
import { AuthProvider } from "./contexts/AuthContext";
import { ChartConfigProvider } from "./contexts/ChartConfigContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { NotificationProvider } from "./contexts/NotificationContext";
// Theme
import { flowbiteTheme } from "./theme";
import { Toaster } from "react-hot-toast";

function App() {
  const { i18n } = useTranslation();

  return (
    <Flowbite theme={{ theme: flowbiteTheme }}>
      <AuthProvider>
        <CurrencyProvider>
          <NotificationProvider>
            <ChartConfigProvider>
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
                    path="/campaigns/:id"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <CampaignDetail />
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
              <Toaster
                position="bottom-right"
                reverseOrder={false}
              />
            </ChartConfigProvider>
          </NotificationProvider>
        </CurrencyProvider>
      </AuthProvider>
    </Flowbite>
  );
}

export default App;
