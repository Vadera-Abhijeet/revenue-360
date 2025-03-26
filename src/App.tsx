import { Flowbite } from 'flowbite-react';
import { lazy, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Route, Routes } from 'react-router-dom';
import Loading from './components/Loading';
import { getProtectedRoutes, getPublicRoutes } from './config/routes';
import { AuthProvider } from './contexts/AuthContext';
import { ChartConfigProvider } from './contexts/ChartConfigContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { NotificationProvider } from './contexts/NotificationContext';
import NotFound from './features/NotFound';
import RouteInspector from './routes/RouteInspector';
import { flowbiteTheme } from './theme';

const Layout = lazy(() => import('./components/Layout'));

function AppContent() {
  const { i18n } = useTranslation();
  const publicRoutes = getPublicRoutes();
  const protectedRoutes = getProtectedRoutes();
  return (
    <div dir={i18n.dir()} className="min-h-screen bg-gray-50">
      <Routes>
        {publicRoutes.map(({ path, element }) =>
          <Route key={path} path={path} element={element} />
        )}
        {protectedRoutes.map(({ path, element }) =>
          <Route key={path} element={<RouteInspector />}>
            <Route path={path} element={<Layout>{element}</Layout>} />
          </Route>
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
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
