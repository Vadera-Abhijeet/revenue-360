import { LayoutDashboard, Megaphone, Puzzle, Settings as SettingsIcon, User } from 'lucide-react';
import React from 'react';
import { Role } from '../interfaces';
import { AppDetail, AppList, Auth, CampaignDetail, Campaigns, Dashboard, Integrations, Landing, NotFound, Settings, TeamManagement } from '../routes/asyncComponents';

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
        allowedRoles: ['super-admin', 'admin', 'sub-admin'],
        label: 'common.dashboard',
        icon: <LayoutDashboard size={20} />
    },
    {
        path: '/apps',
        element: <AppList />,
        protected: true,
        allowedRoles: ['super-admin', 'admin', 'sub-admin'],
        label: 'common.apps',
        icon: <Puzzle size={20} />
    },
    {
        path: '/apps/:id',
        element: <AppDetail />,
        protected: true,
        allowedRoles: ['super-admin', 'admin', 'sub-admin']
    },
    {
        path: '/campaigns',
        element: <Campaigns />,
        protected: true,
        allowedRoles: ['super-admin', 'admin', 'sub-admin'],
        label: 'common.campaigns',
        icon: <Megaphone size={20} />
    },
    {
        path: '/campaigns/:id',
        element: <CampaignDetail />,
        protected: true,
        allowedRoles: ['super-admin', 'admin', 'sub-admin']
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
        allowedRoles: ['super-admin', 'admin'],
        label: 'common.configurations',
        icon: <SettingsIcon size={20} />,
        submenu: [
            {
                path: '/configurations/integrations',
                element: <Integrations />,
                protected: true,
                allowedRoles: ['super-admin', 'admin'],
                label: 'common.integrations',
                icon: <Puzzle size={16} />
            },
            {
                path: '/configurations/team-management',
                element: <TeamManagement />,
                protected: true,
                allowedRoles: ['super-admin', 'admin'],
                label: 'configurations.team.title',
                icon: <User size={16} />
            }
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
export const getNavItems = () => routesConfig.filter(route => route.label && route.icon);
