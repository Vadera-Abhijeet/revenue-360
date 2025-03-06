import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, Table, Button, Badge } from "flowbite-react";
import {
  DollarSign,
  TrendingUp,
  BarChart2,
  Smartphone,
  ArrowRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useCurrency } from "../contexts/CurrencyContext";
import { useNotifications } from "../contexts/NotificationContext";
import DateRangePicker from "../components/DateRangePicker";
import StatCard from "../components/StatCard";
import { fetchDashboardData } from "../services/api";

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { formatCurrency } = useCurrency();
  const { addNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [startDate, setStartDate] = useState<Date>(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState<Date>(new Date());

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchDashboardData(startDate, endDate);
        setDashboardData(data);

        // Add sample notification
        if (Math.random() > 0.7) {
          addNotification({
            type: "warning",
            title: "High Ad Spend Alert",
            message:
              'Your Google Ads campaign "Summer Promotion" has exceeded the daily budget by 15%.',
          });
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        addNotification({
          type: "error",
          title: "Data Loading Error",
          message: "Failed to load dashboard data. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [startDate, endDate]);

  const handleDateRangeChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("dashboard.title")}
        </h1>
        <DateRangePicker onDateRangeChange={handleDateRangeChange} />
      </div>
      {isLoading || !dashboardData ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title={t("dashboard.summary.revenue")}
              value={dashboardData.summary.revenue}
              previousValue={dashboardData.summary.previousRevenue}
              isCurrency={true}
              icon={<DollarSign size={24} />}
              color="success"
            />
            <StatCard
              title={t("dashboard.summary.spend")}
              value={dashboardData.summary.adSpend}
              previousValue={dashboardData.summary.previousAdSpend}
              isCurrency={true}
              icon={<TrendingUp size={24} />}
              color="danger"
            />
            <StatCard
              title={t("dashboard.summary.roi")}
              value={dashboardData.summary.roi}
              previousValue={dashboardData.summary.previousRoi}
              isPercentage={true}
              icon={<BarChart2 size={24} />}
              color="primary"
            />
            <StatCard
              title={t("dashboard.summary.apps")}
              value={dashboardData.summary.activeApps}
              previousValue={dashboardData.summary.previousActiveApps}
              icon={<Smartphone size={24} />}
              color="info"
            />
          </div>

          {/* Revenue vs Ad Spend Chart */}
          <Card>
            <h5 className="text-xl font-bold mb-2 text-gray-900">
              {t("dashboard.revenueVsSpend.title")}
            </h5>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dashboardData.revenueVsSpend}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    name={t("dashboard.revenueVsSpend.revenue")}
                    stroke="#10b981"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="adSpend"
                    name={t("dashboard.revenueVsSpend.spend")}
                    stroke="#ef4444"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Top Apps and Recent Campaigns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performing Apps */}
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h5 className="text-xl font-bold text-gray-900">
                  {t("dashboard.topApps.title")}
                </h5>
                <Button
                  color="light"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  View All <ArrowRight size={16} />
                </Button>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dashboardData.topApps}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === "revenue")
                          return formatCurrency(Number(value));
                        return value;
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="revenue"
                      name={t("dashboard.topApps.revenue")}
                      fill="#0ea5e9"
                    />
                    <Bar
                      dataKey="installs"
                      name={t("dashboard.topApps.installs")}
                      fill="#8b5cf6"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Recent Campaigns */}
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h5 className="text-xl font-bold text-gray-900">
                  {t("dashboard.recentCampaigns.title")}
                </h5>
                <Button
                  color="light"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  View All <ArrowRight size={16} />
                </Button>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <Table.Head>
                    <Table.HeadCell>
                      {t("dashboard.recentCampaigns.campaign")}
                    </Table.HeadCell>
                    <Table.HeadCell>
                      {t("dashboard.recentCampaigns.status")}
                    </Table.HeadCell>
                    <Table.HeadCell>
                      {t("dashboard.recentCampaigns.spend")}
                    </Table.HeadCell>
                    <Table.HeadCell>
                      {t("dashboard.recentCampaigns.conversions")}
                    </Table.HeadCell>
                    <Table.HeadCell>
                      {t("dashboard.recentCampaigns.cpa")}
                    </Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {dashboardData.recentCampaigns.map((campaign: any) => (
                      <Table.Row
                        key={campaign.id}
                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      >
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          {campaign.name}
                        </Table.Cell>
                        <Table.Cell>
                          <Badge
                            color={
                              campaign.status === "active"
                                ? "success"
                                : campaign.status === "paused"
                                ? "warning"
                                : "failure"
                            }
                            className="w-max capitalize"
                          >
                            {campaign.status}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>
                          {formatCurrency(campaign.spend)}
                        </Table.Cell>
                        <Table.Cell>{campaign.conversions}</Table.Cell>
                        <Table.Cell>{formatCurrency(campaign.cpa)}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
