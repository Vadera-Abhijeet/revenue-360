import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Badge, Button, Card, Dropdown, Tabs, Tooltip } from "flowbite-react";
import {
  Users,
  TrendingUp,
  DollarSign,
  Download,
  Plus,
  Trash,
  Pen,
} from "lucide-react";
import { useChartConfig } from "../../../../contexts/ChartConfigContext";
import { ChartConfig, ChartGroup } from "../../../../interfaces";
import { fetchAppDetails } from "../../../../services/api";
import DateRangePicker from "../../../../components/DateRangePicker";
import StatCard from "../../../../components/StatCard";
import { IAppData } from "../../interface";
import { DotsThreeVertical } from "@phosphor-icons/react";
import ConfigurableChart from "../../../../components/ChartComponents/ConfigurableChart";
import ChartGroupModal from "../../../../components/ChartComponents/ChartGroupModal";
import ChartConfigModal from "../../../../components/ChartComponents/ChartConfigModal";

const AppDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { getConfigsForCampaign, updateCampaignConfigs } = useChartConfig();
  const [isLoading, setIsLoading] = useState(true);
  const [appData, setAppData] = useState<IAppData>();
  const [startDate, setStartDate] = useState<Date>(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [isAddTabModalOpen, setIsAddTabModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<string | null>(null);
  const [groups, setGroups] = useState<ChartGroup[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedConfig, setSelectedConfig] = useState<ChartConfig>();
  const [selectedGroup, setSelectedGroup] = useState<ChartGroup>();

  useEffect(() => {
    if (id) {
      const configs = getConfigsForCampaign(id);
      setGroups(configs);
      if (configs.length > 0 && currentTab === null) {
        setCurrentTab(configs[0].id);
      }
    }
  }, [id, getConfigsForCampaign, currentTab]);

  const availableAxes = [
    { value: "date", label: t("charts.axes.date") },
    { value: "revenue", label: t("charts.axes.revenue") },
    { value: "adSpend", label: t("charts.axes.adSpend") },
    { value: "adRevenue", label: t("charts.axes.adRevenue") },
    { value: "iapRevenue", label: t("charts.axes.iapRevenue") },
    { value: "newUsers", label: t("charts.axes.newUsers") },
    { value: "activeUsers", label: t("charts.axes.activeUsers") },
    { value: "totalUsers", label: t("charts.axes.totalUsers") },
  ];

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

  const handleDateRangeChange = useCallback((start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  }, []);

  const handleSaveChart = (config: ChartConfig) => {
    if (!id || !currentTab) return;

    const updatedGroups = groups.map((group) => {
      if (group.id === currentTab) {
        return {
          ...group,
          charts: [...group.charts, { ...config, groupId: currentTab }],
        };
      }
      return group;
    });

    setGroups(updatedGroups);
    updateCampaignConfigs(id, updatedGroups);
    setSelectedConfig(undefined);
    setIsChartModalOpen(false);
  };

  const handleEditChart = (config: ChartConfig) => {
    if (!id || !currentTab) return;

    const updatedGroups = groups.map((group) => {
      return group.id === currentTab
        ? {
            ...group,
            charts: group.charts.map((chart) => {
              return chart.id === config.id ? { ...chart, ...config } : chart;
            }),
          }
        : group;
    });
    setGroups(updatedGroups);
    setSelectedConfig(undefined);
    updateCampaignConfigs(id, updatedGroups);
    setIsChartModalOpen(false);
  };

  const handleDeleteChart = (chartId: string) => {
    if (!id || !currentTab) return;

    const updatedGroups = groups.map((group) => {
      if (group.id === currentTab) {
        return {
          ...group,
          charts: group.charts.filter((chart) => chart.id !== chartId),
        };
      }
      return group;
    });

    setGroups(updatedGroups);
    updateCampaignConfigs(id, updatedGroups);
  };

  const handleDeleteGroup = (groupId: string) => {
    if (!id || !currentTab) return;

    const updatedGroups = groups.filter((group) => group.id !== groupId);
    setTimeout(() => {
      setActiveTab(0);
      setCurrentTab(groups[0].id);
    }, 100);
    setGroups(updatedGroups);
    updateCampaignConfigs(id, updatedGroups);
  };

  const resetTabState = () => {
    const lastCurrentTab = localStorage.getItem("lastCurrentTab");
    const lastActiveTab = Number(localStorage.getItem("lastActiveTab") || "0");

    setCurrentTab(lastCurrentTab);
    setActiveTab(lastActiveTab);

    localStorage.removeItem("lastActiveTab");
    localStorage.removeItem("lastCurrentTab");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{appData?.name}</h1>
          {appData && (
            <div className="flex items-center mt-2">
              <Badge color="info" className="mr-2 capitalize">
                {appData?.platform}
              </Badge>
              <Badge color="light">{appData?.category}</Badge>
            </div>
          )}
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

          {/* Chart Tabs */}
          {groups.length === 0 ? (
            <Card className="items-center min-h-80 justify-center">
              <div>
                <p className="mb-4 text-gray-600 dark:text-white">
                  {t("charts.noChartAvailable")}
                </p>
                <Button
                  color="indigo"
                  onClick={() => setIsAddTabModalOpen(true)}
                >
                  <div className="flex items-center gap-2">
                    <Plus size={16} className="mr-2" />
                    {t("charts.addGroup")}
                  </div>
                </Button>
              </div>
            </Card>
          ) : (
            <div className="relative">
              <Tabs
                className="w-full"
                style="pills"
                onActiveTabChange={(tab) => {
                  setActiveTab(tab);
                  const selectedGroup = groups[tab];
                  setCurrentTab(selectedGroup.id);
                }}
              >
                {groups.map((group, index) => (
                  <Tabs.Item
                    active={index === activeTab}
                    key={group.id}
                    title={
                      <div className="flex items-center gap-2">
                        {group.name}
                        <Dropdown
                          placement="bottom"
                          arrowIcon={false}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          inline
                          label={
                            <DotsThreeVertical
                              size={20}
                              color={index === activeTab ? "white" : "gray"}
                            />
                          }
                          theme={{
                            inlineWrapper:
                              "flex items-center text-indigo-600 hover:text-indigo-900",
                          }}
                        >
                          {[
                            {
                              icon: <Pen size={16} />,
                              label: (
                                <p className="capitalize">{t("common:edit")}</p>
                              ),
                              onClick: () => {
                                setIsAddTabModalOpen(true);
                                setSelectedGroup(group);
                              },
                            },
                            {
                              icon: <Trash color="red" size={16} />,
                              label: (
                                <p className="capitalize text-red-700">
                                  {t("common:delete")}
                                </p>
                              ),
                              onClick: () => handleDeleteGroup(group.id),
                            },
                          ].map(({ icon, label, onClick }, index) => (
                            <Dropdown.Item
                              key={index}
                              onClick={() => onClick()}
                            >
                              <div className="flex gap-2 items-center">
                                {icon}
                                {label}
                              </div>
                            </Dropdown.Item>
                          ))}
                        </Dropdown>
                      </div>
                    }
                  >
                    {group.charts.length === 0 ? (
                      <div className="flex flex-col items-center justify-center  min-h-80 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <p className="text-gray-500 dark:text-white">
                          {t("charts.noChartAvailable")}
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {group.charts.map((chart) => (
                          <Card
                            key={chart.id}
                            className="relative overflow-hidden"
                            theme={{
                              root: {
                                children:
                                  "flex h-full flex-col justify-between gap-4 p-0 pb-4",
                              },
                            }}
                          >
                            <div className="mb-4 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
                              <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white ">
                                {chart.name}
                              </h5>
                              <div className="flex gap-2">
                                <Tooltip content={t("common.edit")}>
                                  <Button
                                    size="xs"
                                    color="light"
                                    onClick={() => {
                                      setIsChartModalOpen(true);
                                      setSelectedConfig(chart);
                                    }}
                                  >
                                    <Pen size={16} />
                                  </Button>
                                </Tooltip>
                                <Tooltip content={t("common.delete")}>
                                  <Button
                                    size="xs"
                                    color="failure"
                                    onClick={() => handleDeleteChart(chart.id)}
                                  >
                                    <Trash size={16} />
                                  </Button>
                                </Tooltip>
                              </div>
                            </div>
                            <div className="pr-6">
                              <ConfigurableChart
                                config={chart}
                                data={appData[chart.dataKey] || []}
                              />
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </Tabs.Item>
                ))}
              </Tabs>
              <div className="absolute top-0 right-0 flex items-center gap-2">
                <Button
                  color="indigo"
                  onClick={() => setIsAddTabModalOpen(true)}
                >
                  <div className="flex items-center gap-2">
                    <Plus size={16} className="mr-2" />
                    {t("charts.addGroup")}
                  </div>
                </Button>
                <Button color="light" onClick={() => setIsChartModalOpen(true)}>
                  <div className="flex items-center gap-2">
                    <Plus size={16} className="mr-2" />
                    {t("charts.addChart")}
                  </div>
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      <ChartGroupModal
        key={isAddTabModalOpen.toString()}
        isOpen={isAddTabModalOpen}
        onClose={() => {
          setIsAddTabModalOpen(false);
          resetTabState();
        }}
        onSave={(chartGroup) => {
          setGroups((prevGroups) => {
            const updatedGroups = [...prevGroups, chartGroup];
            if (id) updateCampaignConfigs(id, updatedGroups);
            return updatedGroups;
          });

          setIsAddTabModalOpen(false);
          setSelectedGroup(undefined);
          resetTabState();

          if (groups.length === 0) {
            setIsChartModalOpen(true);
          }
        }}
        onEdit={(chartGroup) => {
          setGroups((prevGroups) => {
            const updatedGroups = prevGroups.map((grp) =>
              grp.id === chartGroup.id ? chartGroup : grp
            );
            if (id) updateCampaignConfigs(id, updatedGroups);
            return updatedGroups;
          });

          setIsAddTabModalOpen(false);
          setSelectedGroup(undefined);
          resetTabState();
        }}
        initialGroup={selectedGroup}
      />

      {/* Chart Configuration Modal */}
      <ChartConfigModal
        isOpen={isChartModalOpen}
        onClose={() => {
          setIsChartModalOpen(false);
          setSelectedConfig(undefined);
        }}
        onSave={handleSaveChart}
        onEdit={handleEditChart}
        availableAxes={availableAxes}
        initialConfig={selectedConfig}
      />
    </div>
  );
};

export default AppDetail;
