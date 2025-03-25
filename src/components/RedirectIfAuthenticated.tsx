import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../shared/constants';

interface RedirectIfAuthenticatedProps {
    children: React.ReactNode;
}

const RedirectIfAuthenticated: React.FC<RedirectIfAuthenticatedProps> = ({ children }) => {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const hasRedirected = useRef(false);
    const [isReady, setIsReady] = useState(false);
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
            } else if (ROLES.includes(user.role)) {
                navigate('/dashboard');
            } else {
                navigate('/404');
            }

            // Mark as ready after redirection logic is complete
            setIsReady(true);
        };

        handleRedirect();
    }, [user, navigate, location, isLoading]);

    // Show loading state while checking authentication
    if (isLoading || !isReady) {
        return null;
    }

    // Render children only after redirection logic is complete
    return children;
};

export default RedirectIfAuthenticated; 