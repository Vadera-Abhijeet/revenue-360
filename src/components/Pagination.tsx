import React from "react";
import { Button, Select } from "flowbite-react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  showItemsPerPage?: boolean;
  loading?: boolean;
  customItemsPerPageOptions?: number[];
}

const DEFAULT_ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];
const MAX_VISIBLE_PAGES = 5;
const DEFAULT_ITEMS_PER_PAGE = 10;

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPage = true,
  loading = false,
  customItemsPerPageOptions,
}) => {
  const itemsPerPageOptions =
    customItemsPerPageOptions || DEFAULT_ITEMS_PER_PAGE_OPTIONS;

  // Calculate visible page range
  const getVisiblePages = () => {
    const pages: number[] = [];
    const halfMaxPages = Math.floor(MAX_VISIBLE_PAGES / 2);

    let startPage = Math.max(1, currentPage - halfMaxPages);
    const endPage = Math.min(totalPages, startPage + MAX_VISIBLE_PAGES - 1);

    if (endPage - startPage + 1 < MAX_VISIBLE_PAGES) {
      startPage = Math.max(1, endPage - MAX_VISIBLE_PAGES + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <span>{totalItems}</span>
        <span>items</span>
      </div>

      <div className="flex items-center gap-4">
        {showItemsPerPage && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Items per page:
            </span>
            <Select
              className="w-20"
              value={String(itemsPerPage)}
              onChange={(e) => onItemsPerPageChange?.(Number(e.target.value))}
              disabled={loading}
            >
              {itemsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </div>
        )}

        <div className="flex items-center gap-1">
          <Button
            size="xs"
            color="light"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1 || loading}
            className="transition-all duration-200 hover:scale-105"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            size="xs"
            color="light"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="transition-all duration-200 hover:scale-105"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {visiblePages.map((page) => (
            <Button
              key={page}
              size="xs"
              color={currentPage === page ? "indigo" : "light"}
              onClick={() => onPageChange(page)}
              disabled={loading}
              className={`transition-all duration-200 hover:scale-105 ${
                currentPage === page
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {page}
            </Button>
          ))}

          <Button
            size="xs"
            color="light"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="transition-all duration-200 hover:scale-105"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            size="xs"
            color="light"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages || loading}
            className="transition-all duration-200 hover:scale-105"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
