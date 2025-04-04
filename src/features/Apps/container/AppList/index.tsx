import { PuzzlePiece } from "@phosphor-icons/react";
import { Button, Table, TextInput } from "flowbite-react";
import { Eye } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../../components/Pagination";
import ListSkeleton from "../../../../components/SkeletonLoaders/ListSkeleton";
import { useCurrency } from "../../../../contexts/CurrencyContext";
import { fetchApps } from "../../../../services/api";
import { DEFAULT_ITEMS_PER_PAGE } from "../../../../shared/constants";

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
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApps = filteredApps.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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

      {isLoading ? (
        <ListSkeleton />
      ) : (
        <>
          <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-md">
            <Table>
              <Table.Head className="border-b h-[50px] border-gray-200 dark:border-gray-700">
                <Table.HeadCell>{t("apps.columns.name")}</Table.HeadCell>
                <Table.HeadCell>
                  {t("apps.columns.estimateRevenue")}
                </Table.HeadCell>
                <Table.HeadCell>
                  {`${t("apps.columns.estimateRevenue")} (USD)`}
                </Table.HeadCell>
                <Table.HeadCell>
                  {" "}
                  {`${t("apps.columns.totalCost")} (USD)`}
                </Table.HeadCell>
                <Table.HeadCell>{t("apps.columns.totalCost")}</Table.HeadCell>
                <Table.HeadCell>{t("apps.columns.netUSD")}</Table.HeadCell>
                <Table.HeadCell>{t("apps.columns.percentage")}</Table.HeadCell>
                <Table.HeadCell>{t("apps.columns.actions")}</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {paginatedApps.map((app) => (
                  <Table.Row
                    key={app.id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      <div
                        className="cursor-pointer flex items-center gap-2 hover:text-primary-600"
                        onClick={() => navigate(`/apps/${app.id}`)}
                      >
                        <div className="w-10 h-10 flex justify-center items-center border border-gray-200 dark:border-gray-700 rounded-md">
                          <img
                            src={app.icon || "/default-app-icon.png"} // Default icon if none provided
                            alt={app.name}
                            className="w-6 h-6"
                          />
                        </div>
                        <div>
                          <p>{app.name}</p>
                          <p className="text-gray-400 text-xs">
                            {app.platform}
                          </p>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>{app.estimateRevenue}</Table.Cell>
                    <Table.Cell>{app.estimateRevenueUSD}</Table.Cell>
                    <Table.Cell>{app.totalCostUSD}</Table.Cell>
                    <Table.Cell>{app.totalCostINR}</Table.Cell>
                    <Table.Cell>{formatCurrency(app.netUSD)}</Table.Cell>
                    <Table.Cell
                      className={`${
                        app.percentage <= 0.25
                          ? "text-red-500"
                          : app.percentage <= 0.5
                          ? "text-yellow-500"
                          : "text-green-500"
                      }`}
                    >
                      {app.percentage.toFixed(2)}%
                    </Table.Cell>
                    <Table.Cell className="flex gap-2">
                      <Button
                        size="xs"
                        color="light"
                        onClick={() => navigate(`/apps/${app.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>

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
        </>
      )}
    </div>
  );
};

export default AppList;
