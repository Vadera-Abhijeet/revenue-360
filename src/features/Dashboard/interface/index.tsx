export interface IDashboard {
  summary: ISummary;
  revenueVsSpend?: IRevenueVsSpendEntity[];
  topApps?: ITopAppsEntity[];
  recentCampaigns?: IRecentCampaignsEntity[];
}

export interface ISummary {
  revenue: number;
  previousRevenue: number;
  estimatedRevenue: number; // New field
  previousEstimatedRevenue: number; // New field
  adSpend: number;
  previousAdSpend: number;
  roi: number;
  previousRoi: number;
  activeApps: number;
  previousActiveApps: number;
}

export interface IRevenueVsSpendEntity {
  date: string;
  revenue: number;
  adSpend: number;
}

export interface ITopAppsEntity {
  name: string;
  revenue: number;
  installs: number;
  roi: number;
}

export interface IRecentCampaignsEntity {
  id: string;
  name: string;
  status: string;
  spend: number;
  conversions: number;
  cpa: number;
}
