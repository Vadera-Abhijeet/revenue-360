import { LayoutDashboard, Megaphone, Puzzle, Settings as SettingsIcon, User, Users } from 'lucide-react';
import React from 'react';
import { Role } from '../interfaces';
import { AppDetail, AppList, Auth, CampaignDetail, Campaigns, Dashboard, Integrations, Landing, Merchants, NotFound, Settings, TeamManagement } from '../routes/asyncComponents';

export interface RouteConfig {
    path: string;
    element: React.ReactNode;
    protected?: boolean;
    allowedRoles?: Role[];
    label?: string;
    icon?: React.ReactNode;
    submenu?: RouteConfig[];
}

export const routesConfig: RouteConfig[] = [
    // Public Routes
    {
        path: '/',
        element: <Landing />,
        protected: false
    },
    {
        path: '/auth',
        element: <Auth />,
        protected: false
    },
    // Protected Routes
    {
        path: '/dashboard',
        element: <Dashboard />,
        protected: true,
        allowedRoles: ['admin', 'sub-admin'],
        label: 'common.dashboard',
        icon: <LayoutDashboard size={20} />
    },
    {
        path: '/merchants',
        element: <Merchants />,
        protected: true,
        allowedRoles: ['super-admin'],
        label: 'common.merchants',
        icon: <Users size={16} />
    },
    {
        path: '/apps',
        element: <AppList />,
        protected: true,
        allowedRoles: ['admin', 'sub-admin'],
        label: 'common.apps',
        icon: <Puzzle size={20} />
    },
    {
        path: '/apps/:id',
        element: <AppDetail />,
        protected: true,
        allowedRoles: ['admin', 'sub-admin']
    },
    {
        path: '/campaigns',
        element: <Campaigns />,
        protected: true,
        allowedRoles: ['admin'],
        label: 'common.campaigns',
        icon: <Megaphone size={20} />
    },
    {
        path: '/campaigns/:id',
        element: <CampaignDetail />,
        protected: true,
        allowedRoles: ['admin', 'sub-admin']
    },
    {
        path: '/settings',
        element: <Settings />,
        protected: true,
        allowedRoles: ['super-admin', 'admin', 'sub-admin'],
    },
    {
        path: '/configurations',
        element: <Settings />,
        protected: true,
        allowedRoles: ['admin'],
        label: 'common.configurations',
        icon: <SettingsIcon size={20} />,
        submenu: [
            {
                path: '/configurations/integrations',
                element: <Integrations />,
                protected: true,
                allowedRoles: ['admin'],
                label: 'common.integrations',
                icon: <Puzzle size={16} />
            },
            {
                path: '/configurations/team-management',
                element: <TeamManagement />,
                protected: true,
                allowedRoles: ['admin'],
                label: 'configurations.team.title',
                icon: <User size={16} />
            },

        ]
    },
    {
        path: '/404',
        element: <NotFound />,
        protected: false
    },
];

// Helper functions to get specific route configurations
export const getPublicRoutes = () => routesConfig.filter(route => !route.protected);

export const getProtectedRoutes = () => {
    const flattenRoutes = (routes: RouteConfig[]): RouteConfig[] => {
        return routes.reduce((acc: RouteConfig[], route) => {
            acc.push(route);
            if (route.submenu) {
                acc.push(...flattenRoutes(route.submenu));
            }
            return acc;
        }, []);
    };

    return flattenRoutes(routesConfig.filter(route => route.protected));
};

const hasAccessToRoute = (route: RouteConfig, userRole: Role): boolean => {
    // If route has no allowed roles, it's accessible to all
    if (!route.allowedRoles) return true;

    // Check if user's role is in allowed roles
    return route.allowedRoles.includes(userRole);
};

const filterSubmenuByRole = (submenu: RouteConfig[], userRole: Role): RouteConfig[] => {
    return submenu.filter(subItem => hasAccessToRoute(subItem, userRole));
};

export const getNavItems = (userRole: Role) => {
    const filterRoutesByRole = (routes: RouteConfig[]): RouteConfig[] => {
        return routes.filter(route => {
            // If route has submenu
            if (route.submenu) {
                // Filter submenu items by role
                const accessibleSubmenu = filterSubmenuByRole(route.submenu, userRole);

                // If no submenu items are accessible, hide the parent menu
                if (accessibleSubmenu.length === 0) {
                    return false;
                }

                // Update route's submenu with only accessible items
                route.submenu = accessibleSubmenu;
                return true;
            }

            // For routes without submenu, check direct access
            return hasAccessToRoute(route, userRole);
        });
    };

    return filterRoutesByRole(routesConfig.filter(route => route.label && route.icon));
};

export const getFirstPathByRole = (): Record<string, string | undefined> => {
    const rolePaths: { [key: string]: string } = {};

    routesConfig.forEach(route => {
        if (route.allowedRoles) {
            route.allowedRoles.forEach(role => {
                // Only set the path if it hasn't been set yet
                if (!rolePaths[role]) {
                    rolePaths[role] = route.path;
                }
            });
        }
    });

    return rolePaths;
};
