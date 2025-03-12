export interface ICampaignData {
  id: string;
  name: string;
  platform: string;
  icon: string;
  country: string;
  flag: string;
  estimateRevenueUSD: number;
  estimateRevenue: string;
  totalCostUSD: number;
  totalCostINR: string;
  netUSD: number;
  percentage: number;
  lastBidINR: string;
  currentBidINR: string;
  chartData: {
    date: string;
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
  }[];
  campaigns: ICampaignsList;
}

export interface ICampaignsList {
  totalCost: number;
  data: { campaign: string; cost: number }[];
}

export type TDataKeyTypes =
  | "revenueData"
  | "userData"
  | "retentionData"
  | "countryData"
  | "versionData"
  | "campaignData";

export interface IAppData {
  id: string;
  name: string;
  platform: string;
  category: string;
  summary: ISummary;
  revenueData?: IRevenueDataEntity[] | null;
  userData?: IUserDataEntity[] | null;
  retentionData?: IRetentionDataEntity[] | null;
  countryData?: ICountryDataEntity[] | null;
  versionData?: IVersionDataEntity[] | null;
  campaignData?: ICampaignsDataEntity[] | null;
}
export interface ISummary {
  revenue: number;
  previousRevenue: number;
  installs: number;
  previousInstalls: number;
  activeUsers: number;
  previousActiveUsers: number;
  retention: number;
  previousRetention: number;
  rating: number;
  previousRating: number;
}
export interface IRevenueDataEntity {
  date: string;
  revenue: number;
  adRevenue: number;
  iapRevenue: number;
}
export interface IUserDataEntity {
  date: string;
  newUsers: number;
  activeUsers: number;
  totalUsers: number;
}
export interface IRetentionDataEntity {
  day: number;
  retention: number;
}
export interface ICountryDataEntity {
  country: string;
  users: number;
  revenue: number;
}
export interface IVersionDataEntity {
  version: string;
  users: number;
  crashes: number;
}

export interface ICampaignsDataEntity {
  date: string;
  clicks: number;
  conversions: number;
  impressions: number;
}
