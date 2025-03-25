import {
  Avatar,
  Badge,
  Dropdown,
  Navbar,
  Popover,
  Tooltip,
} from "flowbite-react";
import { TFunction } from "i18next";
import {
  Bell,
  DollarSign,
  Languages,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Location, useLocation } from "react-router-dom";
import brandLogo from "../assets/images/Logo.png";
import brandLogoIcon from "../assets/images/LogoIcon.png";
import { Sidebar, SidebarBody, SidebarLink } from "./Sidebar";
import AnimatedModal from "./AnimatedModal";
import { CurrencyCode, useCurrency } from "../contexts/CurrencyContext";
import { useNotifications } from "../contexts/NotificationContext";
import Notifications from "../features/Notifications";
import { useAuth } from "../hooks/useAuth";
import { IUser } from "../interfaces";
import { CURRENCIES_OPTIONS, LANGUAGES_OPTIONS } from "../shared/constants";
import { getNavItems } from "../config/routes";

interface INavItem {
  label: string;
  href?: string;
  path?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  submenu?: INavItem[];
}

interface IRenderSideBarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animateSidebar: boolean;
  t: TFunction<"translation", undefined>;
  logout: () => void;
  user: IUser | null;
  navItems: INavItem[];
  location: Location;
}

const RenderSideBar = (props: IRenderSideBarProps) => {
  const { open, setOpen, animateSidebar, t, logout, user, navItems, location } =
    props;

  return (
    <Sidebar open={open} setOpen={setOpen} animate={animateSidebar}>
      <SidebarBody className="h-full justify-between gap-10">
        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
          {!animateSidebar || open ? (
            <img
              src={brandLogo}
              alt="brand logo"
              style={{ maxHeight: "60px" }}
            />
          ) : (
            <img
              src={brandLogoIcon}
              alt="brand logo"
              style={{ maxHeight: "41px", width: "41px" }}
            />
          )}
          <div className={`mt-8 flex flex-col gap-2 pl-3`}>
            {navItems.map((link, idx) => (
              <SidebarLink
                key={idx}
                link={link}
                active={
                  location.pathname === link.href ||
                  location.pathname.startsWith(link.href + "/")
                }
              />
            ))}
          </div>
        </div>
        <div className={`flex flex-col gap-2 items-center`}>
          <div className="w-full pl-3">
            <SidebarLink
              link={{
                label: t("common.logout"),
                onClick: logout,
                icon: <LogOut size={20} />,
              }}
            />
          </div>
          <div className="w-full px-1">
            <SidebarLink
              link={{
                label: user?.name || "User",
                href: "/settings",
                icon: (
                  <Avatar
                    alt="User profile"
                    img={
                      user?.photoURL ||
                      "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                    }
                    rounded
                    size="sm"
                  />
                ),
              }}
            />
          </div>
        </div>
      </SidebarBody>
    </Sidebar>
  );
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const { currency, setCurrency } = useCurrency();
  const [openNotification, setOpenNotification] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [open, setOpen] = useState(false);
  const [animateSidebar, setAnimateSidebar] = useState(false);

  const navItems = useMemo(
    () => getNavItems().map(item => ({
      label: t(item.label || ''),
      href: item.path,
      icon: item.icon,
      submenu: item.submenu?.map(subItem => ({
        label: t(subItem.label || ''),
        href: subItem.path,
        icon: subItem.icon
      }))
    })),
    [t]
  );

  const activeNavItem = useMemo(() => {
    return navItems.find(
      (item) =>
        location.pathname === item.href ||
        location.pathname.startsWith(item.href + "/")
    );
  }, [location.pathname, navItems]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const toggleSidebar = () => {
    setAnimateSidebar(!animateSidebar);
  };

  const activeMenuLabel = useMemo(() => {
    return activeNavItem?.label || (location.pathname === "/settings" ? t("common.settings") : null)
  }, [activeNavItem, location.pathname, t])

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  return (
    <div className="flex min-h-screen gap-2 p-2">
      <div className="hidden md:block">
        <RenderSideBar
          user={user}
          t={t}
          animateSidebar={animateSidebar}
          open={open}
          setOpen={setOpen}
          logout={() => setShowLogoutModal(true)}
          navItems={navItems}
          location={location}
        />
      </div>

      {/* Main Content with Sidebar */}
      <div className="flex flex-col flex-1 gap-2">
        {/* Top Navbar */}
        <Navbar
          fluid
          className="border border-gray-200 bg-white rounded-lg shadow-sm "
          theme={{
            root: {
              base: "bg-white px-2 py-2.5 dark:border-gray-700 dark:bg-gray-800 sm:px-6",
            },
          }}
        >
          <div className="items-center hidden md:flex gap-3">
            <AnimatePresence>
              <Tooltip
                placement="bottom-start"
                content={animateSidebar ? "Open Sidebar" : "Close Sidebar"}
              >
                <motion.button
                  whileTap={{ scale: 0.5 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="border border-gray-300 bg-white text-gray-900 px-2 py-1 rounded-md text-xs 
                  enabled:hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-600 dark:text-white 
                  dark:enabled:hover:border-gray-700 dark:enabled:hover:bg-gray-700"
                  onClick={toggleSidebar}
                >
                  {animateSidebar ? (
                    <PanelLeftOpen size={20} />
                  ) : (
                    <PanelLeftClose size={20} />
                  )}
                </motion.button>
              </Tooltip>
            </AnimatePresence>
            <h1 className="text-2xl font-bold text-gray-700">
              {activeMenuLabel}
            </h1>
          </div>
          <div className="bg-white block md:hidden">
            <RenderSideBar
              user={user}
              t={t}
              animateSidebar={animateSidebar}
              open={open}
              setOpen={setOpen}
              logout={() => setShowLogoutModal(true)}
              navItems={navItems}
              location={location}
            />
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <Dropdown
              arrowIcon={false}
              inline
              label={<Languages size={20} />}
              theme={{
                inlineWrapper:
                  "flex items-center py-2 px-1 text-gray-700 hover:text-gray-900",
              }}
            >
              <Dropdown.Header>
                <span className="block text-sm">{t("common.language")}</span>
              </Dropdown.Header>
              {LANGUAGES_OPTIONS.map((lang) => (
                <Dropdown.Item
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={i18n.language === lang.code ? "bg-gray-100" : ""}
                >
                  {lang.name}
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
                  className="text-gray-700 hover:text-gray-900"
                />
                {unreadCount > 0 && (
                  <Badge
                    color="indigo"
                    className="absolute -top-1.5 -right-4"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </div>
            </Popover>
            <Dropdown
              arrowIcon={false}
              inline
              label={<DollarSign size={20} />}
              theme={{
                inlineWrapper:
                  "flex items-center py-2 px-1 text-gray-700 hover:text-gray-900",
              }}
            >
              <Dropdown.Header>
                <span className="block text-sm">{t("common.currency")}</span>
              </Dropdown.Header>
              {CURRENCIES_OPTIONS.map((curr) => (
                <Dropdown.Item
                  key={curr.code}
                  onClick={() => setCurrency(curr.code as CurrencyCode)}
                  className={currency === curr.code ? "bg-gray-100" : ""}
                >
                  {curr.symbol} - {curr.name}
                </Dropdown.Item>
              ))}
            </Dropdown>
          </div>
        </Navbar>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-2 md:p-6 bg-white max-h-[calc(100vh-82px)] overflow-y-auto border border-gray-200 rounded-lg shadow-lg">
          {children}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatedModal
        show={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title={t("common.confirm_logout")}
        message={t("common.logout_confirmation_message")}
        confirmText={t("common.logout")}
        confirmButtonColor="red"
      />
    </div>
  );
};

export default Layout;
