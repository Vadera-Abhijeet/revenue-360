import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getFirstPathByRole } from '../config/routes';
import { useAuth } from '../hooks/useAuth';


const RouteInspector = () => {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const hasRedirected = useRef(false);
    const [isReady, setIsReady] = useState(false);
    const roleBasedFirstPath = getFirstPathByRole()
    useEffect(() => {
        const handleRedirect = async () => {
            if (hasRedirected.current || isLoading) return;

            hasRedirected.current = true;
            if (!user) {
                setIsReady(true);
                navigate(location.pathname === '/' ? '/' : '/auth');
                return;
            }


            if (user.role === 'admin' && user.isNewMerchant) {
                navigate('/onboarding');
            } else {
                console.log('roleBasedFirstPath[user.role]', roleBasedFirstPath[user.role])
                navigate(roleBasedFirstPath[user.role] || '/404');
            }

            // Mark as ready after redirection logic is complete
            setIsReady(true);
        };
        handleRedirect();
    }, [user, navigate, location, isLoading, roleBasedFirstPath]);

    // Show loading state while checking authentication
    if (isLoading || !isReady) {
        return null;
    }
    // Render children only after redirection logic is complete
    return <Outlet />;
};

export default RouteInspector; 