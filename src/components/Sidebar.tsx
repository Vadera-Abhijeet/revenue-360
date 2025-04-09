import { Menu, X, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";
import { Tooltip } from "flowbite-react";

interface Links {
  label: string;
  href?: string;
  path?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  submenu?: Links[];
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "px-4 py-4 hidden  md:flex md:flex-col border border-gray-200 bg-white rounded-md shadow-lg w-[250px] shrink-0",
        className
      )}
      animate={{
        width: animate ? (open ? "250px" : "80px") : "250px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-9 p-4 flex flex-row md:hidden  items-center justify-between bg-white dark:bg-neutral-800 w-full"
        )}
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
          <Menu
            className="text-gray-800 dark:text-gray-200"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-10 z-[100] flex flex-col justify-between",
                className
              )}
            >
              <div
                className="absolute right-5 top-5 z-50 text-gray-800 dark:text-gray-200"
                onClick={() => setOpen(!open)}
              >
                <X />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  active,
}: {
  link: Links;
  className?: string;
  active?: boolean;
}) => {
  const navigate = useNavigate();
  const { open, animate } = useSidebar();
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  const handleClick = () => {
    if (link.submenu) {
      setIsSubmenuOpen(!isSubmenuOpen);
    } else if (link.onClick) {
      link.onClick();
    } else if (link.href) {
      navigate(link.href);
    }
  };

  const isActive =
    active ||
    (link.submenu &&
      link.submenu.some((sub) => sub.href === window.location.pathname));
  return (
    <div className="flex flex-col">
      <div
        className={cn(
          "flex items-center justify-start gap-2 group/sidebar py-2 cursor-pointer",
          className
        )}
        onClick={() => handleClick()}
      >
        {!open && animate ? (
          <Tooltip content={link.label} placement="right">
            <div
              className={`text-${isActive ? "indigo" : "gray"}-700 dark:text-${
                isActive ? "indigo" : "gray"
              }-200`}
            >
              {link.icon}
            </div>
          </Tooltip>
        ) : (
          <div
            className={`text-${isActive ? "indigo" : "gray"}-700 dark:text-${
              isActive ? "indigo" : "gray"
            }-200`}
          >
            {link.icon}
          </div>
        )}

        <motion.span
          animate={{
            display: animate
              ? open
                ? "inline-block"
                : "none"
              : "inline-block",
            opacity: animate ? (open ? 1 : 0) : 1,
          }}
          className={`text-${isActive ? "indigo" : "gray"}-700 dark:text-${
            isActive ? "indigo" : "gray"
          }-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0 truncate max-w-full`}
        >
          {link.label}
        </motion.span>

        {link.submenu && open && (
          <motion.div
            animate={{ rotate: isSubmenuOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="ml-auto"
          >
            <ChevronDown size={16} />
          </motion.div>
        )}
      </div>

      {link.submenu && open && (
        <AnimatePresence>
          {isSubmenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pl-7 flex flex-col gap-1">
                {link.submenu.map((subLink, idx) => (
                  <SidebarLink
                    key={idx}
                    link={subLink}
                    active={window.location.pathname === subLink.href}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};
