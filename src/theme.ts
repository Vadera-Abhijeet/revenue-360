import type { CustomFlowbiteTheme } from "flowbite-react";

export const flowbiteTheme: CustomFlowbiteTheme = {
  button: {
    color: {
      primary: "bg-primary-600 hover:bg-primary-700 text-white",
      secondary: "bg-secondary-600 hover:bg-secondary-700 text-white",
      indigo:
        "border border-transparent bg-indigo-700 text-white focus:ring-4 focus:ring-indigo-300 enabled:hover:bg-indigo-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800",
      light:
        "border border-gray-300 bg-white text-gray-900 focus:ring-4 focus:ring-gray-300 enabled:hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-600 dark:text-white dark:focus:ring-gray-700 dark:enabled:hover:border-gray-700 dark:enabled:hover:bg-gray-700",
    },
  },
  navbar: {
    root: {
      base: "bg-white px-2 py-2.5 dark:border-gray-700 dark:bg-gray-800 sm:px-4",
    },
    link: {
      base: "block py-2 pl-3 pr-4 md:p-0",
      active: {
        on: "bg-indigo-700 text-white dark:text-white md:bg-transparent md:text-indigo-700",
        off: "border-b border-gray-100 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-indigo-400 md:border-0 md:hover:bg-transparent md:hover:text-indigo-600 md:dark:hover:bg-transparent md:dark:hover:text-indigo-400",
      },
      disabled: {
        on: "text-gray-400 hover:cursor-not-allowed dark:text-gray-600",
        off: "",
      },
    },
  },
  tabs: {
    base: "flex flex-col gap-2",
    tablist: {
      base: "flex text-center",
      styles: {
        default: "flex-wrap border-b border-gray-200 dark:border-gray-700",
        underline:
          "-mb-px flex-wrap border-b border-gray-200 dark:border-gray-700",
        pills:
          "flex-wrap space-x-2 text-xs font-medium text-gray-500 dark:text-gray-400",
        fullWidth:
          "grid w-full grid-flow-col divide-x divide-gray-200 rounded-none text-xs font-medium shadow dark:divide-gray-700 dark:text-gray-400",
      },
      tabitem: {
        base: "flex items-center justify-center rounded-t-lg p-2 text-xs font-medium first:ml-0 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500",
        styles: {
          default: {
            base: "rounded-t-lg",
            active: {
              on: "bg-indigo-100 text-indigo-600 dark:bg-indigo-800 dark:text-indigo-400",
              off: "text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-300",
            },
          },
          underline: {
            base: "rounded-t-lg",
            active: {
              on: "active rounded-t-lg border-b-2 border-indigo-600 text-indigo-600 dark:border-indigo-500 dark:text-indigo-500",
              off: "border-b-2 border-transparent text-gray-500 hover:border-indigo-300 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-300",
            },
          },
          pills: {
            base: "",
            active: {
              on: "rounded-lg bg-indigo-600 text-white",
              off: "rounded-lg hover:bg-indigo-100 hover:text-indigo-900 dark:hover:bg-indigo-800 dark:hover:text-white",
            },
          },
          fullWidth: {
            base: "ml-0 flex w-full rounded-none first:ml-0",
            active: {
              on: "active rounded-none bg-indigo-100 p-2 text-gray-900 dark:bg-indigo-700 dark:text-white",
              off: "rounded-none bg-white hover:text-indigo-700 dark:bg-gray-800 dark:hover:bg-indigo-700 dark:hover:text-white",
            },
          },
        },
        icon: "mr-1 h-4 w-4",
      },
    },
    tabpanel: "py-2",
  },
  sidebar: {
    item: {
      base: "flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:text-indigo-700 dark:text-white dark:hover:text-indigo-400",
      active:
        "bg-indigo-100 text-indigo-700 dark:bg-indigo-700 dark:text-white",
      collapsed: {
        insideCollapse: "group w-full pl-8 transition duration-75",
        noIcon: "font-bold",
      },
      content: {
        base: "flex-1 whitespace-nowrap px-3",
      },
      icon: {
        base: "h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-indigo-700 dark:text-gray-400 dark:group-hover:text-indigo-400",
        active: "text-indigo-700 dark:text-white",
      },
      label: "",
      listItem: "",
    },
  },
  card: {
    root: {
      base: "flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800",
    },
  },
  modal: {
    root: {
      base: "fixed top-0 right-0 left-0 z-50 h-modal h-screen overflow-y-auto overflow-x-hidden md:inset-0 md:h-full",
    },
    content: {
      base: "relative h-full w-full p-4 md:h-auto",
    },
  },
};
