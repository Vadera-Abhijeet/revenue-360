import { PuzzlePiece } from "@phosphor-icons/react";
import { Button, TextInput } from "flowbite-react";
import { Eye } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../../components/Pagination";
import { Table } from "../../../../components/Table";
import { useCurrency } from "../../../../contexts/CurrencyContext";
import { fetchApps } from "../../../../services/api";
import { DEFAULT_ITEMS_PER_PAGE } from "../../../../shared/constants";
import { ColumnDef } from "@tanstack/react-table";

interface App {
  id: string;
  name: string;
  platform: string;
  estimateRevenueUSD: number;
  estimateRevenue: string; // Formatted revenue with currency
  totalCostUSD: number;
  totalCostINR: string; // Formatted cost with currency
  netUSD: number; // Net earnings in USD
  percentage: number; // Profit percentage
  icon?: string; // New field for app image/icon
}

const AppList: React.FC = () => {
  const { t } = useTranslation();
  const { formatCurrency } = useCurrency();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [apps, setApps] = useState<App[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);

  useEffect(() => {
    const loadApps = async () => {
      setIsLoading(true);
      try {
        const data = await fetchApps();
        setApps(data);
      } catch (error) {
        console.error("Error loading apps:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadApps();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Filter apps based on search term
  const filteredApps = useMemo(() => {
    return apps.filter((app) =>
      app.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [apps, searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredApps.length / itemsPerPage);

  // Define columns for the table
  const columns: ColumnDef<App>[] = [
    {
      accessorKey: "name",
      header: t("apps.columns.name"),
      cell: ({ row }) => {
        const app = row.original;
        return (
          <div
            className="cursor-pointer flex items-center gap-2 hover:text-primary-600"
            onClick={() => navigate(`/apps/${app.id}`)}
          >
            <div className="w-10 h-10 flex justify-center items-center border border-gray-200 dark:border-gray-700 rounded-md">
              <img
                src={app.icon || "/default-app-icon.png"}
                alt={app.name}
                className="w-6 h-6"
              />
            </div>
            <div>
              <p>{app.name}</p>
              <p className="text-gray-400 text-xs">{app.platform}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "estimateRevenue",
      header: t("apps.columns.estimateRevenue"),
      cell: ({ row }) => row.original.estimateRevenue,
    },
    {
      accessorKey: "estimateRevenueUSD",
      header: `${t("apps.columns.estimateRevenue")} (USD)`,
      cell: ({ row }) => row.original.estimateRevenueUSD,
    },
    {
      accessorKey: "totalCostUSD",
      header: `${t("apps.columns.totalCost")} (USD)`,
      cell: ({ row }) => row.original.totalCostUSD,
    },
    {
      accessorKey: "totalCostINR",
      header: t("apps.columns.totalCost"),
      cell: ({ row }) => row.original.totalCostINR,
    },
    {
      accessorKey: "netUSD",
      header: t("apps.columns.netUSD"),
      cell: ({ row }) => formatCurrency(row.original.netUSD),
    },
    {
      accessorKey: "percentage",
      header: t("apps.columns.percentage"),
      cell: ({ row }) => {
        const percentage = row.original.percentage;
        return (
          <span
            className={`${
              percentage <= 0.25
                ? "text-red-500"
                : percentage <= 0.5
                ? "text-yellow-500"
                : "text-green-500"
            }`}
          >
            {percentage.toFixed(2)}%
          </span>
        );
      },
    },
    {
      id: "actions",
      header: t("apps.columns.actions"),
      cell: ({ row }) => {
        const app = row.original;
        return (
          <div className="flex gap-2">
            <Button
              size="xs"
              color="light"
              onClick={() => navigate(`/apps/${app.id}`)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <PuzzlePiece size={20} className="text-gray-700" />
          <h1 className="text-2xl font-bold text-gray-700">
            {t("apps.title")}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <TextInput
            type="text"
            placeholder={t("common.search")}
            value={searchTerm}
            onChange={handleSearch}
            className="w-64"
          />
        </div>
      </div>

      <Table
        data={filteredApps}
        columns={columns}
        isLoading={isLoading}
        showPagination={false}
        showSearch={false}
      />

      {totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredApps.length}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          itemsPerPage={itemsPerPage}
        />
      )}

      {/* <ConnectAppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleConnectApp}
      /> */}
    </div>
  );
};

export default AppList;
