import { Flowbite } from 'flowbite-react';
import { lazy, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Route, Routes } from 'react-router-dom';
import Loading from './components/Loading';
import RedirectIfAuthenticated from './components/RedirectIfAuthenticated';
import { getProtectedRoutes, getPublicRoutes } from './config/routes';
import { AuthProvider } from './contexts/AuthContext';
import { ChartConfigProvider } from './contexts/ChartConfigContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ProtectedRoute from './routes/ProtectedRoute';
import { flowbiteTheme } from './theme';

const Layout = lazy(() => import('./components/Layout'));

function AppContent() {
  const { i18n } = useTranslation();

  return (
    <div dir={i18n.dir()} className="min-h-screen bg-gray-50">
      <Routes>
        {getPublicRoutes().map(({ path, element }) =>
          <Route key={path} path={path} element={element} />
        )}
      </Routes>
      <RedirectIfAuthenticated>
        <Routes>
          {getProtectedRoutes().map(({ path, element, allowedRoles }) =>
            <Route key={path} element={<ProtectedRoute allowedRoles={allowedRoles || []} />}>
              <Route path={path} element={<Layout>{element}</Layout>} />
            </Route>
          )}
        </Routes>
      </RedirectIfAuthenticated>
      <Toaster position="bottom-right" reverseOrder={false} />
    </div >
  );
}

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Flowbite theme={{ theme: flowbiteTheme }}>
        <AuthProvider>
          <CurrencyProvider>
            <NotificationProvider>
              <ChartConfigProvider>
                <AppContent />
              </ChartConfigProvider>
            </NotificationProvider>
          </CurrencyProvider>
        </AuthProvider>
      </Flowbite>
    </Suspense>
  );
}

export default App;
