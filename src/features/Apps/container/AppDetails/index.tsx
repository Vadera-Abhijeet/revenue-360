import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Tabs, Card, Table, Badge } from "flowbite-react";
import {
  BarChart2,
  Users,
  TrendingUp,
  Globe,
  Tag,
  DollarSign,
  Download,
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useCurrency } from "../../../../contexts/CurrencyContext";
import { fetchAppDetails } from "../../../../services/api";
import DateRangePicker from "../../../../components/DateRangePicker";
import StatCard from "../../../../components/StatCard";

const AppDetail: React.FC = () => {
  const { t } = useTranslation();
  const { formatCurrency } = useCurrency();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [appData, setAppData] = useState<any>(null);
  const [startDate, setStartDate] = useState<Date>(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState<Date>(new Date());

  useEffect(() => {
    const loadAppDetails = async () => {
      setIsLoading(true);
      try {
        if (id) {
          const data = await fetchAppDetails(id, startDate, endDate);
          setAppData(data);
        }
      } catch (error) {
        console.error("Error loading app details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAppDetails();
  }, [id, startDate, endDate]);

  const handleDateRangeChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];
  // Define which data sets to plot dynamically
  const chartConfigs = [
    {
      label: "Revenue",
      key: "revenueData",
      charts: [
        { title: "Total Revenue", lines: ["revenue"] },
        { title: "Ad vs IAP Revenue", lines: ["adRevenue", "iapRevenue"] },
      ],
    },
    {
      label: "Users",
      key: "userData",
      charts: [
        { title: "New vs Active Users", lines: ["newUsers", "activeUsers"] },
        { title: "Total Users Growth", lines: ["totalUsers"] },
      ],
    },
    {
      label: "Retention",
      key: "retentionData",
      charts: [{ title: "Retention Rate", lines: ["retention"], xKey: "day" }],
    },
    {
      label: "Versions",
      key: "versionData",
      charts: [
        { title: "Crashes per Version", lines: ["crashes"], xKey: "version" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{appData?.name}</h1>
          <div className="flex items-center mt-2">
            {appData?.platform && (
              <Badge color="info" className="mr-2">
                {appData?.platform}
              </Badge>
            )}
            {appData?.category && (
              <Badge color="light">{appData?.category}</Badge>
            )}
          </div>
        </div>
        <DateRangePicker onDateRangeChange={handleDateRangeChange} />
      </div>
      {isLoading || !appData ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title={t("dashboard.summary.revenue")}
              value={appData.summary.revenue}
              previousValue={appData.summary.previousRevenue}
              isCurrency={true}
              icon={<DollarSign size={24} />}
              color="success"
            />
            <StatCard
              title={t("apps.columns.installs")}
              value={appData.summary.installs}
              previousValue={appData.summary.previousInstalls}
              icon={<Download size={24} />}
              color="primary"
            />
            <StatCard
              title={t("apps.detail.activeUsers")}
              value={appData.summary.activeUsers}
              previousValue={appData.summary.previousActiveUsers}
              icon={<Users size={24} />}
              color="purple"
            />
            <StatCard
              title={t("apps.columns.retention")}
              value={appData.summary.retention}
              previousValue={appData.summary.previousRetention}
              icon={<TrendingUp size={24} />}
              color="yellow"
            />
          </div>

          {/* Tabs for different metrics */}
          <Tabs aria-label="App metrics tabs">
            <Tabs.Item
              active
              title={t("apps.detail.overview")}
              icon={BarChart2}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <h5 className="text-xl font-bold mb-2 text-gray-900">
                    Revenue Trend
                  </h5>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={appData.revenueData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => formatCurrency(Number(value))}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          name="Total Revenue"
                          stroke="#0ea5e9"
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="adRevenue"
                          name="Ad Revenue"
                          stroke="#8b5cf6"
                        />
                        <Line
                          type="monotone"
                          dataKey="iapRevenue"
                          name="IAP Revenue"
                          stroke="#10b981"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card>
                  <h5 className="text-xl font-bold mb-2 text-gray-900">
                    User Metrics
                  </h5>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={appData.userData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="newUsers"
                          name="New Users"
                          stroke="#0ea5e9"
                        />
                        <Line
                          type="monotone"
                          dataKey="activeUsers"
                          name="Active Users"
                          stroke="#10b981"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            </Tabs.Item>

            <Tabs.Item title={t("apps.detail.revenue")} icon={DollarSign}>
              <Card>
                <h5 className="text-xl font-bold mb-2 text-gray-900">
                  Revenue Breakdown
                </h5>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            {
                              name: "Ad Revenue",
                              value: appData.revenueData.reduce(
                                (sum: number, item: any) =>
                                  sum + item.adRevenue,
                                0
                              ),
                            },
                            {
                              name: "IAP Revenue",
                              value: appData.revenueData.reduce(
                                (sum: number, item: any) =>
                                  sum + item.iapRevenue,
                                0
                              ),
                            },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {[
                            {
                              name: "Ad Revenue",
                              value: appData.revenueData.reduce(
                                (sum: number, item: any) =>
                                  sum + item.adRevenue,
                                0
                              ),
                            },
                            {
                              name: "IAP Revenue",
                              value: appData.revenueData.reduce(
                                (sum: number, item: any) =>
                                  sum + item.iapRevenue,
                                0
                              ),
                            },
                          ].map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => formatCurrency(Number(value))}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h6 className="text-lg font-semibold mb-4">
                      Revenue Sources
                    </h6>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-base font-medium">
                            Ad Revenue
                          </span>
                          <span className="text-sm font-medium">
                            {formatCurrency(
                              appData.revenueData.reduce(
                                (sum: number, item: any) =>
                                  sum + item.adRevenue,
                                0
                              )
                            )}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: "65%" }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-base font-medium">
                            IAP Revenue
                          </span>
                          <span className="text-sm font-medium">
                            {formatCurrency(
                              appData.revenueData.reduce(
                                (sum: number, item: any) =>
                                  sum + item.iapRevenue,
                                0
                              )
                            )}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-green-600 h-2.5 rounded-full"
                            style={{ width: "35%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Tabs.Item>

            <Tabs.Item title={t("apps.detail.users")} icon={Users}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <h5 className="text-xl font-bold mb-2 text-gray-900">
                    User Growth
                  </h5>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={appData.userData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="newUsers"
                          name="New Users"
                          fill="#0ea5e9"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card>
                  <h5 className="text-xl font-bold mb-2 text-gray-900">
                    Active Users
                  </h5>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={appData.userData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="activeUsers"
                          name="Daily Active Users"
                          stroke="#10b981"
                        />
                        <Line
                          type="monotone"
                          dataKey="totalUsers"
                          name="Total Users"
                          stroke="#8b5cf6"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            </Tabs.Item>

            <Tabs.Item title={t("apps.detail.retention")} icon={TrendingUp}>
              <Card>
                <h5 className="text-xl font-bold mb-2 text-gray-900">
                  Retention Curve
                </h5>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={appData.retentionData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Line
                        type="monotone"
                        dataKey="retention"
                        name="Retention Rate"
                        stroke="#0ea5e9"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Tabs.Item>

            <Tabs.Item title={t("apps.detail.countries")} icon={Globe}>
              <Card>
                <h5 className="text-xl font-bold mb-2 text-gray-900">
                  Top Countries
                </h5>
                <div className="overflow-x-auto">
                  <Table>
                    <Table.Head>
                      <Table.HeadCell>Country</Table.HeadCell>
                      <Table.HeadCell>Users</Table.HeadCell>
                      <Table.HeadCell>Revenue</Table.HeadCell>
                      <Table.HeadCell>ARPU</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      {appData.countryData.map(
                        (country: any, index: number) => (
                          <Table.Row
                            key={index}
                            className="bg-white dark:border-gray-700 dark:bg-gray-800"
                          >
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                              {country.country}
                            </Table.Cell>
                            <Table.Cell>
                              {country.users.toLocaleString()}
                            </Table.Cell>
                            <Table.Cell>
                              {formatCurrency(country.revenue)}
                            </Table.Cell>
                            <Table.Cell>
                              {formatCurrency(country.revenue / country.users)}
                            </Table.Cell>
                          </Table.Row>
                        )
                      )}
                    </Table.Body>
                  </Table>
                </div>
              </Card>
            </Tabs.Item>

            <Tabs.Item title={t("apps.detail.versions")} icon={Tag}>
              <Card>
                <h5 className="text-xl font-bold mb-2 text-gray-900">
                  App Versions
                </h5>
                <div className="overflow-x-auto">
                  <Table>
                    <Table.Head>
                      <Table.HeadCell>Version</Table.HeadCell>
                      <Table.HeadCell>Users</Table.HeadCell>
                      <Table.HeadCell>% of Total</Table.HeadCell>
                      <Table.HeadCell>Crashes</Table.HeadCell>
                      <Table.HeadCell>Crash Rate</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      {appData.versionData.map(
                        (version: any, index: number) => (
                          <Table.Row
                            key={index}
                            className="bg-white dark:border-gray-700 dark:bg-gray-800"
                          >
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                              {version.version}
                            </Table.Cell>
                            <Table.Cell>
                              {version.users.toLocaleString()}
                            </Table.Cell>
                            <Table.Cell>
                              {(
                                (version.users /
                                  appData.versionData.reduce(
                                    (sum: number, v: any) => sum + v.users,
                                    0
                                  )) *
                                100
                              ).toFixed(1)}
                              %
                            </Table.Cell>
                            <Table.Cell>{version.crashes}</Table.Cell>
                            <Table.Cell>
                              <Badge
                                color={
                                  version.crashes / version.users < 0.01
                                    ? "success"
                                    : "failure"
                                }
                                className="w-max capitalize"
                              >
                                {(
                                  (version.crashes / version.users) *
                                  100
                                ).toFixed(2)}
                                %
                              </Badge>
                            </Table.Cell>
                          </Table.Row>
                        )
                      )}
                    </Table.Body>
                  </Table>
                </div>
              </Card>
            </Tabs.Item>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default AppDetail;
