import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import {
  getFirstPathByRole,
  RouteConfig,
  routesConfig,
} from "../config/routes";
import { useAuth } from "../hooks/useAuth";
import { httpService } from "../services/httpService";

const RouteInspector: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [hasChecked, setHasChecked] = useState(false);
  const roleBasedFirstPath = getFirstPathByRole();

  useEffect(() => {
    if (isLoading) return;

    const accessToken = httpService.getAccessToken();
    const currentRoute = routesConfig.find(
      (route) => location.pathname.startsWith(route.path) && route.protected
    );

    // If route is not protected, allow access
    if (!currentRoute?.protected) {
      setHasChecked(true);
      return;
    }

    // If no access token, redirect to auth
    if (!accessToken) {
      if (location.pathname !== "/auth") {
        navigate("/auth");
      }
      setHasChecked(true);
      return;
    }

    // If we have an access token but no user data, something is wrong
    if (!user) {
      httpService.clearAllData(); // Clear invalid data
      navigate("/auth");
      setHasChecked(true);
      return;
    }

    // Check route permissions
    let submenuRoute: RouteConfig | undefined = undefined;
    if (currentRoute?.submenu) {
      submenuRoute = currentRoute.submenu.find(
        (route) => route.path === location.pathname
      );
    }

    const allowedRoles =
      currentRoute?.allowedRoles || submenuRoute?.allowedRoles;

    if (!currentRoute && !submenuRoute) {
      navigate("/404");
      setHasChecked(true);
      return;
    }

    const isUserRoleAllowed = allowedRoles
      ? allowedRoles.includes(user.role)
      : false;

    if (!hasChecked) {
      setHasChecked(true);
      if (!isUserRoleAllowed) {
        const firstPath = roleBasedFirstPath[user.role] || "/404";
        if (location.pathname !== firstPath) {
          navigate(firstPath);
        }
      }
    }
  }, [
    user,
    isLoading,
    hasChecked,
    navigate,
    location.pathname,
    roleBasedFirstPath,
  ]);

  if (isLoading || !hasChecked) {
    return <Loading />;
  }

  return <Outlet />;
};

export default RouteInspector;
