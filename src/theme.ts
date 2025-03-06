import type { CustomFlowbiteTheme } from 'flowbite-react';

export const flowbiteTheme: CustomFlowbiteTheme = {
  button: {
    color: {
      primary: 'bg-primary-600 hover:bg-primary-700 text-white',
      secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white',
      indigo: "border border-transparent bg-indigo-700 text-white focus:ring-4 focus:ring-indigo-300 enabled:hover:bg-indigo-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800",
      light: "border border-gray-300 bg-white text-gray-900 focus:ring-4 focus:ring-gray-300 enabled:hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-600 dark:text-white dark:focus:ring-gray-700 dark:enabled:hover:border-gray-700 dark:enabled:hover:bg-gray-700",
    },
  },
  navbar: {
    root: {
      base: 'bg-white px-2 py-2.5 dark:border-gray-700 dark:bg-gray-800 sm:px-4',
    },
    link: {
      base: 'block py-2 pl-3 pr-4 md:p-0',
      active: {
        on: 'bg-indigo-700 text-white dark:text-white md:bg-transparent md:text-indigo-700',
        off: 'border-b border-gray-100 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-indigo-400 md:border-0 md:hover:bg-transparent md:hover:text-indigo-600 md:dark:hover:bg-transparent md:dark:hover:text-indigo-400',
      },
      disabled: {
        on: 'text-gray-400 hover:cursor-not-allowed dark:text-gray-600',
        off: '',
      },
    },

  },
  sidebar: {
    root: {
      base: 'h-full border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800',
    },
  },
  card: {
    root: {
      base: 'flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800',
    },
  },
  modal: {
    root: {
      base: 'fixed top-0 right-0 left-0 z-50 h-modal h-screen overflow-y-auto overflow-x-hidden md:inset-0 md:h-full',
    },
    content: {
      base: 'relative h-full w-full p-4 md:h-auto',
    },
  },
};