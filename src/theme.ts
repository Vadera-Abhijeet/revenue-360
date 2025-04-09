import type { CustomFlowbiteTheme } from "flowbite-react";

export const flowbiteTheme: CustomFlowbiteTheme = {
  button: {
    color: {
      primary: "bg-primary-600 hover:bg-primary-700 text-white",
      secondary: "bg-secondary-600 hover:bg-secondary-700 text-white",
      indigo:
        "border border-transparent bg-indigo-700 text-white enabled:hover:bg-indigo-800 dark:bg-indigo-600 dark:hover:bg-indigo-700",
      light:
        "border border-gray-300 bg-white text-gray-900 enabled:hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-600 dark:text-white dark:enabled:hover:border-gray-700 dark:enabled:hover:bg-gray-700",
      default:
        "bg-primary-700 text-white hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700",
      alternative:
        "border border-gray-200 bg-white text-gray-900 hover:bg-gray-100 hover:text-primary-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white",
      blue: "bg-blue-700 text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700",
      cyan: "bg-cyan-700 text-white hover:bg-cyan-800 dark:bg-cyan-600 dark:hover:bg-cyan-700",
      dark: "bg-gray-800 text-white hover:bg-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700",
      gray: "bg-gray-700 text-white hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700",
      green:
        "bg-green-700 text-white hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700",
      lime: "bg-lime-700 text-white hover:bg-lime-800 dark:bg-lime-600 dark:hover:bg-lime-700",
      pink: "bg-pink-700 text-white hover:bg-pink-800 dark:bg-pink-600 dark:hover:bg-pink-700",
      purple:
        "bg-purple-700 text-white hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-700",
      red: "bg-red-700 text-white hover:bg-red-800 dark:bg-red-600 dark:hover:bg-red-700",
      teal: "bg-teal-700 text-white hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700",
      yellow:
        "bg-yellow-400 text-white hover:bg-yellow-500 dark:bg-yellow-600 dark:hover:bg-yellow-400",
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
        base: "flex items-center justify-center rounded-t-lg p-2 text-xs font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500",
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
  toggleSwitch: {
    root: {
      base: "group flex rounded-lg",
      active: {
        on: "cursor-pointer",
        off: "cursor-not-allowed opacity-50",
      },
      label:
        "ms-3 mt-0.5 text-start text-sm font-medium text-gray-900 dark:text-gray-300",
    },
    toggle: {
      base: "relative rounded-full border after:absolute after:rounded-full after:bg-white after:transition-all",
      checked: {
        on: "after:translate-x-full after:border-white rtl:after:-translate-x-full",
        off: "border-gray-200 bg-gray-200 dark:border-gray-600 dark:bg-gray-700",
        color: {
          blue: "border-cyan-700 bg-cyan-700",
          dark: "bg-dark-700 border-dark-900",
          failure: "border-red-900 bg-red-700",
          gray: "border-gray-600 bg-gray-500",
          green: "border-green-700 bg-green-600",
          light: "bg-light-700 border-light-900",
          red: "border-red-900 bg-red-700",
          purple: "border-purple-900 bg-purple-700",
          success: "border-green-500 bg-green-500",
          yellow: "border-yellow-400 bg-yellow-400",
          warning: "border-yellow-600 bg-yellow-600",
          cyan: "border-cyan-500 bg-cyan-500",
          lime: "border-lime-400 bg-lime-400",
          indigo: "border-indigo-700 bg-indigo-700",
          teal: "bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br",
          info: "border-cyan-600 bg-cyan-600",
          pink: "border-pink-600 bg-pink-600",
        },
      },
      sizes: {
        sm: "h-5 w-9 min-w-9 after:left-px after:top-px after:h-4 after:w-4 rtl:after:right-px",
        md: "h-6 w-11 min-w-11 after:left-px after:top-px after:h-5 after:w-5 rtl:after:right-px",
        lg: "h-7 w-14 min-w-14 after:left-1 after:top-0.5 after:h-6 after:w-6 rtl:after:right-1",
      },
    },
  },
  textInput: {
    field: {
      input: {
        colors: {
          gray: "border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:border-gray-400 focus:ring-gray-400",
        },
      },
    },
  },
  textarea: {
    colors: {
      gray: "border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:border-gray-400 focus:ring-gray-400",
    },
  },
  fileInput: {
    field: {
      input: {
        colors: {
          gray: "border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:border-gray-400 focus:ring-gray-400",
        },
      },
    },
  },
  select: {
    field: {
      select: {
        base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
        colors: {
          gray: "border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:border-gray-400 focus:ring-gray-400",
        },
      },
    },
  },
  listGroup: {
    item: {
      link: {
        active: {
          off: "hover:bg-gray-100 hover:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white",
          on: "bg-gray-400 text-white dark:bg-gray-800",
        },
      },
    },
  },
  checkbox: {
    root: {
      base: "h-4 w-4 appearance-none rounded bg-gray-100 bg-[length:0.55em_0.55em] bg-center bg-no-repeat checked:bg-current checked:bg-check-icon focus:outline-none focus:ring-0 dark:bg-gray-700 dark:checked:bg-current",
      color: {
        default: "text-primary-600",
        dark: "text-gray-800 ",
        failure: "text-red-900 ",
        gray: "text-gray-900 ",
        info: "text-cyan-800 ",
        light: "text-gray-900 ",
        purple: "text-purple-600 ",
        success: "text-green-800 ",
        warning: "text-yellow-400 ",
        blue: "text-blue-700 ",
        cyan: "text-cyan-600 ",
        green: "text-green-600 ",
        indigo: "text-indigo-700",
        lime: "text-lime-700",
        pink: "text-pink-600 ",
        red: "text-red-600 ",
        teal: "text-teal-600 ",
        yellow: "text-yellow-400 ",
      },
    },
  },
};
