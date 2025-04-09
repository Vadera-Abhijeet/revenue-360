import { Button } from "flowbite-react";
import React, { ReactNode } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  loadingRowCount?: number;
  showPagination?: boolean;
  showSearch?: boolean;
  searchPosition?: "end" | "start" | "center";
  onSearch?: (value: string) => void;
  searchValue?: string;
  className?: string;
  prependWithSearch?: ReactNode;
  appendWithSearch?: ReactNode;
  title?: string | ReactNode;
}

export function Table<T>({
  data,
  columns,
  isLoading = false,
  loadingRowCount = 3,
  showPagination = true,
  showSearch = false,
  searchPosition = "end",
  onSearch,
  searchValue = "",
  className = "",
  prependWithSearch = null,
  appendWithSearch = null,
  title = null,
}: TableProps<T>) {
  const { t } = useTranslation();
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      globalFilter: searchValue,
    },
    onSortingChange: setSorting,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const LoadingSkeleton = () =>
    [...Array(loadingRowCount)].map((_, rowIndex) => (
      <tr key={rowIndex} className="bg-white border-b">
        {columns.map((_, colIndex) => (
          <td key={colIndex} className="px-4 py-3">
            <div
              className={`h-5 ${
                colIndex === columns.length - 1 ? "w-24" : "w-32"
              } bg-gray-200 rounded ${
                colIndex === columns.length - 1 ? "rounded-full" : ""
              } animate-pulse`}
            ></div>
          </td>
        ))}
      </tr>
    ));

  return (
    <div className={`space-y-6 ${className}`}>
      {showSearch && (
        <div className="flex items-center justify-between mb-6">
          {title || <div />}
          {/* <div className="flex items-center gap-4">
            <User size={20} className="text-gray-700" />
            <h1 className="text-2xl font-bold text-gray-700">
              {t("configurations.team.title")}
            </h1>
          </div> */}
          <div className={`flex items-center justify-${searchPosition} gap-2`}>
            {prependWithSearch}
            <input
              type="text"
              placeholder={t("common.search")}
              value={searchValue}
              onChange={(e) => onSearch?.(e.target.value)}
              className="max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-300 focus:border-gray-300"
            />
            {appendWithSearch}
          </div>
        </div>
      )}

      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto rounded-md">
          <table className="w-full text-sm text-left text-gray-500 ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-4 py-3 rounded-md">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading ? (
                <LoadingSkeleton />
              ) : table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 ">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-8 text-center text-gray-500 "
                  >
                    {t("common.noData")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showPagination &&
          !isLoading &&
          table.getRowModel().rows.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Button
                  color="light"
                  size="xs"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  {t("common.previous")}
                </Button>
                <Button
                  color="light"
                  size="xs"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  {t("common.next")}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">
                  {t("common.page")} {table.getState().pagination.pageIndex + 1}{" "}
                  {t("common.of")} {table.getPageCount()}
                </span>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

export type { TableProps };
