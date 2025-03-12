import React, { useState } from "react";
import { Button, Card, Tabs } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { ChartConfig, ChartGroup } from "../../../interfaces";
import ConfigurableChart from "./ConfigurableChart";
import ChartConfigModal from "./ChartConfigModal";
import ChartGroupModal from "./ChartGroupModal";
import { Plus, Edit2, Trash2, Settings } from "lucide-react";

interface ChartManagerProps {
  data: any[];
  groups: ChartGroup[];
  onUpdateGroups: (groups: ChartGroup[]) => void;
  availableAxes: { value: string; label: string }[];
}

const ChartManager: React.FC<ChartManagerProps> = ({
  data,
  groups,
  onUpdateGroups,
  availableAxes,
}) => {
  const { t } = useTranslation();
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [selectedChart, setSelectedChart] = useState<ChartConfig | undefined>();
  const [selectedGroup, setSelectedGroup] = useState<ChartGroup | undefined>();

  const handleSaveChart = (config: ChartConfig) => {
    const updatedGroups = [...groups];
    const groupIndex = updatedGroups.findIndex(
      (group) => group.id === config.groupId
    );

    if (groupIndex === -1) return;

    if (selectedChart) {
      // Update existing chart
      const chartIndex = updatedGroups[groupIndex].charts.findIndex(
        (chart) => chart.id === selectedChart.id
      );
      if (chartIndex !== -1) {
        updatedGroups[groupIndex].charts[chartIndex] = config;
      }
    } else {
      // Add new chart
      updatedGroups[groupIndex].charts.push({
        ...config,
        order: updatedGroups[groupIndex].charts.length,
      });
    }

    onUpdateGroups(updatedGroups);
    setSelectedChart(undefined);
  };

  const handleSaveGroup = (group: ChartGroup) => {
    let updatedGroups: ChartGroup[];

    if (selectedGroup) {
      // Update existing group
      updatedGroups = groups.map((g) =>
        g.id === selectedGroup.id ? { ...group, charts: g.charts } : g
      );
    } else {
      // Add new group
      updatedGroups = [
        ...groups,
        { ...group, order: groups.length, charts: [] },
      ];
    }

    onUpdateGroups(updatedGroups);
    setSelectedGroup(undefined);
  };

  const handleDeleteChart = (groupId: string, chartId: string) => {
    const updatedGroups = groups.map((group) => {
      if (group.id === groupId) {
        return {
          ...group,
          charts: group.charts.filter((chart) => chart.id !== chartId),
        };
      }
      return group;
    });
    onUpdateGroups(updatedGroups);
  };

  const handleDeleteGroup = (groupId: string) => {
    const updatedGroups = groups.filter((group) => group.id !== groupId);
    onUpdateGroups(updatedGroups);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button
          size="sm"
          color="indigo"
          onClick={() => setIsGroupModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("charts.addGroup")}
        </Button>
      </div>

      <Tabs aria-label="Chart groups" style="pills">
        {groups.map((group) => (
          <Tabs.Item key={group.id} title={group.name}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  color="indigo"
                  onClick={() => {
                    setSelectedChart(undefined);
                    setIsChartModalOpen(true);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t("charts.addChart")}
                </Button>
                <Button
                  size="sm"
                  color="light"
                  onClick={() => {
                    setSelectedGroup(group);
                    setIsGroupModalOpen(true);
                  }}
                >
                  <Edit2 className="mr-2 h-4 w-4" />
                  {t("charts.editGroup")}
                </Button>
                <Button
                  size="sm"
                  color="failure"
                  onClick={() => handleDeleteGroup(group.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t("charts.deleteGroup")}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {group.charts.map((chart) => (
                <Card key={chart.id}>
                  <div className="flex justify-between items-center mb-4">
                    <h5 className="text-xl font-bold text-gray-900">
                      {chart.name}
                    </h5>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        color="light"
                        onClick={() => {
                          setSelectedChart(chart);
                          setIsChartModalOpen(true);
                        }}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        color="failure"
                        onClick={() => handleDeleteChart(group.id, chart.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <ConfigurableChart config={chart} data={data} />
                </Card>
              ))}
            </div>
          </Tabs.Item>
        ))}
      </Tabs>

      <ChartConfigModal
        isOpen={isChartModalOpen}
        onClose={() => {
          setIsChartModalOpen(false);
          setSelectedChart(undefined);
        }}
        onSave={handleSaveChart}
        groups={groups}
        initialConfig={selectedChart}
        availableAxes={availableAxes}
      />

      <ChartGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => {
          setIsGroupModalOpen(false);
          setSelectedGroup(undefined);
        }}
        onSave={handleSaveGroup}
        initialGroup={selectedGroup}
      />
    </div>
  );
};

export default ChartManager;
