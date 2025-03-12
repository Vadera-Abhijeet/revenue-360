import { useState, useEffect } from 'react';
import { ChartGroup } from '../../../interfaces';

const STORAGE_KEY = 'chart-configs';

export const useChartConfigs = (appId: string) => {
  const [groups, setGroups] = useState<ChartGroup[]>(() => {
    // First check for app-specific configurations
    const appSpecific = localStorage.getItem(`${STORAGE_KEY}-${appId}`);
    if (appSpecific) {
      return JSON.parse(appSpecific);
    }

    // If no app-specific config exists, check for global templates
    const globalTemplates = localStorage.getItem('global-chart-configs');
    if (globalTemplates) {
      const templates = JSON.parse(globalTemplates);
      // Create a deep copy and assign new IDs to avoid conflicts
      const newGroups = templates.map((group: ChartGroup) => ({
        ...group,
        id: crypto.randomUUID(),
        charts: group.charts.map(chart => ({
          ...chart,
          id: crypto.randomUUID()
        }))
      }));
      // Save the new configuration for this specific app
      localStorage.setItem(`${STORAGE_KEY}-${appId}`, JSON.stringify(newGroups));
      return newGroups;
    }

    // Default configuration if neither exists
    return [
      {
        id: crypto.randomUUID(),
        name: 'Revenue',
        order: 0,
        charts: [
          {
            id: crypto.randomUUID(),
            name: 'Revenue vs Ad Spend',
            type: 'line',
            xAxis: 'date',
            yAxis: ['revenue', 'adSpend'],
            groupId: '1',
            order: 0,
          },
        ],
      },
      {
        id: crypto.randomUUID(),
        name: 'Users',
        order: 1,
        charts: [
          {
            id: crypto.randomUUID(),
            name: 'User Growth',
            type: 'bar',
            xAxis: 'date',
            yAxis: ['newUsers', 'activeUsers'],
            groupId: '2',
            order: 0,
          },
        ],
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}-${appId}`, JSON.stringify(groups));
  }, [groups, appId]);

  const updateGroups = (newGroups: ChartGroup[]) => {
    setGroups(newGroups);
  };

  return { groups, updateGroups };
};