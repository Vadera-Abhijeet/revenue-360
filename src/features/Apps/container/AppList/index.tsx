import { Button, Table, TextInput } from "flowbite-react";
import { Eye, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ConnectAppModal, {
  AppFormData,
} from "../../../../components/ConnectAppModal";
import { useCurrency } from "../../../../contexts/CurrencyContext";
import { fetchApps } from "../../../../services/api";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  };

  const handleConnectApp = (appData: AppFormData) => {
    // In a real app, this would send the data to the server
    const newApp: App = {
      id: `app-${Date.now()}`,
      name: appData.name,
      platform: appData.platform,
      estimateRevenueUSD: 0,
      estimateRevenue: formatCurrency(0), // Default formatted revenue
      totalCostUSD: 0,
      totalCostINR: formatCurrency(0),
      netUSD: 0,
      percentage: 0,
      icon: "/default-app-icon.png", // Default icon if not provided
    };

    setApps([...apps, newApp]);
    setIsModalOpen(false);
  };

  const filteredApps = apps.filter((app) => {
    const matchesSearch = app.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-indigo-700">
          {t("apps.title")}
        </h1>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="w-full">
            <TextInput
              id="search"
              type="text"
              color={"indigo"}
              icon={Search}
              placeholder={t("apps.search")}
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          {/* <div className="flex gap-2">
            <Dropdown
              label={
                <div className="flex items-center">
                  <Filter className="mr-2 h-5 w-5" />
                  {t("apps.filter")}
                </div>
              }
              color="light"
            >
              <Dropdown.Header>
                <span className="block text-sm font-medium">Platform</span>
              </Dropdown.Header>
              <Dropdown.Item onClick={() => setPlatformFilter(null)}>
                All
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setPlatformFilter("android")}>
                Android
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setPlatformFilter("ios")}>
                iOS
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setPlatformFilter("web")}>
                Web
              </Dropdown.Item>
            </Dropdown>
          </div> */}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
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
              {filteredApps.map((app) => (
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
                        <p className="text-gray-400 text-xs">{app.platform}</p>
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
      )}

      <ConnectAppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleConnectApp}
      />
    </div>
  );
};

export default AppList;
