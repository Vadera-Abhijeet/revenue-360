import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  Navbar,
  Popover,
  Sidebar,
} from "flowbite-react";
import {
  AppWindow,
  // Megaphone,
  Bell,
  DollarSign,
  Globe,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  Settings,
  User,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import brandLogo from "../assets/images/brand.png";
import { CurrencyCode, useCurrency } from "../contexts/CurrencyContext";
import { useNotifications } from "../contexts/NotificationContext";
import Notifications from "../features/Notifications";
import { useAuth } from "../hooks/useAuth";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const { currency, setCurrency } = useCurrency();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
    { code: "ja", name: "日本語" },
  ];

  const currencies = [
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
    { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
    { code: "INR", symbol: "₹", name: "Indian Rupee" },
    { code: "AUD", symbol: "A$", name: "Australian Dollar" },
    { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const navItems = [
    {
      name: t("common.dashboard"),
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    { name: t("common.apps"), path: "/apps", icon: <AppWindow size={20} /> },
    {
      name: t("common.campaigns"),
      path: "/campaigns",
      icon: <Megaphone size={20} />,
    },
    // {
    //   name: t("common.notifications"),
    //   path: "/notifications",
    //   icon: <Bell size={20} />,
    // },
    {
      name: t("common.configurations"),
      path: "/configurations",
      icon: <Settings size={20} />,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen p-2 ">
      {/* Top Navbar */}
      <Navbar
        fluid
        className="border border-gray-200 bg-white rounded-lg shadow-sm"
      >
        <div className="flex items-center">
          <Button
            color="light"
            className="mr-2 lg:hidden"
            onClick={toggleSidebar}
          >
            <Menu size={20} />
          </Button>
          <Navbar.Brand href="/dashboard" className="flex items-center">
            <img src={brandLogo} alt="brand-logo" className="h-9" />
          </Navbar.Brand>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <Dropdown
            arrowIcon={false}
            inline
            label={<Globe size={20} />}
            theme={{
              inlineWrapper:
                "flex items-center py-2 px-1 text-indigo-600 hover:text-indigo-900",
            }}
          >
            <Dropdown.Header>
              <span className="block text-sm">{t("common.language")}</span>
            </Dropdown.Header>
            {languages.map((lang) => (
              <Dropdown.Item
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={i18n.language === lang.code ? "bg-gray-100" : ""}
              >
                {lang.name}
              </Dropdown.Item>
            ))}
          </Dropdown>

          <Dropdown
            arrowIcon={false}
            inline
            label={<DollarSign size={20} />}
            theme={{
              inlineWrapper:
                "flex items-center py-2 px-1 text-indigo-600 hover:text-indigo-900",
            }}
          >
            <Dropdown.Header>
              <span className="block text-sm">{t("common.currency")}</span>
            </Dropdown.Header>
            {currencies.map((curr) => (
              <Dropdown.Item
                key={curr.code}
                onClick={() => setCurrency(curr.code as CurrencyCode)}
                className={currency === curr.code ? "bg-gray-100" : ""}
              >
                {curr.symbol} - {curr.name}
              </Dropdown.Item>
            ))}
          </Dropdown>
          <Popover
            aria-labelledby="area-popover"
            open={openNotification}
            onOpenChange={setOpenNotification}
            content={<Notifications />}
            theme={{
              content: "z-10 overflow-hidden rounded-[7px] shadow-sm",
            }}
          >
            <div className="relative py-2 px-1 cursor-pointer">
              <Bell
                size={20}
                className="text-indigo-600 hover:text-indigo-900 "
              />
              {unreadCount > 0 && (
                <Badge color="indigo" className="absolute -top-1.5 -right-4">
                  {unreadCount}
                </Badge>
              )}
            </div>
          </Popover>

          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User profile"
                img={
                  user?.photoURL ||
                  "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                }
                rounded
                size="sm"
              />
            }
            theme={{
              inlineWrapper:
                "flex items-center px-3 text-gray-500 hover:text-gray-900",
            }}
          >
            <Dropdown.Header>
              <span className="block text-sm">{user?.name || "User"}</span>
              <span className="block truncate text-sm font-medium">
                {user?.email || "user@example.com"}
              </span>
            </Dropdown.Header>
            <Dropdown.Item icon={User} onClick={() => navigate("/settings")}>
              {t("common.profile")}
            </Dropdown.Item>
            {/* <Dropdown.Item
              icon={Settings}
              onClick={() => navigate("/settings")}
            >
              {t("common.settings")}
            </Dropdown.Item> */}
            <Dropdown.Divider />
            <Dropdown.Item icon={LogOut} onClick={logout}>
              {t("common.logout")}
            </Dropdown.Item>
          </Dropdown>
        </div>
      </Navbar>

      {/* Main Content with Sidebar */}
      <div className="flex flex-1 mt-2 gap-2">
        {/* Sidebar for larger screens */}
        <div className="hidden lg:block w-72 border border-gray-200 bg-white rounded-md shadow-lg overflow-hidden">
          <Sidebar className="w-full">
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                {navItems.map((item) => (
                  <Sidebar.Item
                    key={item.path}
                    href={item.path}
                    icon={() => item.icon}
                    active={
                      location.pathname === item.path ||
                      location.pathname.startsWith(item.path)
                    }
                    onClick={(e: { preventDefault: () => void }) => {
                      e.preventDefault();
                      navigate(item.path);
                    }}
                  >
                    <div className="flex justify-between items-center">
                      {item.name}
                      {item.path === "/notifications" && unreadCount > 0 && (
                        <Badge color="failure" className="ml-2">
                          {unreadCount}
                        </Badge>
                      )}
                    </div>
                  </Sidebar.Item>
                ))}
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </Sidebar>
        </div>

        {/* Mobile Sidebar */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              onClick={closeSidebar}
            ></div>
            <div className="relative flex flex-col w-80 max-w-sm h-full bg-white">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  Revenue-360
                </h2>
                <Button color="light" onClick={closeSidebar}>
                  <X size={20} />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <Sidebar aria-label="Mobile sidebar with navigation">
                  <Sidebar.Items>
                    <Sidebar.ItemGroup>
                      {navItems.map((item) => (
                        <Sidebar.Item
                          key={item.path}
                          href={item.path}
                          icon={() => item.icon}
                          active={location.pathname === item.path}
                          onClick={(e: { preventDefault: () => void }) => {
                            e.preventDefault();
                            navigate(item.path);
                            closeSidebar();
                          }}
                        >
                          <div className="flex justify-between items-center">
                            {item.name}
                            {item.path === "/notifications" &&
                              unreadCount > 0 && (
                                <Badge color="failure" className="ml-2">
                                  {unreadCount}
                                </Badge>
                              )}
                          </div>
                        </Sidebar.Item>
                      ))}
                    </Sidebar.ItemGroup>
                  </Sidebar.Items>
                </Sidebar>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50 max-h-[calc(100vh-85px)] overflow-y-auto border border-gray-200  rounded-lg shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
