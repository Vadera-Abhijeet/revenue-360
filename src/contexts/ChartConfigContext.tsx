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
  appConfigs: Record<string, ChartGroup[]>;
  campaignConfigs: Record<string, ChartGroup[]>;
  updateAppConfigs: (appId: string, configs: ChartGroup[]) => void;
  updateCampaignConfigs: (campaignId: string, configs: ChartGroup[]) => void;
  getConfigsForApp: (appId: string) => ChartGroup[];
  getConfigsForCampaign: (campaignId: string) => ChartGroup[];
}

const ChartConfigContext = createContext<ChartConfigContextType | undefined>(
  undefined
);

const DEFAULT_COMMON_CHART_GROUPS: ChartGroup[] = [
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

const DEFAULT_APP_GROUPS: ChartGroup[] = [
  ...DEFAULT_COMMON_CHART_GROUPS,
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
];
const DEFAULT_CAMPAIGN_GROUPS: ChartGroup[] = [
  ...DEFAULT_COMMON_CHART_GROUPS,
  {
    id: "campaign",
    name: "Campaign",
    order: 1,
    charts: [
      {
        id: "campaign_chart",
        name: "Campaign Performance",
        type: "line",
        xAxis: "date",
        yAxis: ["clicks", "conversions", "impressions"],
        groupId: "campaign",
        order: 1,
        dataKey: "campaignData",
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
  const [appConfigs, setAppConfigs] = useState<Record<string, ChartGroup[]>>(
    () => {
      const stored = localStorage.getItem("app-chart-configs");
      return stored ? JSON.parse(stored) : {};
    }
  );

  const [campaignConfigs, setCampaignConfigs] = useState<
    Record<string, ChartGroup[]>
  >(() => {
    const stored = localStorage.getItem("campaign-chart-configs");
    return stored ? JSON.parse(stored) : {};
  });

  useEffect(() => {
    localStorage.setItem("app-chart-configs", JSON.stringify(appConfigs));
  }, [appConfigs]);

  useEffect(() => {
    localStorage.setItem(
      "campaign-chart-configs",
      JSON.stringify(campaignConfigs)
    );
  }, [campaignConfigs]);

  const updateAppConfigs = useCallback(
    (appId: string, configs: ChartGroup[]) => {
      setAppConfigs((prev) => ({
        ...prev,
        [appId]: configs,
      }));
    },
    []
  );

  const updateCampaignConfigs = useCallback(
    (campaignId: string, configs: ChartGroup[]) => {
      setCampaignConfigs((prev) => ({
        ...prev,
        [campaignId]: configs,
      }));
    },
    []
  );

  const getConfigsForApp = useCallback(
    (appId: string): ChartGroup[] => {
      return appConfigs[appId] || DEFAULT_APP_GROUPS;
    },
    [appConfigs]
  );

  const getConfigsForCampaign = useCallback(
    (campaignId: string): ChartGroup[] => {
      return campaignConfigs[campaignId] || DEFAULT_CAMPAIGN_GROUPS;
    },
    [campaignConfigs]
  );

  const value = {
    appConfigs,
    campaignConfigs,
    updateAppConfigs,
    updateCampaignConfigs,
    getConfigsForApp,
    getConfigsForCampaign,
  };

  return (
    <ChartConfigContext.Provider value={value}>
      {children}
    </ChartConfigContext.Provider>
  );
};
