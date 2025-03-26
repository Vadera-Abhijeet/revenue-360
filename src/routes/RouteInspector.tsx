import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getFirstPathByRole, RouteConfig, routesConfig } from '../config/routes';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/Loading';

const RouteInspector: React.FC = () => {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [hasChecked, setHasChecked] = useState(false);
    const roleBasedFirstPath = getFirstPathByRole();

    useEffect(() => {
        if (isLoading) return;
        const currentRoute = routesConfig.find(route => location.pathname.startsWith(route.path) && route.protected);
        if (!currentRoute?.protected) {
            setHasChecked(true);
            return;
        } else {
            if (!user) {
                if (location.pathname !== '/auth') {
                    navigate('/auth');
                }
                setHasChecked(true);
            } else {

                let submenuRoute: RouteConfig | undefined = undefined;

                if (currentRoute?.submenu) {
                    submenuRoute = currentRoute.submenu.find(route => route.path === location.pathname);
                }

                const allowedRoles = currentRoute?.allowedRoles || submenuRoute?.allowedRoles;

                if (!currentRoute && !submenuRoute) {
                    navigate('/404');
                    return;
                }
                const isUserRoleAllowed = user && allowedRoles ? allowedRoles?.includes(user.role) : false;

                if (!hasChecked) {
                    setHasChecked(true); // Prevent multiple redirects

                    if (!user) {
                        navigate('/auth');
                    } else if (!isUserRoleAllowed) {
                        const firstPath = roleBasedFirstPath[user.role] || '/404';
                        if (location.pathname !== firstPath) {
                            navigate(firstPath);
                        }
                    }
                }
            }
        }
    }, [user, isLoading, hasChecked, navigate, location.pathname, roleBasedFirstPath]);

    if (isLoading || !hasChecked) {
        return <Loading />;
    }

    return <Outlet />;
};

export default RouteInspector;
