import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { ChartGroup } from "../interfaces";

interface ChartConfigContextType {
  globalConfigs: ChartGroup[];
  appConfigs: Record<string, ChartGroup[]>;
  updateGlobalConfigs: (configs: ChartGroup[]) => void;
  updateAppConfigs: (appId: string, configs: ChartGroup[]) => void;
  getConfigsForApp: (appId: string) => ChartGroup[];
}

const ChartConfigContext = createContext<ChartConfigContextType | undefined>(
  undefined
);

const DEFAULT_CHART_GROUPS: ChartGroup[] = [
  {
    id: "revenue",
    name: "Revenue",
    order: 1,
    charts: [
      {
        id: "rev_chart",
        name: "Revenue Chart",
        type: "line",
        xAxis: "date",
        yAxis: ["revenue", "adRevenue", "iapRevenue"],
        groupId: "revenue",
        order: 1,
        dataKey: "revenueData", // New flag for dataset selection
      },
    ],
  },
  {
    id: "users",
    name: "Users",
    order: 2,
    charts: [
      {
        id: "users_chart",
        name: "User Growth",
        type: "bar",
        xAxis: "date",
        yAxis: ["newUsers", "activeUsers", "totalUsers"],
        groupId: "users",
        order: 1,
        dataKey: "userData", // New flag for dataset selection
      },
    ],
  },
  {
    id: "retention",
    name: "Retention",
    order: 3,
    charts: [
      {
        id: "retention_chart",
        name: "Retention Curve",
        type: "area",
        xAxis: "day",
        yAxis: ["retention"],
        groupId: "retention",
        order: 1,
        dataKey: "retentionData",
      },
    ],
  },
  {
    id: "countries",
    name: "Countries",
    order: 4,
    charts: [
      {
        id: "country_chart",
        name: "Country Distribution",
        type: "pie",
        xAxis: "country",
        yAxis: ["users", "revenue"],
        groupId: "countries",
        order: 1,
        dataKey: "countryData",
      },
    ],
  },
  {
    id: "versions",
    name: "Versions",
    order: 5,
    charts: [
      {
        id: "versions_chart",
        name: "App Versions",
        type: "bar",
        xAxis: "version",
        yAxis: ["users", "crashes"],
        groupId: "versions",
        order: 1,
        dataKey: "versionData",
      },
    ],
  },
];

export const useChartConfig = () => {
  const context = useContext(ChartConfigContext);
  if (context === undefined) {
    throw new Error("useChartConfig must be used within a ChartConfigProvider");
  }
  return context;
};

interface ChartConfigProviderProps {
  children: ReactNode;
}

export const ChartConfigProvider: React.FC<ChartConfigProviderProps> = ({
  children,
}) => {
  const [globalConfigs, setGlobalConfigs] = useState<ChartGroup[]>(() => {
    const stored = localStorage.getItem("global-chart-configs");
    if (stored) {
      const storedGroups: ChartGroup[] = JSON.parse(stored);
      return storedGroups.length ? storedGroups : DEFAULT_CHART_GROUPS;
    }
    return DEFAULT_CHART_GROUPS;
  });

  const [appConfigs, setAppConfigs] = useState<Record<string, ChartGroup[]>>(
    () => {
      const stored = localStorage.getItem("app-chart-configs");
      return stored ? JSON.parse(stored) : {};
    }
  );

  useEffect(() => {
    localStorage.setItem("global-chart-configs", JSON.stringify(globalConfigs));
  }, [globalConfigs]);

  useEffect(() => {
    localStorage.setItem("app-chart-configs", JSON.stringify(appConfigs));
  }, [appConfigs]);

  const updateGlobalConfigs = useCallback((configs: ChartGroup[]) => {
    setGlobalConfigs(configs);
  }, []);

  const updateAppConfigs = useCallback(
    (appId: string, configs: ChartGroup[]) => {
      setAppConfigs((prev) => ({
        ...prev,
        [appId]: configs,
      }));
    },
    []
  );

  const getConfigsForApp = useCallback(
    (appId: string): ChartGroup[] => {
      // If app has specific configs, return those
      if (appConfigs[appId]) {
        return appConfigs[appId];
      }

      // Return a copy of global configs with new IDs
      return globalConfigs.map((group) => ({
        ...group,
        id: crypto.randomUUID(),
        charts: group.charts.map((chart) => ({
          ...chart,
          id: crypto.randomUUID(),
        })),
      }));
    },
    [appConfigs, globalConfigs]
  );

  const value = {
    globalConfigs,
    appConfigs,
    updateGlobalConfigs,
    updateAppConfigs,
    getConfigsForApp,
  };

  return (
    <ChartConfigContext.Provider value={value}>
      {children}
    </ChartConfigContext.Provider>
  );
};
